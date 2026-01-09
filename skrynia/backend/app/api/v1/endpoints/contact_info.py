from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.db.session import get_db
from app.models.contact_info import ContactInfo
from app.models.user import User
from app.schemas.contact_info import (
    ContactInfoCreate,
    ContactInfoUpdate,
    ContactInfo as ContactInfoSchema
)
from app.core.security import get_current_admin_user

router = APIRouter()


@router.get("/", response_model=ContactInfoSchema)
def get_contact_info(db: Session = Depends(get_db)):
    """Get contact information (public endpoint)."""
    contact_info = db.query(ContactInfo).first()
    if not contact_info:
        # Return default if none exists
        return ContactInfoSchema(
            id=0,
            email="info@runebox.eu",
            phone=None,
            address=None,
            created_at=datetime.now(),
            updated_at=None
        )
    return contact_info


@router.post("/", response_model=ContactInfoSchema, status_code=status.HTTP_201_CREATED)
def create_contact_info(
    contact: ContactInfoCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Create contact information (admin only)."""
    # Check if contact info already exists
    existing = db.query(ContactInfo).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contact information already exists. Use PATCH to update."
        )
    
    db_contact = ContactInfo(**contact.model_dump())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    
    return db_contact


@router.patch("/", response_model=ContactInfoSchema)
def update_contact_info(
    contact_update: ContactInfoUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Update contact information (admin only)."""
    contact_info = db.query(ContactInfo).first()
    
    if not contact_info:
        # Create if doesn't exist
        if not contact_update.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is required when creating new contact info"
            )
        db_contact = ContactInfo(**contact_update.model_dump(exclude_unset=True))
        db.add(db_contact)
        db.commit()
        db.refresh(db_contact)
        return db_contact
    
    # Update fields
    update_data = contact_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(contact_info, field, value)
    
    db.commit()
    db.refresh(contact_info)
    
    return contact_info

