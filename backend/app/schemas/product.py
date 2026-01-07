from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime


class ProductImageBase(BaseModel):
    image_url: str
    alt_text: Optional[str] = None
    position: int = 0
    is_primary: bool = False


class ProductImageCreate(ProductImageBase):
    pass


class ProductImage(ProductImageBase):
    id: int
    product_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    title_uk: str
    title_en: Optional[str] = None
    title_de: Optional[str] = None
    title_pl: Optional[str] = None
    slug: str

    description_uk: Optional[str] = None
    description_en: Optional[str] = None
    description_de: Optional[str] = None
    description_pl: Optional[str] = None

    legend_title_uk: Optional[str] = None
    legend_title_en: Optional[str] = None
    legend_content_uk: Optional[str] = None
    legend_content_en: Optional[str] = None

    price: float
    currency: str = "zł"
    compare_at_price: Optional[float] = None

    stock_quantity: int = 0
    sku: Optional[str] = None

    materials: Optional[List[str]] = None
    specifications: Optional[Dict[str, str]] = None
    is_handmade: bool = True

    category_id: Optional[int] = None
    tags: Optional[List[str]] = None
    symbols: Optional[List[str]] = None

    is_active: bool = True
    is_featured: bool = False

    meta_description: Optional[str] = None
    meta_keywords: Optional[List[str]] = None


class ProductCreate(ProductBase):
    images: Optional[List[ProductImageCreate]] = []


class ProductUpdate(BaseModel):
    title_uk: Optional[str] = None
    title_en: Optional[str] = None
    title_de: Optional[str] = None
    title_pl: Optional[str] = None

    description_uk: Optional[str] = None
    description_en: Optional[str] = None

    legend_title_uk: Optional[str] = None
    legend_content_uk: Optional[str] = None

    price: Optional[float] = None
    stock_quantity: Optional[int] = None

    materials: Optional[List[str]] = None
    specifications: Optional[Dict[str, str]] = None

    category_id: Optional[int] = None
    tags: Optional[List[str]] = None
    symbols: Optional[List[str]] = None

    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None


class Product(ProductBase):
    id: int
    images: List[ProductImage] = []
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProductList(BaseModel):
    """Simplified product info for lists"""
    id: int
    title_uk: str
    slug: str
    price: float
    currency: str
    primary_image: Optional[str] = None
    category_id: Optional[int] = None
    is_handmade: bool
    is_featured: bool

    class Config:
        from_attributes = True
