"""
Script to remove mock/sample products from database.
Run this to delete test products created by init_db.py
"""
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.product import Product, ProductImage

# List of mock product slugs to remove
MOCK_PRODUCT_SLUGS = [
    "coral-necklace-alatyr",
    "silver-pendant-valknut",
    "triquetra-bracelet-amber"
]


def remove_mock_products(db: Session) -> None:
    """Remove mock products from database."""
    deleted_count = 0
    
    for slug in MOCK_PRODUCT_SLUGS:
        product = db.query(Product).filter(Product.slug == slug).first()
        if product:
            # Delete associated images first (due to foreign key)
            db.query(ProductImage).filter(ProductImage.product_id == product.id).delete()
            
            # Delete product
            db.delete(product)
            deleted_count += 1
            print(f"✅ Deleted mock product: {slug} ({product.title_uk})")
        else:
            print(f"ℹ️  Product not found: {slug}")
    
    db.commit()
    
    if deleted_count > 0:
        print(f"\n🎉 Successfully deleted {deleted_count} mock product(s)")
    else:
        print("\nℹ️  No mock products found to delete")


def main():
    """Main function."""
    print("🗑️  Removing mock products from database...")
    
    db = SessionLocal()
    try:
        remove_mock_products(db)
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()

