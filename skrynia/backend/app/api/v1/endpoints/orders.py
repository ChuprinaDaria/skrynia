from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
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
from app.core.security import get_current_admin_user, get_current_user
from app.services.bonus_service import (
    can_use_bonus_points,
    apply_bonus_to_order,
    calculate_bonus_points,
    update_user_loyalty_status
)
from app.services.order_notifications import send_order_status_email
from app.services.payments import create_checkout_session
from app.services.email_service import fm
from fastapi_mail import MessageSchema

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
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)  # Optional - guest checkout allowed
):
    """Create a new order. Supports bonus points if user is authenticated."""
    # Validate products and calculate totals
    subtotal = 0.0
    order_items_data = []
    has_made_to_order = False  # Track if order contains made-to-order items

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

        # Skip stock check for made-to-order products
        if not product.is_made_to_order and product.stock_quantity < item_data.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for '{product.title_uk}'"
            )

        # Track if order contains made-to-order items
        if product.is_made_to_order:
            has_made_to_order = True

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

    # Handle bonus points if user is authenticated
    bonus_points_used = 0.0
    bonus_points_earned = 0.0
    original_subtotal = subtotal
    
    if current_user and order_in.bonus_points_used and order_in.bonus_points_used > 0:
        # Verify user email matches order email
        if current_user.email != order_in.customer_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email mismatch. Order email must match authenticated user email."
            )
        
        # Check if bonus can be used
        can_use, error_msg = can_use_bonus_points(current_user, subtotal, order_in.bonus_points_used)
        if not can_use:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg
            )
        
        bonus_points_used = order_in.bonus_points_used
        subtotal = apply_bonus_to_order(subtotal, bonus_points_used)
        
        # Deduct bonus points from user
        current_user.bonus_points -= bonus_points_used
        db.commit()

    # Calculate shipping (after bonus applied to subtotal)
    shipping_cost = calculate_shipping(subtotal, order_in.shipping_country)

    # Calculate total
    # For made-to-order items, customer pays 50% deposit
    deposit_amount = None
    if has_made_to_order:
        # Calculate 50% of subtotal + shipping
        deposit_amount = (subtotal + shipping_cost) * 0.5
        total = deposit_amount  # Customer pays only 50% now
    else:
        total = subtotal + shipping_cost

    # Create order
    order_data = order_in.model_dump(exclude={"items", "bonus_points_used"})
    order_data.update({
        "order_number": generate_order_number(),
        "subtotal": original_subtotal,  # Original subtotal before bonus
        "shipping_cost": shipping_cost,
        "tax": 0.0,  # Add VAT calculation if needed
        "bonus_points_used": bonus_points_used,
        "bonus_points_earned": bonus_points_earned,  # Will be calculated after payment
        "total": total,
        "currency": "PLN",
        "status": OrderStatus.PENDING,
        "payment_status": PaymentStatus.PENDING,
        "is_made_to_order": has_made_to_order,
        "deposit_amount": deposit_amount
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
    from app.models.shipping import Shipment
    from app.schemas.order import Order as OrderSchemaModel
    
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    # Get shipment info if exists
    shipment = db.query(Shipment).filter(Shipment.order_id == order_id).first()
    
    # Convert order to dict and add shipment info
    order_dict = {
        **{c.name: getattr(order, c.name) for c in order.__table__.columns},
        "items": [{"id": item.id, "product_id": item.product_id, "product_title": item.product_title,
                   "product_sku": item.product_sku, "product_image": item.product_image,
                   "price": item.price, "quantity": item.quantity, "subtotal": item.subtotal}
                  for item in order.items]
    }
    
    if shipment:
        from app.schemas.order import ShipmentInfo
        order_dict["shipment"] = ShipmentInfo(
            label_url=shipment.label_url,
            provider=shipment.provider.value if shipment.provider else None,
            status=shipment.status.value if shipment.status else None
        ).model_dump()
    
    return OrderSchemaModel(**order_dict)


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
async def update_order(
    order_id: int,
    order_in: OrderUpdate,
    background_tasks: BackgroundTasks,
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
        
        # Auto-trigger second payment for made-to-order orders when status changes to PROCESSING
        if (update_data["status"] == OrderStatus.PROCESSING and 
            order.is_made_to_order and 
            order.payment_status == PaymentStatus.PAID_PARTIALLY):
            # Automatically generate and send second payment link
            try:
                checkout_url = create_checkout_session(order, stage=2, db=db)
                
                html_content = f"""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .button {{ display: inline-block; padding: 12px 30px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Your Order is Ready - Complete Payment</h2>
                        <p>Hello {order.customer_name},</p>
                        <p>Your made-to-order item #{order.order_number} is ready for final payment.</p>
                        <p>Please complete the remaining 50% payment:</p>
                        <a href="{checkout_url}" class="button">Pay Now</a>
                        <p>If you have any questions, please contact us.</p>
                    </div>
                </body>
                </html>
                """
                
                message = MessageSchema(
                    subject=f"Complete Payment for Order #{order.order_number}",
                    recipients=[order.customer_email],
                    body=html_content,
                    subtype="html"
                )
                
                background_tasks.add_task(fm.send_message, message)
            except Exception as e:
                # Log error but don't fail the status update
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"Failed to auto-trigger second payment for order {order.id}: {str(e)}")

    if "payment_status" in update_data:
        if update_data["payment_status"] == PaymentStatus.COMPLETED:
            update_data["paid_at"] = datetime.utcnow()
            # Also update order status
            if order.status == OrderStatus.PENDING:
                update_data["status"] = OrderStatus.PAID
            
            # Award bonus points if not already awarded
            if order.bonus_points_earned == 0.0:
                user = db.query(User).filter(User.email == order.customer_email).first()
                if user and user.email_verified:
                    # Calculate bonus points (only from subtotal, not shipping)
                    bonus_earned = calculate_bonus_points(order.subtotal, user)
                    order.bonus_points_earned = bonus_earned
                    
                    # Add bonus points to user
                    user.bonus_points += bonus_earned
                    user.total_spent += order.total
                    
                    # Update loyalty status
                    update_user_loyalty_status(user, db)

    for field, value in update_data.items():
        setattr(order, field, value)

    db.commit()
    db.refresh(order)

    # Send email notification if status changed
    if "status" in update_data:
        background_tasks.add_task(
            send_order_status_email,
            order=order,
            status=order.status,
            db=db
        )

    return order


@router.post("/{order_id}/trigger-second-payment")
async def trigger_second_payment(
    order_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Generate second payment link for preorder and send email to customer (admin only)."""
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    if order.payment_status != PaymentStatus.PAID_PARTIALLY:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must be partially paid to trigger second payment"
        )

    try:
        checkout_url = create_checkout_session(order, stage=2, db=db)

        from app.core.config import settings
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .button {{ display: inline-block; padding: 12px 30px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Finalize Your Preorder Payment</h2>
                <p>Hello {order.customer_name},</p>
                <p>Your preorder #{order.order_number} is ready for final payment.</p>
                <p>Please complete the remaining 50% payment:</p>
                <a href="{checkout_url}" class="button">Pay Now</a>
                <p>If you have any questions, please contact us.</p>
            </div>
        </body>
        </html>
        """

        message = MessageSchema(
            subject=f"Complete Payment for Order #{order.order_number}",
            recipients=[order.customer_email],
            body=html_content,
            subtype="html"
        )

        background_tasks.add_task(fm.send_message, message)

        return {"checkout_url": checkout_url, "message": "Payment link generated and email sent"}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to trigger second payment: {str(e)}"
        )
