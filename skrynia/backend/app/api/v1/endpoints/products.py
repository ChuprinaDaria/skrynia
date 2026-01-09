from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from slugify import slugify

from app.db.session import get_db
from app.models.product import Product, ProductImage
from app.models.user import User
from app.schemas.product import (
    Product as ProductSchema,
    ProductCreate,
    ProductUpdate,
    ProductList
)
from app.core.security import get_current_admin_user

router = APIRouter()


@router.get("/", response_model=List[ProductList])
def get_products(
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    is_featured: Optional[bool] = None,
    is_active: Optional[bool] = True,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all products with optional filtering."""
    query = db.query(Product)

    if is_active is not None:
        query = query.filter(Product.is_active == is_active)

    if category_id:
        query = query.filter(Product.category_id == category_id)

    if is_featured is not None:
        query = query.filter(Product.is_featured == is_featured)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            Product.title_uk.ilike(search_filter) |
            Product.title_en.ilike(search_filter) |
            Product.description_uk.ilike(search_filter)
        )

    products = query.offset(skip).limit(limit).all()

    # Format response with primary image
    result = []
    for product in products:
        primary_image = next(
            (img.image_url for img in product.images if img.is_primary),
            product.images[0].image_url if product.images else None
        )

        result.append(ProductList(
            id=product.id,
            title_uk=product.title_uk,
            slug=product.slug,
            price=product.price,
            currency=product.currency,
            primary_image=primary_image,
            category_id=product.category_id,
            is_handmade=product.is_handmade,
            is_featured=product.is_featured
        ))

    return result


@router.get("/by-id/{product_id}", response_model=ProductSchema)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    """Get a single product by ID."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product


@router.get("/{slug}", response_model=ProductSchema)
def get_product(slug: str, db: Session = Depends(get_db)):
    """Get a single product by slug."""
    product = db.query(Product).filter(Product.slug == slug).first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    return product


@router.post("/", response_model=ProductSchema)
def create_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new product (admin only)."""
    # Generate slug from title if not provided
    if not product_in.slug:
        product_in.slug = slugify(product_in.title_uk)

    # Check if slug already exists
    existing = db.query(Product).filter(Product.slug == product_in.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Product with slug '{product_in.slug}' already exists"
        )

    # Create product
    product_data = product_in.model_dump(exclude={"images"})
    new_product = Product(**product_data)

    db.add(new_product)
    db.flush()

    # Add images
    if product_in.images:
        for idx, img_data in enumerate(product_in.images):
            image = ProductImage(
                product_id=new_product.id,
                image_url=img_data.image_url,
                alt_text=img_data.alt_text,
                position=img_data.position if img_data.position else idx,
                is_primary=img_data.is_primary
            )
            db.add(image)

    db.commit()
    db.refresh(new_product)

    return new_product


@router.patch("/{product_id}", response_model=ProductSchema)
def update_product(
    product_id: int,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update a product (admin only)."""
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    # Update fields
    update_data = product_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)

    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete a product (admin only)."""
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    db.delete(product)
    db.commit()

    return None
