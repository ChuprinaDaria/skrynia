from sqlalchemy.orm import Session
from app.models.user import User, UserStatus


def calculate_bonus_percent(user: User) -> float:
    """Calculate bonus percentage based on user loyalty status."""
    if user.loyalty_status == UserStatus.DWARF:
        return 3.0  # 3% для Гнома/Дворфа
    elif user.loyalty_status == UserStatus.ELF:
        return 2.0  # 2% для Ельфа
    else:  # HUMAN
        return 1.0  # 1% для Людини


def calculate_bonus_points(order_total: float, user: User) -> float:
    """Calculate bonus points earned from order (only from product price, not shipping)."""
    bonus_percent = calculate_bonus_percent(user)
    # Бонуси нараховуються тільки від ціни товарів (subtotal), не від доставки
    return (order_total * bonus_percent) / 100.0


def update_user_loyalty_status(user: User, db: Session) -> None:
    """
    Update user loyalty status based on total spent.
    
    Пороги статусів (враховуючи середню ціну товару ~200 злотих):
    - Людина: 0-999 злотих (0-4 товари)
    - Ельф: 1000-4999 злотих (5-24 товари)
    - Гном/Дворф: 5000+ злотих (25+ товарів)
    """
    if user.total_spent >= 5000:
        user.loyalty_status = UserStatus.DWARF
    elif user.total_spent >= 1000:
        user.loyalty_status = UserStatus.ELF
    else:
        user.loyalty_status = UserStatus.HUMAN
    
    db.commit()


def can_use_bonus_points(user: User, order_subtotal: float, bonus_to_use: float) -> tuple[bool, str]:
    """
    Check if user can use bonus points.
    Returns (can_use, error_message)
    Rules:
    - Максимум 20% від товару (subtotal) можна оплатити бонусами
    - Доставку не можна оплатити бонусами
    """
    if bonus_to_use <= 0:
        return True, ""
    
    if bonus_to_use > user.bonus_points:
        return False, "Недостатньо бонусних балів"
    
    max_bonus_allowed = (order_subtotal * 20) / 100.0  # 20% від товару
    
    if bonus_to_use > max_bonus_allowed:
        return False, f"Максимум можна використати {max_bonus_allowed:.2f} бонусів (20% від товару)"
    
    return True, ""


def apply_bonus_to_order(order_subtotal: float, bonus_points_used: float) -> float:
    """Apply bonus points to order subtotal and return new subtotal."""
    return max(0.0, order_subtotal - bonus_points_used)

