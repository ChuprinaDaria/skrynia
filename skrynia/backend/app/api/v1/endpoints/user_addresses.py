from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.user import User
from app.models.user_address import UserAddress
from app.schemas.user_address import (
    UserAddress as UserAddressSchema,
    UserAddressCreate,
    UserAddressUpdate
)
from app.core.security import get_current_user

router = APIRouter()


@router.get("/addresses", response_model=List[UserAddressSchema])
def get_my_addresses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all saved addresses for current user."""
    addresses = db.query(UserAddress).filter(
        UserAddress.user_id == current_user.id
    ).order_by(UserAddress.is_default.desc(), UserAddress.created_at.desc()).all()
    
    return addresses


@router.get("/addresses/default", response_model=UserAddressSchema)
def get_default_address(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get default address for current user."""
    address = db.query(UserAddress).filter(
        UserAddress.user_id == current_user.id,
        UserAddress.is_default == True
    ).first()
    
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No default address found"
        )
    
    return address


@router.post("/addresses", response_model=UserAddressSchema, status_code=status.HTTP_201_CREATED)
def create_address(
    address_in: UserAddressCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new saved address."""
    # If this is set as default, unset other defaults
    if address_in.is_default:
        db.query(UserAddress).filter(
            UserAddress.user_id == current_user.id,
            UserAddress.is_default == True
        ).update({"is_default": False})
    
    new_address = UserAddress(
        user_id=current_user.id,
        **address_in.model_dump()
    )
    
    db.add(new_address)
    db.commit()
    db.refresh(new_address)
    
    return new_address


@router.get("/addresses/{address_id}", response_model=UserAddressSchema)
def get_address(
    address_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific address by ID."""
    address = db.query(UserAddress).filter(
        UserAddress.id == address_id,
        UserAddress.user_id == current_user.id
    ).first()
    
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found"
        )
    
    return address


@router.patch("/addresses/{address_id}", response_model=UserAddressSchema)
def update_address(
    address_id: int,
    address_update: UserAddressUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an existing address."""
    address = db.query(UserAddress).filter(
        UserAddress.id == address_id,
        UserAddress.user_id == current_user.id
    ).first()
    
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found"
        )
    
    update_data = address_update.model_dump(exclude_unset=True)
    
    # If setting as default, unset other defaults
    if update_data.get("is_default") == True:
        db.query(UserAddress).filter(
            UserAddress.user_id == current_user.id,
            UserAddress.id != address_id,
            UserAddress.is_default == True
        ).update({"is_default": False})
    
    for field, value in update_data.items():
        setattr(address, field, value)
    
    db.commit()
    db.refresh(address)
    
    return address


@router.delete("/addresses/{address_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_address(
    address_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an address."""
    address = db.query(UserAddress).filter(
        UserAddress.id == address_id,
        UserAddress.user_id == current_user.id
    ).first()
    
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found"
        )
    
    db.delete(address)
    db.commit()
    
    return None


@router.post("/addresses/{address_id}/set-default", response_model=UserAddressSchema)
def set_default_address(
    address_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Set an address as default."""
    address = db.query(UserAddress).filter(
        UserAddress.id == address_id,
        UserAddress.user_id == current_user.id
    ).first()
    
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found"
        )
    
    # Unset other defaults
    db.query(UserAddress).filter(
        UserAddress.user_id == current_user.id,
        UserAddress.id != address_id,
        UserAddress.is_default == True
    ).update({"is_default": False})
    
    # Set this as default
    address.is_default = True
    db.commit()
    db.refresh(address)
    
    return address

