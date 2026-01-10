from pydantic import BaseModel, validator
from typing import Optional, List
from datetime import datetime
import re


class BlogBase(BaseModel):
    title: str
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: str
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
        # Auto-generate slug from title
        title = values.get('title', '')
        slug = re.sub(r'[^\w\s-]', '', title.lower())
        slug = re.sub(r'[-\s]+', '-', slug)
        return slug[:255]


class BlogUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
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
