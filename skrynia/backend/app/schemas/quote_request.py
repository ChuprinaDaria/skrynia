from pydantic import BaseModel, Field, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime
from app.models.quote_request import QuoteStatus
from app.schemas.necklace import NecklaceData


class QuoteRequestBase(BaseModel):
    """Base schema for QuoteRequest"""
    email: EmailStr = Field(..., description="Email клієнта (обов'язковий)")
    customer_name: Optional[str] = Field(None, max_length=255, description="Ім'я клієнта")
    customer_phone: Optional[str] = Field(None, max_length=50, description="Телефон клієнта")
    comment: Optional[str] = Field(None, description="Коментар від клієнта")


class QuoteRequestCreate(QuoteRequestBase):
    """Schema for creating a new quote request"""
    necklace_configuration_id: Optional[int] = Field(None, description="ID збереженої конфігурації (якщо є)")
    necklace_data: NecklaceData = Field(..., description="Конфігурація намиста в JSON")


class QuoteRequestUpdate(BaseModel):
    """Schema for updating quote request (admin only)"""
    status: Optional[QuoteStatus] = None
    is_read: Optional[bool] = None
    admin_notes: Optional[str] = None
    admin_quote_price: Optional[float] = Field(None, ge=0, description="Ціна від адміна")
    admin_quote_currency: Optional[str] = Field(None, max_length=10)


class QuoteRequestAdminResponse(BaseModel):
    """Schema for admin response to quote request"""
    admin_notes: str = Field(..., description="Нотатки адміна для клієнта")
    admin_quote_price: float = Field(..., ge=0, description="Запропонована ціна")
    admin_quote_currency: str = Field(default="PLN", max_length=10, description="Валюта")


class QuoteRequest(QuoteRequestBase):
    """Complete QuoteRequest schema with database fields"""
    id: int
    user_id: Optional[int] = None
    necklace_configuration_id: Optional[int] = None
    necklace_data: Dict[str, Any]  # JSON field
    status: QuoteStatus
    is_read: bool
    admin_notes: Optional[str] = None
    admin_quote_price: Optional[float] = None
    admin_quote_currency: str
    calculated_netto: Optional[float] = None
    calculated_brutto: Optional[float] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    quoted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class QuoteRequestList(BaseModel):
    """Simplified schema for listing quote requests"""
    id: int
    email: str
    customer_name: Optional[str]
    status: QuoteStatus
    is_read: bool
    calculated_brutto: Optional[float]
    admin_quote_price: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True


class BeadCalculation(BaseModel):
    """Schema for bead price calculation detail"""
    bead_id: int
    name: str
    quantity: int
    price_netto: float
    price_brutto: float
    total_netto: float
    total_brutto: float


class QuoteCalculation(BaseModel):
    """Schema for quote price calculation"""
    beads: list[BeadCalculation]
    total_netto: float
    total_brutto: float
    currency: str
