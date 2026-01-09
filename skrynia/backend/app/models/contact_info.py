from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.db.base import Base


class ContactInfo(Base):
    __tablename__ = "contact_info"

    id = Column(Integer, primary_key=True, index=True)
    
    # Contact Information
    email = Column(String, nullable=False, unique=True)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)  # Адреса для відображення в футері
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

