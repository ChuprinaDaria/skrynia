"""
Service for sending order status email notifications to registered users.
"""
from fastapi_mail import FastMail, MessageSchema
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
from datetime import datetime

from app.core.config import settings
from app.models.user import User
from app.models.order import Order, OrderItem, OrderStatus
from app.models.shipping import Shipment
from app.services.email_templates import (
    generate_order_email_html,
    get_email_translation
)
from app.services.email_service import conf, fm


async def send_order_status_email(
    order: Order,
    status: OrderStatus,
    user: Optional[User] = None,
    db: Optional[Session] = None
) -> None:
    """Send email notification when order status changes."""
    # Get user by email if not provided
    if not user and db:
        user = db.query(User).filter(User.email == order.customer_email).first()
    
    # Only send to registered users with email notifications enabled
    if not user or not user.email_verified or not user.email_notifications_enabled:
        return
    
    # Determine template type based on status
    template_map = {
        OrderStatus.PENDING: "order_received",
        OrderStatus.PAID: "order_confirmed",
        OrderStatus.PROCESSING: "order_confirmed",
        OrderStatus.SHIPPED: "order_shipped",
        OrderStatus.DELIVERED: "order_delivered"
    }
    
    template_type = template_map.get(status)
    if not template_type:
        return  # Don't send email for other statuses
    
    # Get user language (default to UA)
    language = user.language or "UA"
    
    # Prepare order data
    order_data = {
        "order_number": order.order_number,
        "customer_name": order.customer_name,
        "total": order.total,
        "currency": order.currency,
        "created_at": order.created_at.strftime("%d.%m.%Y %H:%M") if order.created_at else "",
        "payment_status": order.payment_status.value if hasattr(order.payment_status, 'value') else str(order.payment_status),
        "tracking_number": order.tracking_number or "",
    }
    
    # Get tracking URL
    tracking_url = order.tracking_url
    if not tracking_url and order.tracking_number:
        # Generate tracking URL based on provider
        tracking_url = f"{settings.FRONTEND_URL}/track/{order.tracking_number}"
    
    # Prepare items data
    items = []
    for item in order.items:
        image_url = item.product_image
        if image_url and not image_url.startswith("http"):
            image_url = f"{settings.FRONTEND_URL}{image_url}"
        
        items.append({
            "product_title": item.product_title,
            "product_image": image_url,
            "quantity": item.quantity,
            "price": item.price,
            "subtotal": item.subtotal
        })
    
    # Generate HTML email
    html_content = generate_order_email_html(
        language=language,
        template_type=template_type,
        order_data=order_data,
        items=items,
        tracking_url=tracking_url
    )
    
    # Get email subject
    t = get_email_translation(language, template_type)
    subject = t.get("subject", "Order Update - Skrynia")
    
    # Send email
    message = MessageSchema(
        subject=subject,
        recipients=[user.email],
        body=html_content,
        subtype="html"
    )
    
    await fm.send_message(message)


async def send_cart_reminder_email(
    user: User,
    cart_items: List[Dict],
    db: Optional[Session] = None
) -> None:
    """Send cart reminder email to user."""
    # Only send to registered users with email notifications enabled
    if not user.email_verified or not user.email_notifications_enabled:
        return
    
    # Get user language
    language = user.language or "UA"
    
    # Prepare items data
    items = []
    for item in cart_items:
        image_url = item.get("image", "")
        if image_url and not image_url.startswith("http"):
            image_url = f"{settings.FRONTEND_URL}{image_url}"
        
        items.append({
            "title": item.get("title", ""),
            "image": image_url,
            "price": item.get("price", 0),
            "currency": item.get("currency", "PLN")
        })
    
    # Generate HTML email
    from app.services.email_templates import generate_cart_reminder_html
    html_content = generate_cart_reminder_html(
        language=language,
        customer_name=user.full_name or user.email,
        items=items,
        items_count=len(cart_items)
    )
    
    # Get email subject
    t = get_email_translation(language, "cart_reminder")
    subject = t.get("subject", "Don't forget to complete your purchase - Skrynia")
    
    # Send email
    message = MessageSchema(
        subject=subject,
        recipients=[user.email],
        body=html_content,
        subtype="html"
    )
    
    await fm.send_message(message)

