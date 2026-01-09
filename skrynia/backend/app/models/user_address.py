from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.db.base import Base
from app.models.shipping import ShippingProvider


class AddressType(str, enum.Enum):
    """Type of address."""
    SHIPPING = "shipping"
    BILLING = "billing"
    BOTH = "both"


class UserAddress(Base):
    """Saved user addresses and delivery preferences."""
    __tablename__ = "user_addresses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    # Address type
    address_type = Column(Enum(AddressType), default=AddressType.SHIPPING)

    # Address fields
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    address_line1 = Column(String, nullable=False)
    address_line2 = Column(String, nullable=True)
    city = Column(String, nullable=False)
    postal_code = Column(String, nullable=False)
    country = Column(String, nullable=False, default="PL")

    # Delivery preferences
    preferred_shipping_provider = Column(Enum(ShippingProvider), nullable=True)
    
    # For InPost Paczkomat
    inpost_locker_id = Column(String, nullable=True)
    inpost_locker_address = Column(String, nullable=True)
    
    # For Nova Poshta
    nova_poshta_city = Column(String, nullable=True)
    nova_poshta_warehouse = Column(String, nullable=True)
    nova_poshta_warehouse_address = Column(String, nullable=True)
    
    # For DHL
    dhl_service_point_id = Column(String, nullable=True)
    dhl_service_point_address = Column(String, nullable=True)

    # Additional delivery preferences
    delivery_notes = Column(String, nullable=True)
    delivery_preferences = Column(JSON, nullable=True)  # Flexible storage for provider-specific settings

    # Default address flag
    is_default = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", backref="addresses")

