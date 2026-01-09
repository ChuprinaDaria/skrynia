from pydantic import BaseModel, HttpUrl, Field
from typing import Optional
from datetime import datetime


class SocialLinkBase(BaseModel):
    platform: str = Field(..., min_length=2, max_length=50)
    url: str
    icon_name: Optional[str] = None
    is_active: bool = True
    display_order: int = 0


class SocialLinkCreate(SocialLinkBase):
    pass


class SocialLinkUpdate(BaseModel):
    platform: Optional[str] = Field(None, min_length=2, max_length=50)
    url: Optional[str] = None
    icon_name: Optional[str] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None


class SocialLink(SocialLinkBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

