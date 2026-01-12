"""
Database initialization script.
Creates admin user and categories.
"""
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models.user import User
from app.models.category import Category
from app.core.security import get_password_hash
from app.core.config import settings


def init_db(db: Session) -> None:
    """Initialize database with admin user and categories."""

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

    # Create categories with full translations
    categories_data = [
        {
            "name_uk": "Українські",
            "name_en": "Ukrainian",
            "name_de": "Ukrainisch",
            "name_pl": "Ukraińskie",
            "slug": "ukrainian",
            "description_uk": "Символи сили та захисту",
            "description_en": "Symbols of strength and protection",
            "culture_type": "slavic",
            "icon": "alatyr",
            "is_featured": True
        },
        {
            "name_uk": "Вікінгські",
            "name_en": "Viking",
            "name_de": "Wikinger",
            "name_pl": "Wikingowie",
            "slug": "viking",
            "description_uk": "Відвага і доля воїнів",
            "description_en": "Courage and fate of warriors",
            "culture_type": "viking",
            "icon": "valknut",
            "is_featured": True
        },
        {
            "name_uk": "Кельтські",
            "name_en": "Celtic",
            "name_de": "Keltisch",
            "name_pl": "Celtyckie",
            "slug": "celtic",
            "description_uk": "Триєдність і вічність",
            "description_en": "Trinity and eternity",
            "culture_type": "celtic",
            "icon": "triquetra",
            "is_featured": True
        }
    ]

    for cat_data in categories_data:
        # Check by slug first, then by culture_type for backward compatibility
        category = db.query(Category).filter(
            or_(
                Category.slug == cat_data["slug"],
                and_(
                    Category.culture_type == cat_data["culture_type"],
                    Category.is_featured == True
                )
            )
        ).first()
        
        if not category:
            category = Category(**cat_data)
            db.add(category)
            print(f"✅ Created category: {cat_data['name_uk']}")
        else:
            # Update existing category with new translations if needed
            category.name_uk = cat_data["name_uk"]
            category.name_en = cat_data.get("name_en")
            category.name_de = cat_data.get("name_de")
            category.name_pl = cat_data.get("name_pl")
            category.description_uk = cat_data.get("description_uk")
            category.description_en = cat_data.get("description_en")
            category.slug = cat_data["slug"]
            category.is_featured = True
            print(f"🔄 Updated category: {cat_data['name_uk']}")

    db.commit()

    # Note: Sample products creation removed
    # Products should be created through admin panel or API
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
