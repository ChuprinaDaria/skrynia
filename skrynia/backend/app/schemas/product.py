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
    title_se: Optional[str] = None  # Swedish
    title_no: Optional[str] = None  # Norwegian
    title_dk: Optional[str] = None  # Danish
    title_fr: Optional[str] = None  # French
    slug: str

    description_uk: Optional[str] = None
    description_en: Optional[str] = None
    description_de: Optional[str] = None
    description_pl: Optional[str] = None
    description_se: Optional[str] = None  # Swedish
    description_no: Optional[str] = None  # Norwegian
    description_dk: Optional[str] = None  # Danish
    description_fr: Optional[str] = None  # French

    legend_title_uk: Optional[str] = None
    legend_title_en: Optional[str] = None
    legend_title_se: Optional[str] = None  # Swedish
    legend_title_no: Optional[str] = None  # Norwegian
    legend_title_dk: Optional[str] = None  # Danish
    legend_title_fr: Optional[str] = None  # French
    legend_content_uk: Optional[str] = None
    legend_content_en: Optional[str] = None
    legend_content_se: Optional[str] = None  # Swedish
    legend_content_no: Optional[str] = None  # Norwegian
    legend_content_dk: Optional[str] = None  # Danish
    legend_content_fr: Optional[str] = None  # French

    price: float
    currency: str = "zł"
    compare_at_price: Optional[float] = None

    stock_quantity: int = 0
    sku: Optional[str] = None

    materials_uk: Optional[List[str]] = None
    materials_en: Optional[List[str]] = None
    materials_de: Optional[List[str]] = None
    materials_pl: Optional[List[str]] = None
    materials_se: Optional[List[str]] = None
    materials_no: Optional[List[str]] = None
    materials_dk: Optional[List[str]] = None
    materials_fr: Optional[List[str]] = None
    specifications: Optional[Dict[str, str]] = None
    is_handmade: bool = True

    category_id: Optional[int] = None
    tags_uk: Optional[List[str]] = None
    tags_en: Optional[List[str]] = None
    tags_de: Optional[List[str]] = None
    tags_pl: Optional[List[str]] = None
    tags_se: Optional[List[str]] = None
    tags_no: Optional[List[str]] = None
    tags_dk: Optional[List[str]] = None
    tags_fr: Optional[List[str]] = None
    symbols: Optional[List[str]] = None

    is_active: bool = True
    is_featured: bool = False
    
    # Made to Order
    is_made_to_order: bool = False
    made_to_order_duration: Optional[str] = None

    meta_description_uk: Optional[str] = None
    meta_description_en: Optional[str] = None
    meta_description_de: Optional[str] = None
    meta_description_pl: Optional[str] = None
    meta_description_se: Optional[str] = None
    meta_description_no: Optional[str] = None
    meta_description_dk: Optional[str] = None
    meta_description_fr: Optional[str] = None
    meta_keywords_uk: Optional[List[str]] = None
    meta_keywords_en: Optional[List[str]] = None
    meta_keywords_de: Optional[List[str]] = None
    meta_keywords_pl: Optional[List[str]] = None
    meta_keywords_se: Optional[List[str]] = None
    meta_keywords_no: Optional[List[str]] = None
    meta_keywords_dk: Optional[List[str]] = None
    meta_keywords_fr: Optional[List[str]] = None


class ProductCreate(ProductBase):
    images: Optional[List[ProductImageCreate]] = []


class ProductUpdate(BaseModel):
    title_uk: Optional[str] = None
    title_en: Optional[str] = None
    title_de: Optional[str] = None
    title_pl: Optional[str] = None
    title_se: Optional[str] = None  # Swedish
    title_no: Optional[str] = None  # Norwegian
    title_dk: Optional[str] = None  # Danish
    title_fr: Optional[str] = None  # French

    description_uk: Optional[str] = None
    description_en: Optional[str] = None
    description_de: Optional[str] = None
    description_pl: Optional[str] = None
    description_se: Optional[str] = None  # Swedish
    description_no: Optional[str] = None  # Norwegian
    description_dk: Optional[str] = None  # Danish
    description_fr: Optional[str] = None  # French

    legend_title_uk: Optional[str] = None
    legend_title_en: Optional[str] = None
    legend_title_se: Optional[str] = None  # Swedish
    legend_title_no: Optional[str] = None  # Norwegian
    legend_title_dk: Optional[str] = None  # Danish
    legend_title_fr: Optional[str] = None  # French
    legend_content_uk: Optional[str] = None
    legend_content_en: Optional[str] = None
    legend_content_se: Optional[str] = None  # Swedish
    legend_content_no: Optional[str] = None  # Norwegian
    legend_content_dk: Optional[str] = None  # Danish
    legend_content_fr: Optional[str] = None  # French

    price: Optional[float] = None
    stock_quantity: Optional[int] = None

    materials_uk: Optional[List[str]] = None
    materials_en: Optional[List[str]] = None
    materials_de: Optional[List[str]] = None
    materials_pl: Optional[List[str]] = None
    materials_se: Optional[List[str]] = None
    materials_no: Optional[List[str]] = None
    materials_dk: Optional[List[str]] = None
    materials_fr: Optional[List[str]] = None
    specifications: Optional[Dict[str, str]] = None

    category_id: Optional[int] = None
    tags_uk: Optional[List[str]] = None
    tags_en: Optional[List[str]] = None
    tags_de: Optional[List[str]] = None
    tags_pl: Optional[List[str]] = None
    tags_se: Optional[List[str]] = None
    tags_no: Optional[List[str]] = None
    tags_dk: Optional[List[str]] = None
    tags_fr: Optional[List[str]] = None
    symbols: Optional[List[str]] = None

    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    
    # Made to Order
    is_made_to_order: Optional[bool] = None
    made_to_order_duration: Optional[str] = None

    meta_description_uk: Optional[str] = None
    meta_description_en: Optional[str] = None
    meta_description_de: Optional[str] = None
    meta_description_pl: Optional[str] = None
    meta_description_se: Optional[str] = None
    meta_description_no: Optional[str] = None
    meta_description_dk: Optional[str] = None
    meta_description_fr: Optional[str] = None
    meta_keywords_uk: Optional[List[str]] = None
    meta_keywords_en: Optional[List[str]] = None
    meta_keywords_de: Optional[List[str]] = None
    meta_keywords_pl: Optional[List[str]] = None
    meta_keywords_se: Optional[List[str]] = None
    meta_keywords_no: Optional[List[str]] = None
    meta_keywords_dk: Optional[List[str]] = None
    meta_keywords_fr: Optional[List[str]] = None


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
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
