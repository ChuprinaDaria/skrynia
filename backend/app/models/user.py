from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)

    # Email Verification
    is_active = Column(Boolean, default=False)  # Changed default to False - user must verify email
    is_verified = Column(Boolean, default=False)
    verification_token = Column(String, nullable=True, unique=True)
    verification_token_expires = Column(DateTime(timezone=True), nullable=True)

    # Password Reset
    reset_token = Column(String, nullable=True, unique=True)
    reset_token_expires = Column(DateTime(timezone=True), nullable=True)

    # User Role
    is_admin = Column(Boolean, default=False)

    # Shipping Address (optional, for quick checkout)
    shipping_address = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    orders = relationship("Order", back_populates="user", foreign_keys="Order.user_id")
    product_views = relationship("ProductView", back_populates="user", cascade="all, delete-orphan")
    cart_items = relationship("CartItem", back_populates="user", cascade="all, delete-orphan")
    blog_comments = relationship("BlogComment", back_populates="user", cascade="all, delete-orphan")
    blog_ratings = relationship("BlogRating", back_populates="user", cascade="all, delete-orphan")


class ProductView(Base):
    """Track product views by users for reminder emails"""
    __tablename__ = "product_views"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    product_id = Column(Integer, nullable=False)
    viewed_at = Column(DateTime(timezone=True), server_default=func.now())
    reminder_sent = Column(Boolean, default=False)

    # Relationships
    user = relationship("User", back_populates="product_views", foreign_keys=[user_id])


class CartItem(Base):
    """Track cart items for abandoned cart reminders"""
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    product_id = Column(Integer, nullable=False)
    quantity = Column(Integer, default=1)
    added_at = Column(DateTime(timezone=True), server_default=func.now())
    reminder_sent = Column(Boolean, default=False)

    # Relationships
    user = relationship("User", back_populates="cart_items", foreign_keys=[user_id])
    product = relationship("Product")
