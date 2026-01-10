from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.db.session import get_db
from app.models.blog import Blog
from app.models.product import Product
from app.models.user import User
from app.schemas.blog import Blog as BlogSchema, BlogCreate, BlogUpdate, BlogListItem
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[BlogListItem])
def get_blogs(
    skip: int = 0,
    limit: int = 20,
    published_only: bool = True,
    db: Session = Depends(get_db)
):
    """Get all blog posts (published only by default)."""
    query = db.query(Blog)

    if published_only:
        query = query.filter(Blog.published == True)

    blogs = query.order_by(Blog.published_at.desc()).offset(skip).limit(limit).all()
    return blogs


@router.get("/{slug}", response_model=BlogSchema)
def get_blog(slug: str, db: Session = Depends(get_db)):
    """Get a single blog post by slug."""
    blog = db.query(Blog).filter(Blog.slug == slug).first()

    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )

    # Only show unpublished posts to admins (for now, show if exists)
    return blog


@router.post("/", response_model=BlogSchema)
def create_blog(
    blog_in: BlogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new blog post (admin only)."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    # Check if slug already exists
    existing_blog = db.query(Blog).filter(Blog.slug == blog_in.slug).first()
    if existing_blog:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Blog post with this slug already exists"
        )

    # Create blog post
    blog_data = blog_in.dict(exclude={'linked_product_ids'})

    # Set published_at if publishing
    if blog_in.published:
        blog_data['published_at'] = datetime.utcnow()

    blog = Blog(**blog_data)

    # Add linked products
    if blog_in.linked_product_ids:
        products = db.query(Product).filter(Product.id.in_(blog_in.linked_product_ids)).all()
        blog.linked_products = products

    db.add(blog)
    db.commit()
    db.refresh(blog)

    return blog


@router.put("/{blog_id}", response_model=BlogSchema)
def update_blog(
    blog_id: int,
    blog_in: BlogUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a blog post (admin only)."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )

    # Check slug uniqueness if changed
    if blog_in.slug and blog_in.slug != blog.slug:
        existing_blog = db.query(Blog).filter(Blog.slug == blog_in.slug).first()
        if existing_blog:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Blog post with this slug already exists"
            )

    update_data = blog_in.dict(exclude_unset=True, exclude={'linked_product_ids'})

    # Set published_at when publishing for the first time
    if blog_in.published and not blog.published and not blog.published_at:
        update_data['published_at'] = datetime.utcnow()

    for field, value in update_data.items():
        setattr(blog, field, value)

    # Update linked products
    if blog_in.linked_product_ids is not None:
        products = db.query(Product).filter(Product.id.in_(blog_in.linked_product_ids)).all()
        blog.linked_products = products

    db.commit()
    db.refresh(blog)

    return blog


@router.delete("/{blog_id}")
def delete_blog(
    blog_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a blog post (admin only)."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )

    db.delete(blog)
    db.commit()

    return {"message": "Blog post deleted successfully"}


@router.get("/admin/all", response_model=List[BlogSchema])
def get_all_blogs_admin(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all blog posts including unpublished (admin only)."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    blogs = db.query(Blog).order_by(Blog.created_at.desc()).offset(skip).limit(limit).all()
    return blogs
