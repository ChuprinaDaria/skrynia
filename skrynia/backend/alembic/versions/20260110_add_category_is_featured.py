"""Add is_featured field to categories table

Revision ID: add_category_is_featured
Revises: 20260110_add_blog_tables
Create Date: 2026-01-10

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision = 'add_category_is_featured'
down_revision = 'add_blog_tables'  # Update with latest migration
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Check if categories table exists before adding column
    bind = op.get_bind()
    inspector = inspect(bind)
    tables = inspector.get_table_names()
    
    if 'categories' not in tables:
        # Table doesn't exist yet, skip this migration
        return
    
    # Check if column already exists
    columns = [col['name'] for col in inspector.get_columns('categories')]
    
    if 'is_featured' not in columns:
        # Add is_featured column with default False
        op.add_column('categories', sa.Column('is_featured', sa.Boolean(), nullable=False, server_default='false'))
        
        # Update existing featured categories (slavic, viking, celtic)
        op.execute("""
            UPDATE categories 
            SET is_featured = true 
            WHERE slug IN ('slavic', 'viking', 'celtic')
        """)


def downgrade() -> None:
    # Check if categories table exists before dropping column
    bind = op.get_bind()
    inspector = inspect(bind)
    tables = inspector.get_table_names()
    
    if 'categories' not in tables:
        return
    
    columns = [col['name'] for col in inspector.get_columns('categories')]
    
    if 'is_featured' in columns:
        op.drop_column('categories', 'is_featured')

