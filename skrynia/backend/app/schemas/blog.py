from pydantic import BaseModel, validator
from typing import Optional, List
from datetime import datetime
import re


class BlogBase(BaseModel):
    # Multilingual fields
    title_uk: Optional[str] = None
    title_en: Optional[str] = None
    title_de: Optional[str] = None
    title_pl: Optional[str] = None
    title_se: Optional[str] = None
    title_no: Optional[str] = None
    title_dk: Optional[str] = None
    title_fr: Optional[str] = None
    
    # Legacy field for backward compatibility
    title: Optional[str] = None
    
    slug: Optional[str] = None
    
    # Multilingual excerpts
    excerpt_uk: Optional[str] = None
    excerpt_en: Optional[str] = None
    excerpt_de: Optional[str] = None
    excerpt_pl: Optional[str] = None
    excerpt_se: Optional[str] = None
    excerpt_no: Optional[str] = None
    excerpt_dk: Optional[str] = None
    excerpt_fr: Optional[str] = None
    
    # Legacy field for backward compatibility
    excerpt: Optional[str] = None
    
    # Multilingual content
    content_uk: Optional[str] = None
    content_en: Optional[str] = None
    content_de: Optional[str] = None
    content_pl: Optional[str] = None
    content_se: Optional[str] = None
    content_no: Optional[str] = None
    content_dk: Optional[str] = None
    content_fr: Optional[str] = None
    
    # Legacy field for backward compatibility
    content: Optional[str] = None
    
    featured_image: Optional[str] = None
    author: Optional[str] = "Skrynia Team"
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    og_image: Optional[str] = None
    tags: Optional[str] = None
    published: bool = False


class BlogCreate(BlogBase):
    linked_product_ids: Optional[List[int]] = []

    @validator('slug', pre=True, always=True)
    def generate_slug(cls, v, values):
        if v:
            return v
        # Auto-generate slug from title_uk or title
        title = values.get('title_uk') or values.get('title', '')
        slug = re.sub(r'[^\w\s-]', '', title.lower())
        slug = re.sub(r'[-\s]+', '-', slug)
        return slug[:255]


class BlogUpdate(BaseModel):
    # Multilingual fields
    title_uk: Optional[str] = None
    title_en: Optional[str] = None
    title_de: Optional[str] = None
    title_pl: Optional[str] = None
    title_se: Optional[str] = None
    title_no: Optional[str] = None
    title_dk: Optional[str] = None
    title_fr: Optional[str] = None
    title: Optional[str] = None  # Legacy
    
    slug: Optional[str] = None
    
    # Multilingual excerpts
    excerpt_uk: Optional[str] = None
    excerpt_en: Optional[str] = None
    excerpt_de: Optional[str] = None
    excerpt_pl: Optional[str] = None
    excerpt_se: Optional[str] = None
    excerpt_no: Optional[str] = None
    excerpt_dk: Optional[str] = None
    excerpt_fr: Optional[str] = None
    excerpt: Optional[str] = None  # Legacy
    
    # Multilingual content
    content_uk: Optional[str] = None
    content_en: Optional[str] = None
    content_de: Optional[str] = None
    content_pl: Optional[str] = None
    content_se: Optional[str] = None
    content_no: Optional[str] = None
    content_dk: Optional[str] = None
    content_fr: Optional[str] = None
    content: Optional[str] = None  # Legacy
    
    featured_image: Optional[str] = None
    author: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    og_image: Optional[str] = None
    tags: Optional[str] = None
    published: Optional[bool] = None
    linked_product_ids: Optional[List[int]] = None


class LinkedProduct(BaseModel):
    id: int
    title: str
    slug: str
    price: float
    featured_image: Optional[str] = None

    class Config:
        from_attributes = True


class Blog(BlogBase):
    id: int
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    linked_products: List[LinkedProduct] = []

    class Config:
        from_attributes = True


class BlogListItem(BaseModel):
    """Simplified blog for list view"""
    id: int
    title: str
    slug: str
    excerpt: Optional[str] = None
    featured_image: Optional[str] = None
    author: Optional[str] = None
    tags: Optional[str] = None
    published_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True
