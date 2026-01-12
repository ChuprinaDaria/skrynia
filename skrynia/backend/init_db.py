"""
Database initialization script.
Creates admin user and categories.
"""
from sqlalchemy.orm import Session
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

    # Create categories
    categories_data = [
        {
            "name_uk": "Слов'янські",
            "name_en": "Slavic",
            "slug": "slavic",
            "description_uk": "Символи сили та захисту",
            "culture_type": "slavic",
            "icon": "alatyr",
            "is_featured": True
        },
        {
            "name_uk": "Вікінгські",
            "name_en": "Viking",
            "slug": "viking",
            "description_uk": "Відвага і доля воїнів",
            "culture_type": "viking",
            "icon": "valknut",
            "is_featured": True
        },
        {
            "name_uk": "Кельтські",
            "name_en": "Celtic",
            "slug": "celtic",
            "description_uk": "Триєдність і вічність",
            "culture_type": "celtic",
            "icon": "triquetra",
            "is_featured": True
        }
    ]

    for cat_data in categories_data:
        category = db.query(Category).filter(Category.slug == cat_data["slug"]).first()
        if not category:
            category = Category(**cat_data)
            db.add(category)
            print(f"✅ Created category: {cat_data['name_uk']}")

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
