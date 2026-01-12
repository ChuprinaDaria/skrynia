from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from app.db.session import get_db
from app.models.user import User, UserStatus
from app.models.order import Order, OrderStatus, PaymentStatus
from app.models.user_address import UserAddress
from app.schemas.user import User as UserSchema, UserUpdate
from app.schemas.user_address import UserAddress as UserAddressSchema
from app.core.security import get_current_user
from pydantic import BaseModel

router = APIRouter()


class UserProfile(UserSchema):
    """Extended user profile with order statistics."""
    total_orders: int = 0
    pending_orders: int = 0
    completed_orders: int = 0
    default_address: Optional[UserAddressSchema] = None


class UserOrder(BaseModel):
    """User order summary."""
    id: int
    order_number: str
    total: float
    status: str
    payment_status: str
    created_at: str
    items_count: int


@router.get("/me", response_model=UserProfile)
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user profile with statistics."""
    # Get order statistics
    total_orders = db.query(func.count(Order.id)).filter(
        Order.customer_email == current_user.email
    ).scalar() or 0
    
    pending_orders = db.query(func.count(Order.id)).filter(
        Order.customer_email == current_user.email,
        Order.status == OrderStatus.PENDING
    ).scalar() or 0
    
    completed_orders = db.query(func.count(Order.id)).filter(
        Order.customer_email == current_user.email,
        Order.status == OrderStatus.COMPLETED
    ).scalar() or 0
    
    # Get default address
    default_address = db.query(UserAddress).filter(
        UserAddress.user_id == current_user.id,
        UserAddress.is_default == True
    ).first()
    
    # Convert default_address to schema if it exists
    default_address_schema = None
    if default_address:
        default_address_schema = UserAddressSchema.model_validate(default_address)
    
    return UserProfile(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        is_active=current_user.is_active,
        is_admin=current_user.is_admin,
        email_verified=current_user.email_verified,
        loyalty_status=current_user.loyalty_status.value if current_user.loyalty_status else None,
        bonus_points=current_user.bonus_points,
        total_spent=current_user.total_spent,
        created_at=current_user.created_at,
        total_orders=total_orders,
        pending_orders=pending_orders,
        completed_orders=completed_orders,
        default_address=default_address_schema
    )


@router.patch("/me", response_model=UserSchema)
def update_current_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user profile."""
    update_data = user_update.model_dump(exclude_unset=True)
    
    # If password is being updated, hash it
    if "password" in update_data:
        from app.core.security import get_password_hash
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    # Update user fields
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    
    return current_user


@router.get("/me/orders", response_model=List[UserOrder])
def get_my_orders(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's orders."""
    orders = db.query(Order).filter(
        Order.customer_email == current_user.email
    ).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    
    result = []
    for order in orders:
        items_count = len(order.items) if hasattr(order, 'items') else 0
        result.append(UserOrder(
            id=order.id,
            order_number=order.order_number,
            total=order.total,
            status=order.status.value,
            payment_status=order.payment_status.value,
            created_at=order.created_at.isoformat(),
            items_count=items_count
        ))
    
    return result


@router.get("/me/bonus-info")
def get_bonus_info(current_user: User = Depends(get_current_user)):
    """Get user bonus system information."""
    # Calculate status thresholds
    status_info = {
        "human": {
            "name": "Людина",
            "min_spent": 0,
            "max_spent": 999,
            "bonus_percent": 1.0,  # 1% бонусів
            "description": "Початковий статус. Отримуйте 1% бонусів з кожної покупки."
        },
        "elf": {
            "name": "Ельф",
            "min_spent": 1000,
            "max_spent": 4999,
            "bonus_percent": 2.0,  # 2% бонусів
            "description": "Після покупок на 1000+ злотих. Отримуйте 2% бонусів."
        },
        "dwarf": {
            "name": "Гном/Дворф",
            "min_spent": 5000,
            "max_spent": float('inf'),
            "bonus_percent": 3.0,  # 3% бонусів
            "description": "Після покупок на 5000+ злотих. Отримуйте 3% бонусів."
        }
    }
    
    current_status = current_user.loyalty_status.value if current_user.loyalty_status else "human"
    current_info = status_info[current_status]
    
    # Calculate next status
    next_status = None
    if current_status == "human":
        next_status = "elf"
    elif current_status == "elf":
        next_status = "dwarf"
    
    next_info = status_info[next_status] if next_status else None
    
    # Calculate progress to next status
    progress = None
    if next_info:
        spent = current_user.total_spent
        needed = next_info["min_spent"] - spent
        progress = {
            "current": spent,
            "needed": needed,
            "next_status": next_info["name"],
            "percent": min(100, int((spent / next_info["min_spent"]) * 100)) if next_info["min_spent"] > 0 else 0
        }
    
    return {
        "current_status": current_info,
        "next_status": next_info,
        "progress": progress,
        "bonus_points": current_user.bonus_points,
        "total_spent": current_user.total_spent,
        "can_use_bonus": current_user.bonus_points > 0,
        "max_bonus_percent": 20  # Максимум 20% від товару можна оплатити бонусами
    }

