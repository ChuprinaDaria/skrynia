from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import uuid

from app.db.session import get_db
from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus, PaymentMethod
from app.models.product import Product
from app.models.user import User
from app.schemas.order import (
    Order as OrderSchema,
    OrderCreate,
    OrderUpdate,
    OrderList
)
from app.core.security import get_current_admin_user

router = APIRouter()


def calculate_shipping(subtotal: float, country: str) -> float:
    """Calculate shipping cost based on order value and destination."""
    # Free shipping for orders over 1000 PLN
    if subtotal >= 1000:
        return 0.0

    # Standard EU shipping
    if country in ["PL", "DE", "CZ", "SK", "UA"]:
        return 50.0

    # Other EU countries
    return 75.0


def generate_order_number() -> str:
    """Generate unique order number."""
    timestamp = datetime.now().strftime("%Y%m%d")
    unique_id = uuid.uuid4().hex[:6].upper()
    return f"SKR-{timestamp}-{unique_id}"


@router.post("/", response_model=OrderSchema, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db)
):
    """Create a new order."""
    # Validate products and calculate totals
    subtotal = 0.0
    order_items_data = []

    for item_data in order_in.items:
        product = db.query(Product).filter(Product.id == item_data.product_id).first()

        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with ID {item_data.product_id} not found"
            )

        if not product.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product '{product.title_uk}' is not available"
            )

        if product.stock_quantity < item_data.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for '{product.title_uk}'"
            )

        item_subtotal = product.price * item_data.quantity
        subtotal += item_subtotal

        # Get primary image
        primary_image = None
        if product.images:
            primary_image = next(
                (img.image_url for img in product.images if img.is_primary),
                product.images[0].image_url
            )

        order_items_data.append({
            "product_id": product.id,
            "product_title": product.title_uk,
            "product_sku": product.sku,
            "product_image": primary_image,
            "price": product.price,
            "quantity": item_data.quantity,
            "subtotal": item_subtotal
        })

    # Calculate shipping
    shipping_cost = calculate_shipping(subtotal, order_in.shipping_country)

    # Calculate total
    total = subtotal + shipping_cost

    # Create order
    order_data = order_in.model_dump(exclude={"items"})
    order_data.update({
        "order_number": generate_order_number(),
        "subtotal": subtotal,
        "shipping_cost": shipping_cost,
        "tax": 0.0,  # Add VAT calculation if needed
        "total": total,
        "currency": "PLN",
        "status": OrderStatus.PENDING,
        "payment_status": PaymentStatus.PENDING
    })

    new_order = Order(**order_data)
    db.add(new_order)
    db.flush()

    # Create order items
    for item_data in order_items_data:
        order_item = OrderItem(order_id=new_order.id, **item_data)
        db.add(order_item)

        # Decrease stock
        product = db.query(Product).filter(Product.id == item_data["product_id"]).first()
        product.stock_quantity -= item_data["quantity"]

    db.commit()
    db.refresh(new_order)

    return new_order


@router.get("/", response_model=List[OrderList])
def get_orders(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get all orders (admin only)."""
    orders = db.query(Order).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    return orders


@router.get("/{order_id}", response_model=OrderSchema)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get a single order by ID (admin only)."""
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    return order


@router.get("/number/{order_number}", response_model=OrderSchema)
def get_order_by_number(
    order_number: str,
    email: str,
    db: Session = Depends(get_db)
):
    """Get order by order number and email (for customer tracking)."""
    order = db.query(Order).filter(
        Order.order_number == order_number,
        Order.customer_email == email
    ).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found or email doesn't match"
        )

    return order


@router.patch("/{order_id}", response_model=OrderSchema)
def update_order(
    order_id: int,
    order_in: OrderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update order (admin only)."""
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    # Update fields
    update_data = order_in.model_dump(exclude_unset=True)

    # Set timestamps for status changes
    if "status" in update_data:
        if update_data["status"] == OrderStatus.SHIPPED:
            update_data["shipped_at"] = datetime.utcnow()
        elif update_data["status"] == OrderStatus.DELIVERED:
            update_data["delivered_at"] = datetime.utcnow()

    if "payment_status" in update_data:
        if update_data["payment_status"] == PaymentStatus.COMPLETED:
            update_data["paid_at"] = datetime.utcnow()
            # Also update order status
            if order.status == OrderStatus.PENDING:
                update_data["status"] = OrderStatus.PAID

    for field, value in update_data.items():
        setattr(order, field, value)

    db.commit()
    db.refresh(order)

    return order
