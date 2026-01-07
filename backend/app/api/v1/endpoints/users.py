from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from datetime import datetime

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.user import User, ProductView, CartItem
from app.models.order import Order
from app.models.product import Product
from app.schemas.user import ProductViewCreate, CartItemCreate, CartItemUpdate
from app.schemas.order import Order as OrderSchema

router = APIRouter()


# User Orders

@router.get("/orders", response_model=List[OrderSchema])
async def get_my_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 20
):
    """Get current user's orders"""
    orders = db.query(Order).filter(
        Order.user_id == current_user.id
    ).order_by(desc(Order.created_at)).offset(skip).limit(limit).all()

    return orders


@router.get("/orders/{order_id}", response_model=OrderSchema)
async def get_my_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific order"""
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    return order


# Product Views (for reminders)

@router.post("/product-views")
async def track_product_view(
    view_in: ProductViewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Track that user viewed a product"""
    # Check if product exists
    product = db.query(Product).filter(Product.id == view_in.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    # Check if user already viewed this product recently (within 24 hours)
    from datetime import timedelta
    yesterday = datetime.utcnow() - timedelta(hours=24)

    existing_view = db.query(ProductView).filter(
        ProductView.user_id == current_user.id,
        ProductView.product_id == view_in.product_id,
        ProductView.viewed_at >= yesterday
    ).first()

    if existing_view:
        # Update timestamp
        existing_view.viewed_at = datetime.utcnow()
        db.commit()
        return {"message": "Product view updated"}

    # Create new view record
    view = ProductView(
        user_id=current_user.id,
        product_id=view_in.product_id
    )

    db.add(view)
    db.commit()

    return {"message": "Product view tracked"}


# Cart Management

@router.get("/cart")
async def get_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's cart"""
    cart_items = db.query(CartItem).filter(
        CartItem.user_id == current_user.id
    ).all()

    # Populate with product data
    result = []
    for item in cart_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            result.append({
                "id": item.id,
                "product_id": item.product_id,
                "quantity": item.quantity,
                "added_at": item.added_at,
                "product": {
                    "id": product.id,
                    "title": product.title_uk,
                    "slug": product.slug,
                    "price": product.price,
                    "image": product.images[0].image_url if product.images else None,
                    "stock_quantity": product.stock_quantity
                }
            })

    return result


@router.post("/cart")
async def add_to_cart(
    item_in: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add item to cart"""
    # Check if product exists
    product = db.query(Product).filter(Product.id == item_in.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    # Check stock
    if product.stock_quantity < item_in.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient stock"
        )

    # Check if item already in cart
    existing_item = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.product_id == item_in.product_id
    ).first()

    if existing_item:
        # Update quantity
        new_quantity = existing_item.quantity + item_in.quantity
        if product.stock_quantity < new_quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient stock"
            )
        existing_item.quantity = new_quantity
        existing_item.added_at = datetime.utcnow()  # Update timestamp
        existing_item.reminder_sent = False  # Reset reminder flag
        db.commit()
        return {"message": "Cart updated"}

    # Add new item
    cart_item = CartItem(
        user_id=current_user.id,
        product_id=item_in.product_id,
        quantity=item_in.quantity
    )

    db.add(cart_item)
    db.commit()

    return {"message": "Item added to cart"}


@router.put("/cart/{item_id}")
async def update_cart_item(
    item_id: int,
    item_update: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update cart item quantity"""
    cart_item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.user_id == current_user.id
    ).first()

    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found"
        )

    # Check stock
    product = db.query(Product).filter(Product.id == cart_item.product_id).first()
    if product.stock_quantity < item_update.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient stock"
        )

    cart_item.quantity = item_update.quantity
    db.commit()

    return {"message": "Cart item updated"}


@router.delete("/cart/{item_id}")
async def remove_from_cart(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove item from cart"""
    cart_item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.user_id == current_user.id
    ).first()

    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found"
        )

    db.delete(cart_item)
    db.commit()

    return {"message": "Item removed from cart"}


@router.delete("/cart")
async def clear_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Clear entire cart"""
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()

    return {"message": "Cart cleared"}
