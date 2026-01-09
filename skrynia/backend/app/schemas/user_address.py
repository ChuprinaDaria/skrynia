from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.shipping import ShippingProvider
from app.models.user_address import AddressType


class UserAddressBase(BaseModel):
    address_type: AddressType = AddressType.SHIPPING
    full_name: str
    phone: Optional[str] = None
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    postal_code: str
    country: str = "PL"
    
    # Delivery preferences
    preferred_shipping_provider: Optional[ShippingProvider] = None
    
    # InPost Paczkomat
    inpost_locker_id: Optional[str] = None
    inpost_locker_address: Optional[str] = None
    
    # Nova Poshta
    nova_poshta_city: Optional[str] = None
    nova_poshta_warehouse: Optional[str] = None
    nova_poshta_warehouse_address: Optional[str] = None
    
    # DHL
    dhl_service_point_id: Optional[str] = None
    dhl_service_point_address: Optional[str] = None
    
    # Additional
    delivery_notes: Optional[str] = None
    is_default: bool = False


class UserAddressCreate(UserAddressBase):
    pass


class UserAddressUpdate(BaseModel):
    address_type: Optional[AddressType] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    preferred_shipping_provider: Optional[ShippingProvider] = None
    inpost_locker_id: Optional[str] = None
    inpost_locker_address: Optional[str] = None
    nova_poshta_city: Optional[str] = None
    nova_poshta_warehouse: Optional[str] = None
    nova_poshta_warehouse_address: Optional[str] = None
    dhl_service_point_id: Optional[str] = None
    dhl_service_point_address: Optional[str] = None
    delivery_notes: Optional[str] = None
    is_default: Optional[bool] = None


class UserAddress(UserAddressBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

