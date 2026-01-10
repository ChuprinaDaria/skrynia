from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.bead import BeadCategory


class BeadBase(BaseModel):
    """Base schema for Bead with common fields"""
    name: str = Field(..., description="Назва бусіни, наприклад 'Корал червоний 8мм'")
    image_url: str = Field(..., description="URL до PNG зображення бусіни")
    category: BeadCategory = Field(..., description="Категорія: stone, hardware, extra")
    subcategory: Optional[str] = Field(None, description="Підкатегорія: coral, amethyst, clasp тощо")
    size_mm: int = Field(..., gt=0, description="Розмір бусіни в міліметрах для автомасштабування")
    material: Optional[str] = Field(None, description="Матеріал: coral, glass, metal, wood")
    price_netto: float = Field(..., ge=0, description="Закупівельна ціна")
    price_brutto: float = Field(..., ge=0, description="Продажна ціна")
    currency: str = Field(default="PLN", description="Валюта")
    supplier_link: Optional[str] = Field(None, description="Посилання на постачальника")
    supplier_name: Optional[str] = Field(None, description="Назва постачальника")
    stock_quantity: int = Field(default=0, ge=0, description="Залишок на складі")
    is_active: bool = Field(default=True, description="Чи доступна в конструкторі")


class BeadCreate(BeadBase):
    """Schema for creating a new bead"""
    pass


class BeadUpdate(BaseModel):
    """Schema for updating a bead (all fields optional)"""
    name: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[BeadCategory] = None
    subcategory: Optional[str] = None
    size_mm: Optional[int] = Field(None, gt=0)
    material: Optional[str] = None
    price_netto: Optional[float] = Field(None, ge=0)
    price_brutto: Optional[float] = Field(None, ge=0)
    currency: Optional[str] = None
    supplier_link: Optional[str] = None
    supplier_name: Optional[str] = None
    stock_quantity: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None


class Bead(BeadBase):
    """Complete Bead schema with database fields"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class BeadList(BaseModel):
    """Simplified schema for listing beads (for frontend catalog)"""
    id: int
    name: str
    image_url: str
    category: BeadCategory
    subcategory: Optional[str]
    size_mm: int
    price_brutto: float
    currency: str
    is_active: bool
    stock_quantity: int

    class Config:
        from_attributes = True
