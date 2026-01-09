from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.models.social_link import SocialLink
from app.models.user import User
from app.schemas.social_link import (
    SocialLinkCreate,
    SocialLinkUpdate,
    SocialLink as SocialLinkSchema
)
from app.core.security import get_current_admin_user

router = APIRouter()


@router.get("/", response_model=List[SocialLinkSchema])
def get_social_links(
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    db: Session = Depends(get_db)
):
    """Get all social links (public endpoint)."""
    query = db.query(SocialLink)
    
    if is_active is not None:
        query = query.filter(SocialLink.is_active == is_active)
    
    links = query.order_by(SocialLink.display_order.asc(), SocialLink.created_at.asc()).all()
    return links


@router.post("/", response_model=SocialLinkSchema, status_code=status.HTTP_201_CREATED)
def create_social_link(
    link: SocialLinkCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new social link (admin only)."""
    # Check if platform already exists
    existing = db.query(SocialLink).filter(SocialLink.platform == link.platform).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Social link for platform '{link.platform}' already exists"
        )
    
    db_link = SocialLink(**link.model_dump())
    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    
    return db_link


@router.get("/{link_id}", response_model=SocialLinkSchema)
def get_social_link(
    link_id: int,
    db: Session = Depends(get_db)
):
    """Get a single social link."""
    link = db.query(SocialLink).filter(SocialLink.id == link_id).first()
    if not link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Social link not found"
        )
    return link


@router.patch("/{link_id}", response_model=SocialLinkSchema)
def update_social_link(
    link_id: int,
    link_update: SocialLinkUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Update a social link (admin only)."""
    link = db.query(SocialLink).filter(SocialLink.id == link_id).first()
    if not link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Social link not found"
        )
    
    # Check if platform change conflicts with existing
    if link_update.platform and link_update.platform != link.platform:
        existing = db.query(SocialLink).filter(
            SocialLink.platform == link_update.platform,
            SocialLink.id != link_id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Social link for platform '{link_update.platform}' already exists"
            )
    
    # Update fields
    update_data = link_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(link, field, value)
    
    db.commit()
    db.refresh(link)
    
    return link


@router.delete("/{link_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_social_link(
    link_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a social link (admin only)."""
    link = db.query(SocialLink).filter(SocialLink.id == link_id).first()
    if not link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Social link not found"
        )
    
    db.delete(link)
    db.commit()
    
    return None

