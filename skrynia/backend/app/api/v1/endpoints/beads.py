from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.models.bead import Bead, BeadCategory
from app.models.user import User
from app.schemas.bead import (
    Bead as BeadSchema,
    BeadCreate,
    BeadUpdate,
    BeadList
)
from app.core.security import get_current_admin_user

router = APIRouter()


@router.get("/", response_model=List[BeadList])
def get_beads(
    skip: int = 0,
    limit: int = 100,
    category: Optional[BeadCategory] = None,
    subcategory: Optional[str] = None,
    is_active: Optional[bool] = True,
    search: Optional[str] = None,
    min_stock: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Get all beads with optional filtering.

    Filters:
    - category: stone, hardware, extra
    - subcategory: coral, amethyst, clasp тощо
    - is_active: показувати тільки активні бусіни
    - search: пошук по назві
    - min_stock: мінімальний залишок на складі
    """
    query = db.query(Bead)

    if is_active is not None:
        query = query.filter(Bead.is_active == is_active)

    if category:
        query = query.filter(Bead.category == category)

    if subcategory:
        query = query.filter(Bead.subcategory == subcategory)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(Bead.name.ilike(search_filter))

    if min_stock is not None:
        query = query.filter(Bead.stock_quantity >= min_stock)

    # Order by category, then subcategory, then name
    query = query.order_by(Bead.category, Bead.subcategory, Bead.name)

    beads = query.offset(skip).limit(limit).all()

    return beads


@router.get("/{bead_id}", response_model=BeadSchema)
def get_bead(
    bead_id: int,
    db: Session = Depends(get_db)
):
    """Get a single bead by ID."""
    bead = db.query(Bead).filter(Bead.id == bead_id).first()

    if not bead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bead not found"
        )

    return bead


@router.post("/", response_model=BeadSchema, status_code=status.HTTP_201_CREATED)
def create_bead(
    bead: BeadCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Create a new bead (admin only).

    The image should be uploaded first via /api/v1/upload/image endpoint.
    """
    # Check if bead with same name already exists
    existing = db.query(Bead).filter(Bead.name == bead.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bead with this name already exists"
        )

    # Create new bead
    db_bead = Bead(**bead.model_dump())
    db.add(db_bead)
    db.commit()
    db.refresh(db_bead)

    return db_bead


@router.put("/{bead_id}", response_model=BeadSchema)
def update_bead(
    bead_id: int,
    bead_update: BeadUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Update a bead (admin only)."""
    db_bead = db.query(Bead).filter(Bead.id == bead_id).first()

    if not db_bead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bead not found"
        )

    # Update only provided fields
    update_data = bead_update.model_dump(exclude_unset=True)

    # Check if name is being updated and if it conflicts
    if "name" in update_data and update_data["name"] != db_bead.name:
        existing = db.query(Bead).filter(Bead.name == update_data["name"]).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bead with this name already exists"
            )

    for field, value in update_data.items():
        setattr(db_bead, field, value)

    db.commit()
    db.refresh(db_bead)

    return db_bead


@router.delete("/{bead_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bead(
    bead_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a bead (admin only)."""
    db_bead = db.query(Bead).filter(Bead.id == bead_id).first()

    if not db_bead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bead not found"
        )

    db.delete(db_bead)
    db.commit()

    return None


@router.get("/categories/list", response_model=List[str])
def get_bead_categories():
    """Get list of all bead categories."""
    return [category.value for category in BeadCategory]


@router.get("/subcategories/{category}", response_model=List[str])
def get_bead_subcategories(
    category: BeadCategory,
    db: Session = Depends(get_db)
):
    """Get list of subcategories for a specific category."""
    subcategories = (
        db.query(Bead.subcategory)
        .filter(Bead.category == category, Bead.subcategory.isnot(None))
        .distinct()
        .all()
    )

    return [sub[0] for sub in subcategories if sub[0]]
