from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.necklace import NecklaceConfiguration, NecklaceStatus
from app.models.user import User
from app.schemas.necklace import (
    NecklaceConfiguration as NecklaceConfigurationSchema,
    NecklaceConfigurationCreate,
    NecklaceConfigurationUpdate,
    NecklaceConfigurationList
)
from app.core.security import get_current_user

router = APIRouter()


@router.get("/", response_model=List[NecklaceConfigurationList])
def get_user_necklaces(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all necklace configurations for the current user.
    Requires authentication.
    """
    necklaces = (
        db.query(NecklaceConfiguration)
        .filter(NecklaceConfiguration.user_id == current_user.id)
        .order_by(NecklaceConfiguration.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return necklaces


@router.get("/{necklace_id}", response_model=NecklaceConfigurationSchema)
def get_necklace(
    necklace_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a single necklace configuration by ID.
    User can only access their own necklaces.
    """
    necklace = (
        db.query(NecklaceConfiguration)
        .filter(NecklaceConfiguration.id == necklace_id)
        .first()
    )

    if not necklace:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Necklace configuration not found"
        )

    # Check if necklace belongs to current user
    if necklace.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to access this necklace"
        )

    return necklace


@router.post("/", response_model=NecklaceConfigurationSchema, status_code=status.HTTP_201_CREATED)
def create_necklace(
    necklace: NecklaceConfigurationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new necklace configuration for the current user.
    Requires authentication.
    """
    # Convert necklace_data to dict for JSON storage
    necklace_data_dict = necklace.necklace_data.model_dump()

    # Validate that clasp is present
    if not necklace_data_dict.get("clasp"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Clasp is required for necklace"
        )

    # Create necklace configuration
    db_necklace = NecklaceConfiguration(
        user_id=current_user.id,
        name=necklace.name,
        necklace_data=necklace_data_dict,
        thumbnail_url=necklace.thumbnail_url,
        status=NecklaceStatus.DRAFT
    )

    db.add(db_necklace)
    db.commit()
    db.refresh(db_necklace)

    return db_necklace


@router.put("/{necklace_id}", response_model=NecklaceConfigurationSchema)
def update_necklace(
    necklace_id: int,
    necklace_update: NecklaceConfigurationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a necklace configuration.
    User can only update their own necklaces.
    """
    db_necklace = (
        db.query(NecklaceConfiguration)
        .filter(NecklaceConfiguration.id == necklace_id)
        .first()
    )

    if not db_necklace:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Necklace configuration not found"
        )

    # Check ownership
    if db_necklace.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to update this necklace"
        )

    # Update only provided fields
    update_data = necklace_update.model_dump(exclude_unset=True)

    # Convert necklace_data to dict if present
    if "necklace_data" in update_data and update_data["necklace_data"]:
        necklace_data_dict = update_data["necklace_data"].model_dump()

        # Validate clasp if necklace_data is being updated
        if not necklace_data_dict.get("clasp"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Clasp is required for necklace"
            )

        update_data["necklace_data"] = necklace_data_dict

    for field, value in update_data.items():
        setattr(db_necklace, field, value)

    db.commit()
    db.refresh(db_necklace)

    return db_necklace


@router.delete("/{necklace_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_necklace(
    necklace_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a necklace configuration.
    User can only delete their own necklaces.
    """
    db_necklace = (
        db.query(NecklaceConfiguration)
        .filter(NecklaceConfiguration.id == necklace_id)
        .first()
    )

    if not db_necklace:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Necklace configuration not found"
        )

    # Check ownership
    if db_necklace.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete this necklace"
        )

    db.delete(db_necklace)
    db.commit()

    return None


@router.get("/statuses/list", response_model=List[str])
def get_necklace_statuses():
    """Get list of all necklace statuses."""
    return [status.value for status in NecklaceStatus]
