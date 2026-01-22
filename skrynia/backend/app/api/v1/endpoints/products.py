from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from fastapi.responses import Response
from sqlalchemy.orm import Session
from typing import List, Optional
from slugify import slugify
from datetime import datetime
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


def _get_products_impl(
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
            is_featured=product.is_featured,
            updated_at=product.updated_at
        ))

    return result


@router.get("", response_model=List[ProductList])
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
    return _get_products_impl(skip, limit, category_id, is_featured, is_active, search, db)


@router.api_route("/catalog.csv", methods=["GET", "HEAD", "OPTIONS"])
def get_products_catalog_csv(
    request: Request,
    lang: Optional[str] = Query("uk", description="Language code: uk, en, de, pl, se, no, dk, fr"),
    db: Session = Depends(get_db)
):
    """
    Generate Meta (Facebook) product catalog CSV feed.
    This endpoint is public and returns a CSV file with all active products
    formatted according to Meta's catalog requirements.
    
    Supports GET (full CSV), HEAD (headers only), and OPTIONS (CORS preflight).
    
    Language parameter:
    - uk: Ukrainian (default)
    - en: English
    - de: German
    - pl: Polish
    - se: Swedish
    - no: Norwegian
    - dk: Danish
    - fr: French
    """
    
    # Handle OPTIONS (CORS preflight)
    if request.method == "OPTIONS":
        return Response(
            status_code=204,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Max-Age": "3600",
            }
        )
    
    try:
        # Get all active products with images eagerly loaded
        from sqlalchemy.orm import joinedload
        products = db.query(Product).options(joinedload(Product.images)).filter(Product.is_active == True).all()
        
        # Get URLs for product links and images
        frontend_url = settings.FRONTEND_URL or "https://runebox.eu"
        backend_url = settings.BACKEND_URL or frontend_url
        
        # Ensure URLs don't end with /
        frontend_url = frontend_url.rstrip('/')
        backend_url = backend_url.rstrip('/')
    except Exception as e:
        # Log error and return 500
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error fetching products for CSV catalog: {str(e)}")
        return Response(
            status_code=500,
            content=f"Error generating catalog: {str(e)}",
            media_type="text/plain"
        )
    
    # Normalize language code (handle both UA and uk, etc.)
    lang_map = {
        "ua": "uk",
        "uk": "uk",
        "en": "en",
        "de": "de",
        "pl": "pl",
        "se": "se",
        "no": "no",
        "dk": "dk",
        "fr": "fr"
    }
    lang_code = lang_map.get(lang.lower() if lang else "uk", "uk")
    
    # Helper function to get multilingual field with fallback
    def get_field(product, field_name: str, lang_code: str):
        """Get field value for specified language with fallback to uk, then en."""
        # Try requested language
        field = getattr(product, f"{field_name}_{lang_code}", None)
        if field:
            return field
        
        # Fallback to Ukrainian
        if lang_code != "uk":
            field = getattr(product, f"{field_name}_uk", None)
            if field:
                return field
        
        # Fallback to English
        if lang_code != "en":
            field = getattr(product, f"{field_name}_en", None)
            if field:
                return field
        
        # Return empty string if nothing found
        return ""
    
    # Currency mapping
    currency_map = {
        "zł": "PLN",
        "PLN": "PLN",
        "EUR": "EUR",
        "USD": "USD",
        "UAH": "UAH"
    }
    
    try:
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
        
        # Write CSV header row (column names only, no comments)
        # Meta accepts CSV with or without comment lines
        writer = csv.DictWriter(
            output, 
            fieldnames=fieldnames, 
            quoting=csv.QUOTE_ALL,
            lineterminator='\n'
        )
        writer.writeheader()
        
        for product in products:
            # Get primary image or first image
            primary_image = None
            if product.images and len(product.images) > 0:
                primary_image = next(
                    (img for img in product.images if img.is_primary),
                    product.images[0] if product.images else None
                )
            
            # Build image URLs
            # ВАЖЛИВО: Використовуємо frontend_url для зображень, оскільки nginx проксує /static/ до backend
            # Це забезпечує доступність зображень для Facebook/Meta crawler
            image_link = None
            if primary_image and primary_image.image_url:
                image_url = primary_image.image_url.strip()
                if image_url.startswith('http://') or image_url.startswith('https://'):
                    # Already absolute URL - use as is (but ensure HTTPS in production)
                    image_link = image_url
                    if 'runebox.eu' in image_link and image_link.startswith('http://'):
                        image_link = image_link.replace('http://', 'https://')
                elif image_url.startswith('/static/') or image_url.startswith('/uploads/'):
                    # Static files: use frontend URL (nginx proxies /static/ to backend)
                    image_link = urljoin(frontend_url, image_url)
                elif image_url.startswith('/'):
                    # Frontend public assets
                    image_link = urljoin(frontend_url, image_url)
                else:
                    # Relative path - prepend frontend URL
                    image_link = urljoin(frontend_url, '/' + image_url.lstrip('/'))
            
            # Fallback to placeholder if no image (Meta requires image_link)
            if not image_link:
                image_link = f"{frontend_url}/images/logo/logo-white-pink-1.png"
            
            # Build product link (frontend URL)
            product_link = f"{frontend_url}/products/{product.slug}"
            
            # Format price
            currency_code = currency_map.get(product.currency, "PLN")
            price_str = f"{product.price:.2f} {currency_code}"
            
            # Availability
            if product.is_made_to_order:
                availability = "preorder"
            elif product.stock_quantity and product.stock_quantity > 0:
                availability = "in stock"
            else:
                availability = "out of stock"
            
            # Format materials (max 200 chars per Meta requirements)
            material_str = None
            materials = get_field(product, "materials", lang_code)
            if materials and isinstance(materials, list):
                material_str = ", ".join(str(m) for m in materials[:3])  # Limit to 3 materials
                if len(material_str) > 200:
                    material_str = material_str[:197] + "..."
            
            # Format description (remove markdown, limit to 9999 chars for Meta)
            description = get_field(product, "description", lang_code) or ""
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
            
            # Get tags (use selected language, fallback to uk, then en)
            tags = []
            tags_field = get_field(product, "tags", lang_code)
            if tags_field and isinstance(tags_field, list):
                tags = tags_field[:2]  # Meta allows up to 2 product_tags
            
            # Format title (max 200 chars per Meta requirements)
            title = get_field(product, "title", lang_code) or "Product"
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
                'quantity_to_sell_on_facebook': str(product.stock_quantity) if not product.is_made_to_order and product.stock_quantity and product.stock_quantity >= 1 else '',
                'sale_price': f"{product.compare_at_price:.2f} {currency_code}" if product.compare_at_price is not None and product.compare_at_price > product.price else '',
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
        
        # Prepare headers
        headers = {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": "inline; filename=catalog_products.csv",
            "Cache-Control": "public, max-age=3600",
            # CORS headers for Facebook/Meta crawler
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
        
        # For HEAD request, return only headers without body
        if request.method == "HEAD":
            return Response(
                status_code=200,
                headers=headers
            )
        
        # Return CSV as response with UTF-8 encoding
        return Response(
            content=csv_content.encode('utf-8-sig'),  # UTF-8 with BOM for Excel compatibility
            media_type="text/csv",
            headers=headers
        )
    except Exception as e:
        # Log error and return 500
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error generating CSV catalog: {str(e)}", exc_info=True)
        return Response(
            status_code=500,
            content=f"Error generating catalog: {str(e)}",
            media_type="text/plain",
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
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


@router.post("", response_model=ProductSchema, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=ProductSchema, status_code=status.HTTP_201_CREATED)
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


@router.patch("/{product_id}", response_model=ProductSchema)
def update_product(
    product_id: int,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update a product (admin only). 
    
    If images are provided, they will be ADDED to existing images (not replaced).
    To replace all images, first delete the product images via a separate endpoint.
    """
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    # Get update data, excluding images (handled separately)
    update_data = product_in.model_dump(exclude_unset=True, exclude={"images"})
    
    # Update regular fields
    for field, value in update_data.items():
        setattr(product, field, value)

    # Handle images - ADD new images to existing ones
    if product_in.images is not None and len(product_in.images) > 0:
        # Get current max position
        existing_images = db.query(ProductImage).filter(
            ProductImage.product_id == product_id
        ).all()
        max_position = max([img.position for img in existing_images], default=-1)
        
        # Check if any existing image is primary
        has_primary = any(img.is_primary for img in existing_images)
        
        # Add new images
        for idx, image_data in enumerate(product_in.images):
            # Check if image with same URL already exists
            existing_url = db.query(ProductImage).filter(
                ProductImage.product_id == product_id,
                ProductImage.image_url == image_data.image_url
            ).first()
            
            if existing_url:
                # Update existing image
                existing_url.alt_text = image_data.alt_text or existing_url.alt_text
                existing_url.position = image_data.position if image_data.position is not None else existing_url.position
                if image_data.is_primary:
                    # If this image is set as primary, unset others
                    for img in existing_images:
                        img.is_primary = False
                    existing_url.is_primary = True
            else:
                # Create new image
                new_position = max_position + idx + 1
                is_primary = image_data.is_primary if has_primary else (idx == 0 and not has_primary)
                
                # If this image is set as primary, unset others
                if is_primary:
                    for img in existing_images:
                        img.is_primary = False
                
                new_image = ProductImage(
                    product_id=product_id,
                    image_url=image_data.image_url,
                    alt_text=image_data.alt_text or product.title_uk,
                    position=new_position,
                    is_primary=is_primary
                )
                db.add(new_image)

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
    from app.models.order import OrderItem
    from app.models.made_to_order import MadeToOrderRequest
    from app.models.blog import blog_products
    from sqlalchemy import text
    import json
    import os
    from pathlib import Path
    
    # МАРКЕР ДЛЯ ПЕРЕВІРКИ: Перевіряємо чи код потрапив в Docker образ
    # Шлях: backend/app/api/v1/endpoints/products.py -> backend/BUILD_MARKER.json
    marker_file = Path(__file__).parent.parent.parent.parent.parent / "BUILD_MARKER.json"
    build_marker = None
    if marker_file.exists():
        try:
            with open(marker_file, "r", encoding="utf-8") as f:
                build_data = json.load(f)
                build_marker = build_data.get("marker", "UNKNOWN")
        except:
            build_marker = "MARKER_FILE_EXISTS_BUT_UNREADABLE"
    else:
        build_marker = "MARKER_FILE_NOT_FOUND"
    
    # Логуємо маркер для перевірки
    print(f"[SKRYNIA_DELETE_MARKER] Build marker: {build_marker}")
    
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    # Check if product is used in any orders
    order_items_count = db.query(OrderItem).filter(OrderItem.product_id == product_id).count()
    if order_items_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete product: it is used in {order_items_count} order(s). Products in orders cannot be deleted to preserve order history."
        )

    # Check if product is linked to any blog posts
    blog_links_count = db.execute(
        text("SELECT COUNT(*) FROM blog_products WHERE product_id = :product_id"),
        {"product_id": product_id}
    ).scalar()
    if blog_links_count > 0:
        # Remove links to blog posts (cascade delete from association table)
        db.execute(
            text("DELETE FROM blog_products WHERE product_id = :product_id"),
            {"product_id": product_id}
        )

    # Check and delete made-to-order requests linked to this product
    made_to_order_count = db.query(MadeToOrderRequest).filter(MadeToOrderRequest.product_id == product_id).count()
    if made_to_order_count > 0:
        # Delete all made-to-order requests for this product
        db.query(MadeToOrderRequest).filter(MadeToOrderRequest.product_id == product_id).delete()
        print(f"[SKRYNIA_DELETE_INFO] Deleted {made_to_order_count} made-to-order request(s) for product {product_id}")

    try:
        # Delete product images first (cascade should handle this, but being explicit)
        # Load images to delete them properly
        images = db.query(ProductImage).filter(ProductImage.product_id == product_id).all()
        for image in images:
            db.delete(image)
        
        # Delete the product (already loaded above)
        db.delete(product)
        db.commit()
        
        # МАРКЕР ДЛЯ ПЕРЕВІРКИ: Логуємо успішне видалення з маркером збірки
        print(f"[SKRYNIA_DELETE_SUCCESS] Product {product_id} deleted successfully. Build marker: {build_marker}")
        
    except Exception as e:
        db.rollback()
        import traceback
        error_detail = str(e)
        traceback.print_exc()
        # МАРКЕР ДЛЯ ПЕРЕВІРКИ: Логуємо помилку з маркером збірки
        print(f"[SKRYNIA_DELETE_ERROR] Failed to delete product {product_id}. Build marker: {build_marker}. Error: {error_detail}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete product: {error_detail}"
        )

    return None
