from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.category import Category
from pydantic import BaseModel


class CategorySchema(BaseModel):
    id: int
    name_uk: str
    name_en: str | None
    name_de: str | None
    name_pl: str | None
    slug: str
    description_uk: str | None
    description_en: str | None
    icon: str | None
    culture_type: str

    class Config:
        from_attributes = True


router = APIRouter()


@router.get("/", response_model=List[CategorySchema])
def get_categories(db: Session = Depends(get_db)):
    """Get all categories."""
    categories = db.query(Category).all()
    return categories


@router.get("/{category_id}", response_model=CategorySchema)
def get_category(category_id: int, db: Session = Depends(get_db)):
    """Get a single category by ID."""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    return category

