from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Enum
from sqlalchemy.sql import func
import enum
from app.db.base import Base


class UserStatus(str, enum.Enum):
    """User loyalty status levels"""
    HUMAN = "human"  # Людина (замість срібного)
    ELF = "elf"  # Ельф (замість золотого)
    DWARF = "dwarf"  # Гном/Дворф (замість платинового)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=False)  # Changed to False - requires email verification
    is_admin = Column(Boolean, default=False)
    # Email verification
    email_verified = Column(Boolean, default=False)
    email_verification_token = Column(String, nullable=True, index=True)
    email_verification_sent_at = Column(DateTime(timezone=True), nullable=True)
    # Password reset
    password_reset_code = Column(String, nullable=True, index=True)  # 5-digit code
    password_reset_code_sent_at = Column(DateTime(timezone=True), nullable=True)
    password_reset_code_attempts = Column(Integer, default=0)  # Track failed attempts
    # 2FA fields
    two_factor_secret = Column(String, nullable=True)
    two_factor_enabled = Column(Boolean, default=False)
    # Bonus system
    loyalty_status = Column(Enum(UserStatus), default=UserStatus.HUMAN)
    bonus_points = Column(Float, default=0.0)  # Бонусні бали
    total_spent = Column(Float, default=0.0)  # Загальна сума покупок
    # Language preference
    language = Column(String, default="EN")  # UA, EN, DE, PL, SE, NO, DK, FR
    # Phone number
    phone = Column(String, nullable=True)
    # Email notifications
    email_notifications_enabled = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
