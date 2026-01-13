from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base


class MadeToOrderRequest(Base):
    __tablename__ = "made_to_order_requests"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    # Customer Info
    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)
    customer_phone = Column(String, nullable=True)
    
    # Request Details
    custom_text = Column(Text, nullable=True)  # Текст, який клієнт хоче додати
    description = Column(Text, nullable=True)  # Опис/коментар від клієнта
    
    # Status
    status = Column(String, default="new")  # new, in_progress, completed, cancelled
    is_read = Column(Boolean, default=False)
    
    # Admin Notes
    admin_notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    product = relationship("Product", back_populates="made_to_order_requests")

