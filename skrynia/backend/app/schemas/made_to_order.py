from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class MadeToOrderRequestCreate(BaseModel):
    product_id: int
    customer_name: str = Field(..., min_length=2, max_length=100)
    customer_email: EmailStr
    customer_phone: Optional[str] = Field(None, max_length=20)
    custom_text: Optional[str] = Field(None, max_length=500)
    description: Optional[str] = Field(None, max_length=2000)


class MadeToOrderRequestUpdate(BaseModel):
    status: Optional[str] = None
    is_read: Optional[bool] = None
    admin_notes: Optional[str] = None


class MadeToOrderRequest(BaseModel):
    id: int
    product_id: int
    customer_name: str
    customer_email: str
    customer_phone: Optional[str]
    custom_text: Optional[str]
    description: Optional[str]
    status: str
    is_read: bool
    admin_notes: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

