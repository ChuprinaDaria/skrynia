"""
Script to ensure database tables exist before running migrations.
This creates tables if they don't exist, which is useful when migrations
don't have an initial migration that creates all tables.
"""
from sqlalchemy import inspect
from app.db.base import Base
from app.db.session import engine
from app.models import *  # Import all models to register them with Base


def ensure_tables():
    """Create all tables if they don't exist."""
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    
    # Check if users table exists
    if 'users' not in existing_tables:
        print("⚠️  Users table not found. Creating all tables from models...")
        Base.metadata.create_all(bind=engine)
        print("✅ All tables created successfully")
    else:
        print("✅ Database tables already exist")


if __name__ == "__main__":
    ensure_tables()

