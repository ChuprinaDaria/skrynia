from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from typing import List
from slugify import slugify
from datetime import datetime

from app.core.security import get_current_user, get_current_admin_user
from app.db.session import get_db
from app.models.user import User
from app.models.blog import BlogPost, BlogComment, BlogRating
from app.schemas.blog import (
    BlogPostCreate, BlogPostUpdate, BlogPostPublic,
    BlogCommentCreate, BlogCommentUpdate, BlogComment as BlogCommentSchema,
    BlogRatingCreate, BlogRating as BlogRatingSchema
)

router = APIRouter()


# Blog Posts

@router.get("/posts", response_model=List[BlogPostPublic])
async def get_blog_posts(
    skip: int = 0,
    limit: int = 20,
    published_only: bool = True,
    db: Session = Depends(get_db)
):
    """Get all blog posts (published only for public)"""
    query = db.query(BlogPost)

    if published_only:
        query = query.filter(BlogPost.is_published == True)

    posts = query.order_by(desc(BlogPost.created_at)).offset(skip).limit(limit).all()
    return posts


@router.get("/posts/{slug}", response_model=BlogPostPublic)
async def get_blog_post(slug: str, db: Session = Depends(get_db)):
    """Get a single blog post by slug"""
    post = db.query(BlogPost).filter(BlogPost.slug == slug).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )

    if not post.is_published:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )

    # Increment view count
    post.views_count += 1
    db.commit()

    return post


@router.post("/posts", response_model=BlogPostPublic)
async def create_blog_post(
    post_in: BlogPostCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new blog post (admin only)"""
    # Generate slug from title
    slug = slugify(post_in.title)

    # Check if slug already exists
    existing_post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if existing_post:
        # Add a number to make it unique
        counter = 1
        while db.query(BlogPost).filter(BlogPost.slug == f"{slug}-{counter}").first():
            counter += 1
        slug = f"{slug}-{counter}"

    new_post = BlogPost(
        **post_in.dict(),
        slug=slug,
        author_id=current_user.id
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return new_post


@router.put("/posts/{post_id}", response_model=BlogPostPublic)
async def update_blog_post(
    post_id: int,
    post_update: BlogPostUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Update a blog post (admin only)"""
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )

    update_data = post_update.dict(exclude_unset=True)

    # If title is updated, regenerate slug
    if "title" in update_data and update_data["title"]:
        slug = slugify(update_data["title"])
        # Check uniqueness
        existing = db.query(BlogPost).filter(
            BlogPost.slug == slug,
            BlogPost.id != post_id
        ).first()
        if existing:
            counter = 1
            while db.query(BlogPost).filter(BlogPost.slug == f"{slug}-{counter}").first():
                counter += 1
            slug = f"{slug}-{counter}"
        post.slug = slug

    # Update published_at if publishing for the first time
    if "is_published" in update_data and update_data["is_published"] and not post.published_at:
        post.published_at = datetime.utcnow()

    for field, value in update_data.items():
        setattr(post, field, value)

    db.commit()
    db.refresh(post)

    return post


@router.delete("/posts/{post_id}")
async def delete_blog_post(
    post_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a blog post (admin only)"""
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )

    db.delete(post)
    db.commit()

    return {"message": "Blog post deleted successfully"}


# Comments

@router.get("/posts/{post_id}/comments", response_model=List[BlogCommentSchema])
async def get_blog_comments(
    post_id: int,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Get all comments for a blog post"""
    comments = db.query(BlogComment).filter(
        BlogComment.post_id == post_id,
        BlogComment.is_approved == True
    ).order_by(desc(BlogComment.created_at)).offset(skip).limit(limit).all()

    return comments


@router.post("/posts/{post_id}/comments", response_model=BlogCommentSchema)
async def create_blog_comment(
    post_id: int,
    comment_in: BlogCommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a comment on a blog post (authenticated users only)"""
    # Check if post exists
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )

    new_comment = BlogComment(
        post_id=post_id,
        user_id=current_user.id,
        content=comment_in.content
    )

    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    return new_comment


@router.put("/comments/{comment_id}", response_model=BlogCommentSchema)
async def update_blog_comment(
    comment_id: int,
    comment_update: BlogCommentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a comment (owner or admin only)"""
    comment = db.query(BlogComment).filter(BlogComment.id == comment_id).first()

    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )

    # Only comment owner or admin can update
    if comment.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough privileges"
        )

    update_data = comment_update.dict(exclude_unset=True)

    # Only admin can approve/unapprove
    if "is_approved" in update_data and not current_user.is_admin:
        del update_data["is_approved"]

    for field, value in update_data.items():
        setattr(comment, field, value)

    db.commit()
    db.refresh(comment)

    return comment


@router.delete("/comments/{comment_id}")
async def delete_blog_comment(
    comment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a comment (owner or admin only)"""
    comment = db.query(BlogComment).filter(BlogComment.id == comment_id).first()

    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )

    # Only comment owner or admin can delete
    if comment.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough privileges"
        )

    db.delete(comment)
    db.commit()

    return {"message": "Comment deleted successfully"}


# Ratings

@router.get("/posts/{post_id}/my-rating", response_model=BlogRatingSchema)
async def get_my_rating(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's rating for a post"""
    rating = db.query(BlogRating).filter(
        BlogRating.post_id == post_id,
        BlogRating.user_id == current_user.id
    ).first()

    if not rating:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rating not found"
        )

    return rating


@router.post("/posts/{post_id}/ratings", response_model=BlogRatingSchema)
async def create_or_update_rating(
    post_id: int,
    rating_in: BlogRatingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create or update a rating for a blog post"""
    # Validate rating value
    if rating_in.rating < 1 or rating_in.rating > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be between 1 and 5"
        )

    # Check if post exists
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )

    # Check if user already rated this post
    existing_rating = db.query(BlogRating).filter(
        BlogRating.post_id == post_id,
        BlogRating.user_id == current_user.id
    ).first()

    if existing_rating:
        # Update existing rating
        existing_rating.rating = rating_in.rating
        db.commit()
        db.refresh(existing_rating)
        rating = existing_rating
    else:
        # Create new rating
        rating = BlogRating(
            post_id=post_id,
            user_id=current_user.id,
            rating=rating_in.rating
        )
        db.add(rating)
        db.commit()
        db.refresh(rating)

    # Update post average rating
    avg_rating = db.query(func.avg(BlogRating.rating)).filter(
        BlogRating.post_id == post_id
    ).scalar()
    post.average_rating = round(avg_rating, 1) if avg_rating else 0.0
    db.commit()

    return rating
