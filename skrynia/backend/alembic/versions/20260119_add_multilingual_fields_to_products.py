"""Add multilingual fields to products (SE, NO, DK, FR)

Revision ID: 20260119_multilang_products
Revises: 
Create Date: 2026-01-19

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20260119_multilang_products'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add title fields for SE, NO, DK, FR
    op.add_column('products', sa.Column('title_se', sa.String(), nullable=True))
    op.add_column('products', sa.Column('title_no', sa.String(), nullable=True))
    op.add_column('products', sa.Column('title_dk', sa.String(), nullable=True))
    op.add_column('products', sa.Column('title_fr', sa.String(), nullable=True))
    
    # Add description fields for SE, NO, DK, FR
    op.add_column('products', sa.Column('description_se', sa.Text(), nullable=True))
    op.add_column('products', sa.Column('description_no', sa.Text(), nullable=True))
    op.add_column('products', sa.Column('description_dk', sa.Text(), nullable=True))
    op.add_column('products', sa.Column('description_fr', sa.Text(), nullable=True))
    
    # Add legend_title fields for SE, NO, DK, FR
    op.add_column('products', sa.Column('legend_title_se', sa.String(), nullable=True))
    op.add_column('products', sa.Column('legend_title_no', sa.String(), nullable=True))
    op.add_column('products', sa.Column('legend_title_dk', sa.String(), nullable=True))
    op.add_column('products', sa.Column('legend_title_fr', sa.String(), nullable=True))
    
    # Add legend_content fields for SE, NO, DK, FR
    op.add_column('products', sa.Column('legend_content_se', sa.Text(), nullable=True))
    op.add_column('products', sa.Column('legend_content_no', sa.Text(), nullable=True))
    op.add_column('products', sa.Column('legend_content_dk', sa.Text(), nullable=True))
    op.add_column('products', sa.Column('legend_content_fr', sa.Text(), nullable=True))
    
    # Add per-language tags fields (replacing single 'tags' field)
    op.add_column('products', sa.Column('tags_uk', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('tags_en', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('tags_de', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('tags_pl', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('tags_se', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('tags_no', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('tags_dk', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('tags_fr', sa.JSON(), nullable=True))
    
    # Migrate existing tags to tags_uk
    op.execute("UPDATE products SET tags_uk = tags WHERE tags IS NOT NULL")
    
    # Drop old tags column
    op.drop_column('products', 'tags')


def downgrade() -> None:
    # Restore single tags column
    op.add_column('products', sa.Column('tags', sa.JSON(), nullable=True))
    
    # Migrate tags_uk back to tags
    op.execute("UPDATE products SET tags = tags_uk WHERE tags_uk IS NOT NULL")
    
    # Remove per-language tags fields
    op.drop_column('products', 'tags_fr')
    op.drop_column('products', 'tags_dk')
    op.drop_column('products', 'tags_no')
    op.drop_column('products', 'tags_se')
    op.drop_column('products', 'tags_pl')
    op.drop_column('products', 'tags_de')
    op.drop_column('products', 'tags_en')
    op.drop_column('products', 'tags_uk')
    
    # Remove legend_content fields
    op.drop_column('products', 'legend_content_fr')
    op.drop_column('products', 'legend_content_dk')
    op.drop_column('products', 'legend_content_no')
    op.drop_column('products', 'legend_content_se')
    
    # Remove legend_title fields
    op.drop_column('products', 'legend_title_fr')
    op.drop_column('products', 'legend_title_dk')
    op.drop_column('products', 'legend_title_no')
    op.drop_column('products', 'legend_title_se')
    
    # Remove description fields
    op.drop_column('products', 'description_fr')
    op.drop_column('products', 'description_dk')
    op.drop_column('products', 'description_no')
    op.drop_column('products', 'description_se')
    
    # Remove title fields
    op.drop_column('products', 'title_fr')
    op.drop_column('products', 'title_dk')
    op.drop_column('products', 'title_no')
    op.drop_column('products', 'title_se')

