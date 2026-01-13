from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional

from app.db.session import get_db
from app.models.about_page import AboutPage
from app.models.user import User
from app.schemas.about_page import (
    AboutPageUpdate,
    AboutPage as AboutPageSchema
)
from app.core.security import get_current_admin_user

router = APIRouter()


@router.get("/", response_model=AboutPageSchema)
def get_about_page(db: Session = Depends(get_db)):
    """Get about page content (public endpoint)."""
    about_page = db.query(AboutPage).first()
    if not about_page:
        # Return empty object if none exists
        return AboutPageSchema(
            id=0,
            created_at=None,
            updated_at=None
        )
    return about_page


@router.patch("/", response_model=AboutPageSchema)
def update_about_page(
    about_update: AboutPageUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Update about page content (admin only)."""
    about_page = db.query(AboutPage).first()
    
    if not about_page:
        # Create if doesn't exist
        db_about = AboutPage(**about_update.model_dump(exclude_unset=True))
        db.add(db_about)
        db.commit()
        db.refresh(db_about)
        return db_about
    
    # Update fields
    update_data = about_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(about_page, field, value)
    
    db.commit()
    db.refresh(about_page)
    
    return about_page

