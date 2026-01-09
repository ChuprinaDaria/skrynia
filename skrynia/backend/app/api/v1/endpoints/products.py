from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session
from typing import List, Optional
from slugify import slugify
import csv
import io
import re
from urllib.parse import urljoin

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
from app.core.config import settings

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


@router.get("/catalog.csv")
def get_products_catalog_csv(db: Session = Depends(get_db)):
    """
    Generate Meta (Facebook) product catalog CSV feed.
    This endpoint is public and returns a CSV file with all active products
    formatted according to Meta's catalog requirements.
    """
    # Get all active products
    products = db.query(Product).filter(Product.is_active == True).all()
    
    # Get URLs for product links and images
    frontend_url = settings.FRONTEND_URL or "https://runebox.eu"
    backend_url = settings.BACKEND_URL or frontend_url
    
    # Ensure URLs don't end with /
    frontend_url = frontend_url.rstrip('/')
    backend_url = backend_url.rstrip('/')
    
    # Currency mapping
    currency_map = {
        "zł": "PLN",
        "PLN": "PLN",
        "EUR": "EUR",
        "USD": "USD",
        "UAH": "UAH"
    }
    
    # Create CSV in memory with UTF-8 encoding
    output = io.StringIO()
    
    # Meta CSV headers (based on the example file)
    fieldnames = [
        'id', 'title', 'description', 'availability', 'condition', 'price',
        'link', 'image_link', 'brand', 'google_product_category',
        'fb_product_category', 'quantity_to_sell_on_facebook', 'sale_price',
        'sale_price_effective_date', 'item_group_id', 'gender', 'color',
        'size', 'age_group', 'material', 'pattern', 'shipping',
        'shipping_weight', 'video[0].url', 'video[0].tag[0]', 'gtin',
        'product_tags[0]', 'product_tags[1]', 'style[0]'
    ]
    
    writer = csv.DictWriter(
        output, 
        fieldnames=fieldnames, 
        quoting=csv.QUOTE_ALL,
        lineterminator='\n'
    )
    writer.writeheader()
    
    for product in products:
        # Get primary image or first image
        primary_image = next(
            (img for img in product.images if img.is_primary),
            product.images[0] if product.images else None
        )
        
        # Build image URLs
        image_link = None
        if primary_image:
            if primary_image.image_url.startswith('http'):
                image_link = primary_image.image_url
            else:
                # Static files are served from backend
                image_link = urljoin(backend_url, primary_image.image_url)
        
        # Build product link (frontend URL)
        product_link = f"{frontend_url}/products/{product.slug}"
        
        # Format price
        currency_code = currency_map.get(product.currency, "PLN")
        price_str = f"{product.price:.2f} {currency_code}"
        
        # Availability
        if product.is_made_to_order:
            availability = "preorder"
        elif product.stock_quantity > 0:
            availability = "in stock"
        else:
            availability = "out of stock"
        
        # Format materials (max 200 chars per Meta requirements)
        material_str = None
        if product.materials and isinstance(product.materials, list):
            material_str = ", ".join(product.materials[:3])  # Limit to 3 materials
            if len(material_str) > 200:
                material_str = material_str[:197] + "..."
        
        # Format description (remove markdown, limit to 9999 chars for Meta)
        description = product.description_uk or product.description_en or ""
        # Remove markdown formatting more thoroughly
        # Remove markdown links [text](url)
        description = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', description)
        # Remove markdown bold/italic
        description = description.replace("**", "").replace("*", "").replace("__", "").replace("_", "")
        # Remove markdown headers
        description = re.sub(r'^#+\s*', '', description, flags=re.MULTILINE)
        # Remove extra whitespace
        description = ' '.join(description.split())
        # Ensure not all uppercase (Meta requirement)
        if description.isupper() and len(description) > 0:
            description = description.capitalize()
        # Limit length to 9999 chars (Meta limit)
        if len(description) > 9999:
            description = description[:9996] + "..."
        
        # Get tags
        tags = []
        if product.tags and isinstance(product.tags, list):
            tags = product.tags[:2]  # Meta allows up to 2 product_tags
        
        # Format title (max 200 chars per Meta requirements)
        title = product.title_uk or product.title_en or "Product"
        if len(title) > 200:
            title = title[:197] + "..."
        
        # Format ID (max 100 chars per Meta requirements, must be unique)
        product_id = product.sku or str(product.id)
        if len(product_id) > 100:
            product_id = product_id[:100]
        
        # Build row data
        row = {
            'id': product_id,
            'title': title,
            'description': description,
            'availability': availability,
            'condition': 'new',
            'price': price_str,
            'link': product_link,
            'image_link': image_link or '',
            'brand': 'Rune box',
            'google_product_category': 'Apparel & Accessories > Jewelry',
            'fb_product_category': 'Clothing & Accessories > Jewelry',
            'quantity_to_sell_on_facebook': str(product.stock_quantity) if not product.is_made_to_order and product.stock_quantity >= 1 else '',
            'sale_price': f"{product.compare_at_price:.2f} {currency_code}" if product.compare_at_price and product.compare_at_price > product.price else '',
            'sale_price_effective_date': '',
            'item_group_id': '',
            'gender': 'unisex',
            'color': '',
            'size': '',
            'age_group': 'adult',
            'material': material_str or '',
            'pattern': '',
            'shipping': '',
            'shipping_weight': '',
            'video[0].url': '',
            'video[0].tag[0]': '',
            'gtin': '',
            'product_tags[0]': tags[0] if len(tags) > 0 else '',
            'product_tags[1]': tags[1] if len(tags) > 1 else '',
            'style[0]': ''
        }
        
        writer.writerow(row)
    
    # Get CSV content
    csv_content = output.getvalue()
    output.close()
    
    # Return CSV as response with UTF-8 encoding
    return Response(
        content=csv_content.encode('utf-8-sig'),  # UTF-8 with BOM for Excel compatibility
        media_type="text/csv; charset=utf-8",
        headers={
            "Content-Disposition": "attachment; filename=catalog_products.csv",
            "Cache-Control": "public, max-age=3600"  # Cache for 1 hour
        }
    )


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
