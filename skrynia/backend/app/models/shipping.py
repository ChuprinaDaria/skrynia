from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.db.base import Base


class ShippingProvider(str, enum.Enum):
    INPOST = "inpost"
    POCZTA_POLSKA = "poczta_polska"
    DHL = "dhl"
    NOVA_POSHTA = "nova_poshta"


class ShippingStatus(str, enum.Enum):
    LABEL_CREATED = "label_created"
    PICKED_UP = "picked_up"
    IN_TRANSIT = "in_transit"
    OUT_FOR_DELIVERY = "out_for_delivery"
    DELIVERED = "delivered"
    EXCEPTION = "exception"
    RETURNED = "returned"


class Shipment(Base):
    """Shipping/tracking information for orders."""
    __tablename__ = "shipments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False, unique=True)

    # Shipping provider
    provider = Column(Enum(ShippingProvider), nullable=False)

    # Tracking
    tracking_number = Column(String, unique=True, index=True, nullable=False)
    tracking_url = Column(String, nullable=True)

    # Status
    status = Column(Enum(ShippingStatus), default=ShippingStatus.LABEL_CREATED)

    # Shipping details
    carrier_service = Column(String, nullable=True)  # e.g., "DHL Express", "InPost Paczkomat"

    # For InPost Paczkomat
    locker_id = Column(String, nullable=True)
    locker_address = Column(String, nullable=True)

    # Estimated delivery
    estimated_delivery_date = Column(DateTime(timezone=True), nullable=True)

    # Actual delivery
    delivered_at = Column(DateTime(timezone=True), nullable=True)

    # Costs
    shipping_cost = Column(String, nullable=True)  # Provider cost

    # Additional info from provider
    provider_data = Column(JSON, nullable=True)

    # Tracking events history
    tracking_events = Column(JSON, nullable=True)  # List of status updates

    # Label
    label_url = Column(String, nullable=True)
    label_pdf = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    order = relationship("Order", backref="shipment")
