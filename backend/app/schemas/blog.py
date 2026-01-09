from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class BlogPostBase(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = None
    featured_image: Optional[str] = None
    video_url: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None


class BlogPostCreate(BlogPostBase):
    pass


class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    featured_image: Optional[str] = None
    video_url: Optional[str] = None
    is_published: Optional[bool] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None


class BlogPostPublic(BlogPostBase):
    id: int
    slug: str
    is_published: bool
    published_at: Optional[datetime] = None
    views_count: int
    average_rating: float
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class BlogCommentBase(BaseModel):
    content: str


class BlogCommentCreate(BlogCommentBase):
    pass


class BlogCommentUpdate(BaseModel):
    content: Optional[str] = None
    is_approved: Optional[bool] = None


class BlogComment(BlogCommentBase):
    id: int
    post_id: int
    user_id: int
    is_approved: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class BlogRatingBase(BaseModel):
    rating: int  # 1-5


class BlogRatingCreate(BlogRatingBase):
    pass


class BlogRating(BlogRatingBase):
    id: int
    post_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
