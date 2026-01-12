from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from app.models.order import OrderStatus, PaymentMethod, PaymentStatus


class OrderItemBase(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class OrderItemCreate(OrderItemBase):
    pass


class OrderItem(BaseModel):
    id: int
    product_id: int
    product_title: str
    product_sku: Optional[str]
    product_image: Optional[str]
    price: float
    quantity: int
    subtotal: float

    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    customer_email: EmailStr
    customer_name: str
    customer_phone: Optional[str] = None

    shipping_address_line1: str
    shipping_address_line2: Optional[str] = None
    shipping_city: str
    shipping_postal_code: str
    shipping_country: str

    billing_address_line1: Optional[str] = None
    billing_address_line2: Optional[str] = None
    billing_city: Optional[str] = None
    billing_postal_code: Optional[str] = None
    billing_country: Optional[str] = None

    customer_notes: Optional[str] = None


class OrderCreate(OrderBase):
    items: List[OrderItemCreate]
    payment_method: PaymentMethod
    bonus_points_used: Optional[float] = Field(default=0.0, ge=0.0)  # Бонуси для використання


class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    payment_status: Optional[PaymentStatus] = None
    tracking_number: Optional[str] = None
    tracking_url: Optional[str] = None
    admin_notes: Optional[str] = None


class ShipmentInfo(BaseModel):
    """Shipment information for order"""
    label_url: Optional[str] = None
    provider: Optional[str] = None
    status: Optional[str] = None

    class Config:
        from_attributes = True


class Order(OrderBase):
    id: int
    order_number: str
    subtotal: float
    shipping_cost: float
    tax: float
    bonus_points_used: float
    bonus_points_earned: float
    total: float
    currency: str

    payment_method: PaymentMethod
    payment_status: PaymentStatus
    payment_intent_id: Optional[str]

    status: OrderStatus
    tracking_number: Optional[str]
    tracking_url: Optional[str]
    admin_notes: Optional[str]

    items: List[OrderItem] = []
    shipment: Optional[ShipmentInfo] = None

    created_at: datetime
    updated_at: Optional[datetime]
    paid_at: Optional[datetime]
    shipped_at: Optional[datetime]
    delivered_at: Optional[datetime]

    class Config:
        from_attributes = True


class OrderList(BaseModel):
    """Simplified order info for lists"""
    id: int
    order_number: str
    customer_email: str
    customer_name: str
    total: float
    status: OrderStatus
    payment_status: PaymentStatus
    created_at: datetime

    class Config:
        from_attributes = True
