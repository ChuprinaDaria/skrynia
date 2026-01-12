from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from slugify import slugify

from app.db.session import get_db
from app.models.category import Category
from app.models.user import User
from app.core.security import get_current_admin_user
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
    is_featured: bool = False

    class Config:
        from_attributes = True


class CategoryCreate(BaseModel):
    name_uk: str
    name_en: Optional[str] = None
    name_de: Optional[str] = None
    name_pl: Optional[str] = None
    slug: Optional[str] = None
    description_uk: Optional[str] = None
    description_en: Optional[str] = None
    icon: Optional[str] = None
    culture_type: str
    is_featured: bool = False


class CategoryUpdate(BaseModel):
    name_uk: Optional[str] = None
    name_en: Optional[str] = None
    name_de: Optional[str] = None
    name_pl: Optional[str] = None
    slug: Optional[str] = None
    description_uk: Optional[str] = None
    description_en: Optional[str] = None
    icon: Optional[str] = None
    culture_type: Optional[str] = None
    is_featured: Optional[bool] = None


router = APIRouter()


@router.get("", response_model=List[CategorySchema])
@router.get("/", response_model=List[CategorySchema])
def get_categories(db: Session = Depends(get_db)):
    """Get all categories."""
    categories = db.query(Category).all()
    return categories


@router.get("/by-slug/{slug}", response_model=CategorySchema)
def get_category_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get a single category by slug."""
    category = db.query(Category).filter(Category.slug == slug).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    return category


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


@router.post("/", response_model=CategorySchema, status_code=status.HTTP_201_CREATED)
def create_category(
    category_in: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new category (admin only)."""
    # Generate slug from name_uk if not provided
    if not category_in.slug:
        category_in.slug = slugify(category_in.name_uk)
    
    # Check if slug already exists
    existing = db.query(Category).filter(Category.slug == category_in.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category with slug '{category_in.slug}' already exists"
        )
    
    # Create category
    category_data = category_in.model_dump(exclude_unset=True)
    new_category = Category(**category_data)
    
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    
    return new_category


@router.patch("/{category_id}", response_model=CategorySchema)
def update_category(
    category_id: int,
    category_update: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update a category (admin only)."""
    category = db.query(Category).filter(Category.id == category_id).first()
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    update_data = category_update.model_dump(exclude_unset=True)
    
    # If slug is being updated, check for duplicates
    if "slug" in update_data and update_data["slug"] != category.slug:
        existing = db.query(Category).filter(Category.slug == update_data["slug"]).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category with slug '{update_data['slug']}' already exists"
            )
    
    # If name_uk is being updated and slug is not provided, generate slug
    if "name_uk" in update_data and "slug" not in update_data:
        update_data["slug"] = slugify(update_data["name_uk"])
        # Check if generated slug conflicts
        existing = db.query(Category).filter(Category.slug == update_data["slug"], Category.id != category_id).first()
        if existing:
            # Keep original slug if generated one conflicts
            del update_data["slug"]
    
    for field, value in update_data.items():
        setattr(category, field, value)
    
    db.commit()
    db.refresh(category)
    
    return category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete a category (admin only)."""
    category = db.query(Category).filter(Category.id == category_id).first()
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    # Prevent deletion of main featured collections (Ukrainian/Slavic, Viking, Celtic)
    main_collections = ['ukrainian', 'slavic', 'viking', 'celtic']
    if category.slug in main_collections or (category.is_featured and category.culture_type in ['slavic', 'viking', 'celtic']):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete main featured collections. These collections are required for the site to function properly."
        )
    
    # Check if category has products
    if category.products:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete category with associated products. Please remove products first or reassign them to another category."
        )
    
    db.delete(category)
    db.commit()
    
    return None

