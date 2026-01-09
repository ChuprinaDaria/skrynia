"""
Database initialization script.
Creates admin user and sample data for development.
"""
from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models.user import User
from app.models.category import Category
from app.models.product import Product, ProductImage
from app.core.security import get_password_hash
from app.core.config import settings


def init_db(db: Session) -> None:
    """Initialize database with admin user and sample data."""

    # Create admin user
    admin = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
    if not admin:
        admin = User(
            email=settings.ADMIN_EMAIL,
            hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
            full_name="Admin",
            is_active=True,
            is_admin=True
        )
        db.add(admin)
        print(f"✅ Created admin user: {settings.ADMIN_EMAIL}")
    else:
        print(f"⚠️  Admin user already exists: {settings.ADMIN_EMAIL}")

    # Create categories
    categories_data = [
        {
            "name_uk": "Українські",
            "name_en": "Ukrainian",
            "slug": "ukrainian",
            "description_uk": "Символи сили та захисту",
            "culture_type": "ukrainian",
            "icon": "alatyr"
        },
        {
            "name_uk": "Вікінгські",
            "name_en": "Viking",
            "slug": "viking",
            "description_uk": "Відвага і доля воїнів",
            "culture_type": "viking",
            "icon": "valknut"
        },
        {
            "name_uk": "Кельтські",
            "name_en": "Celtic",
            "slug": "celtic",
            "description_uk": "Триєдність і вічність",
            "culture_type": "celtic",
            "icon": "triquetra"
        }
    ]

    for cat_data in categories_data:
        category = db.query(Category).filter(Category.slug == cat_data["slug"]).first()
        if not category:
            category = Category(**cat_data)
            db.add(category)
            print(f"✅ Created category: {cat_data['name_uk']}")

    db.commit()

    # Get category IDs
    ukrainian_cat = db.query(Category).filter(Category.slug == "ukrainian").first()
    viking_cat = db.query(Category).filter(Category.slug == "viking").first()
    celtic_cat = db.query(Category).filter(Category.slug == "celtic").first()

    # Create sample products
    sample_products = [
        {
            "title_uk": "Намисто з натурального коралу \"Алатир\"",
            "title_en": "Natural Coral Necklace \"Alatyr\"",
            "slug": "coral-necklace-alatyr",
            "description_uk": "Унікальне намисто з натурального коралу та срібла 925 проби. Кожна намистина відшліфована вручну.",
            "legend_title_uk": "Легенда Символу Алатир",
            "legend_content_uk": "Алатир — священний символ центру Всесвіту у слов'янській міфології.",
            "price": 1200.0,
            "stock_quantity": 5,
            "sku": "COR-ALAT-001",
            "materials": ["Натуральний корал", "Срібло 925 проби"],
            "specifications": {
                "Матеріал намистин": "Натуральний корал",
                "Підвіска": "Срібло 925",
                "Довжина": "45-50 см"
            },
            "category_id": ukrainian_cat.id if ukrainian_cat else None,
            "symbols": ["protection", "wisdom"],
            "is_featured": True
        },
        {
            "title_uk": "Срібний кулон \"Валькнут\"",
            "title_en": "Silver Pendant \"Valknut\"",
            "slug": "silver-pendant-valknut",
            "description_uk": "Автентичний вікінгський символ виконаний у сріблі 925 проби.",
            "price": 850.0,
            "stock_quantity": 10,
            "sku": "SIL-VALK-001",
            "materials": ["Срібло 925", "Оксидоване срібло"],
            "category_id": viking_cat.id if viking_cat else None,
            "symbols": ["protection", "wisdom"],
            "is_featured": True
        },
        {
            "title_uk": "Браслет \"Трикветр\" з бурштином",
            "title_en": "Triquetra Bracelet with Amber",
            "slug": "triquetra-bracelet-amber",
            "description_uk": "Кельтський символ вічності з натуральним бурштином.",
            "price": 950.0,
            "stock_quantity": 7,
            "sku": "AMB-TRIQ-001",
            "materials": ["Бурштин", "Срібло 925", "Шкіра"],
            "category_id": celtic_cat.id if celtic_cat else None,
            "symbols": ["love", "wisdom"],
            "is_featured": True
        }
    ]

    for prod_data in sample_products:
        product = db.query(Product).filter(Product.slug == prod_data["slug"]).first()
        if not product:
            product = Product(**prod_data)
            db.add(product)
            db.flush()

            # Add placeholder image
            image = ProductImage(
                product_id=product.id,
                image_url=f"/images/products/{prod_data['slug']}.jpg",
                alt_text=prod_data["title_uk"],
                position=0,
                is_primary=True
            )
            db.add(image)
            print(f"✅ Created product: {prod_data['title_uk']}")

    db.commit()
    print("\n🎉 Database initialized successfully!")


def main():
    """Main initialization function."""
    print("🚀 Initializing database...")

    # Create tables
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")

    # Initialize data
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()


if __name__ == "__main__":
    main()
