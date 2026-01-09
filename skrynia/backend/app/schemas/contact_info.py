from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class ContactInfoBase(BaseModel):
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None


class ContactInfoCreate(ContactInfoBase):
    pass


class ContactInfoUpdate(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None


class ContactInfo(ContactInfoBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

