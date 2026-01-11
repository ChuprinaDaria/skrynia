from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.responses import Response as FastAPIResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc, nullslast
from typing import List
from datetime import datetime
import xml.etree.ElementTree as ET

from app.db.session import get_db
from app.models.blog import Blog
from app.models.product import Product
from app.models.user import User
from app.schemas.blog import Blog as BlogSchema, BlogCreate, BlogUpdate, BlogListItem
from app.api.v1.endpoints.auth import get_current_user
from app.core.config import settings

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

    # Order by published_at if available, otherwise by created_at
    # Use nullslast to handle cases where published_at might be None
    try:
        blogs = query.order_by(nullslast(desc(Blog.published_at))).offset(skip).limit(limit).all()
    except:
        # Fallback to created_at if published_at doesn't exist or causes issues
        blogs = query.order_by(desc(Blog.created_at)).offset(skip).limit(limit).all()
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


@router.get("/rss.xml", response_class=FastAPIResponse)
def get_blog_rss(db: Session = Depends(get_db)):
    """Generate RSS feed for blog posts."""
    
    # Fetch published blog posts
    blogs = db.query(Blog).filter(
        Blog.published == True
    ).order_by(Blog.published_at.desc()).limit(50).all()
    
    # Create RSS feed
    rss = ET.Element("rss", version="2.0")
    rss.set("xmlns:atom", "http://www.w3.org/2005/Atom")
    rss.set("xmlns:content", "http://purl.org/rss/1.0/modules/content/")
    rss.set("xmlns:dc", "http://purl.org/dc/elements/1.1/")
    
    channel = ET.SubElement(rss, "channel")
    
    # Channel info
    ET.SubElement(channel, "title").text = "Skrynia Blog"
    ET.SubElement(channel, "link").text = f"{settings.FRONTEND_URL}/blog"
    ET.SubElement(channel, "description").text = "Історії, традиції та майстерність етнічних прикрас"
    ET.SubElement(channel, "language").text = "uk"
    ET.SubElement(channel, "lastBuildDate").text = datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S GMT")
    
    # Atom self link
    atom_link = ET.SubElement(channel, "atom:link")
    atom_link.set("href", f"{settings.FRONTEND_URL}/api/v1/blog/rss.xml")
    atom_link.set("rel", "self")
    atom_link.set("type", "application/rss+xml")
    
    # Add blog posts as items
    for blog in blogs:
        item = ET.SubElement(channel, "item")
        
        ET.SubElement(item, "title").text = blog.title
        ET.SubElement(item, "link").text = f"{settings.FRONTEND_URL}/blog/{blog.slug}"
        ET.SubElement(item, "guid", isPermaLink="true").text = f"{settings.FRONTEND_URL}/blog/{blog.slug}"
        
        if blog.excerpt:
            ET.SubElement(item, "description").text = blog.excerpt
        
        # Content (full markdown)
        if blog.content:
            content_elem = ET.SubElement(item, "content:encoded")
            content_elem.text = blog.content
        
        # Author
        if blog.author:
            ET.SubElement(item, "dc:creator").text = blog.author
        
        # Publication date
        pub_date = blog.published_at or blog.created_at
        ET.SubElement(item, "pubDate").text = pub_date.strftime("%a, %d %b %Y %H:%M:%S GMT")
        
        # Categories (tags)
        if blog.tags:
            for tag in blog.tags.split(','):
                ET.SubElement(item, "category").text = tag.strip()
        
        # Featured image
        if blog.featured_image:
            enclosure = ET.SubElement(item, "enclosure")
            image_url = blog.featured_image
            if not image_url.startswith('http'):
                image_url = f"{settings.FRONTEND_URL}{image_url}"
            enclosure.set("url", image_url)
            enclosure.set("type", "image/jpeg")
    
    # Generate XML string
    xml_string = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_string += ET.tostring(rss, encoding='unicode', method='xml')
    
    return Response(content=xml_string, media_type="application/xml")
