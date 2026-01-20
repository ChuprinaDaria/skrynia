"""Add multilingual materials and meta fields, add phone to users

Revision ID: 20260120_multilang_materials_meta
Revises: 20260119_multilang_products
Create Date: 2026-01-20

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20260120_multilang_materials_meta'
down_revision = '20260119_multilang_products'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add per-language materials fields (replacing single 'materials' field)
    op.add_column('products', sa.Column('materials_uk', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('materials_en', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('materials_de', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('materials_pl', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('materials_se', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('materials_no', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('materials_dk', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('materials_fr', sa.JSON(), nullable=True))
    
    # Migrate existing materials to materials_uk
    op.execute("UPDATE products SET materials_uk = materials WHERE materials IS NOT NULL")
    
    # Add per-language meta_description fields (replacing single 'meta_description' field)
    op.add_column('products', sa.Column('meta_description_uk', sa.Text(), nullable=True))
    op.add_column('products', sa.Column('meta_description_en', sa.Text(), nullable=True))
    op.add_column('products', sa.Column('meta_description_de', sa.Text(), nullable=True))
    op.add_column('products', sa.Column('meta_description_pl', sa.Text(), nullable=True))
    op.add_column('products', sa.Column('meta_description_se', sa.Text(), nullable=True))
    op.add_column('products', sa.Column('meta_description_no', sa.Text(), nullable=True))
    op.add_column('products', sa.Column('meta_description_dk', sa.Text(), nullable=True))
    op.add_column('products', sa.Column('meta_description_fr', sa.Text(), nullable=True))
    
    # Migrate existing meta_description to meta_description_uk
    op.execute("UPDATE products SET meta_description_uk = meta_description WHERE meta_description IS NOT NULL")
    
    # Add per-language meta_keywords fields (replacing single 'meta_keywords' field)
    op.add_column('products', sa.Column('meta_keywords_uk', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('meta_keywords_en', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('meta_keywords_de', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('meta_keywords_pl', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('meta_keywords_se', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('meta_keywords_no', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('meta_keywords_dk', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('meta_keywords_fr', sa.JSON(), nullable=True))
    
    # Migrate existing meta_keywords to meta_keywords_uk
    op.execute("UPDATE products SET meta_keywords_uk = meta_keywords WHERE meta_keywords IS NOT NULL")
    
    # Drop old columns
    op.drop_column('products', 'materials')
    op.drop_column('products', 'meta_description')
    op.drop_column('products', 'meta_keywords')
    
    # Add phone to users table
    op.add_column('users', sa.Column('phone', sa.String(), nullable=True))


def downgrade() -> None:
    # Restore single materials column
    op.add_column('products', sa.Column('materials', sa.JSON(), nullable=True))
    op.execute("UPDATE products SET materials = materials_uk WHERE materials_uk IS NOT NULL")
    
    # Restore single meta_description column
    op.add_column('products', sa.Column('meta_description', sa.Text(), nullable=True))
    op.execute("UPDATE products SET meta_description = meta_description_uk WHERE meta_description_uk IS NOT NULL")
    
    # Restore single meta_keywords column
    op.add_column('products', sa.Column('meta_keywords', sa.JSON(), nullable=True))
    op.execute("UPDATE products SET meta_keywords = meta_keywords_uk WHERE meta_keywords_uk IS NOT NULL")
    
    # Remove per-language materials fields
    op.drop_column('products', 'materials_fr')
    op.drop_column('products', 'materials_dk')
    op.drop_column('products', 'materials_no')
    op.drop_column('products', 'materials_se')
    op.drop_column('products', 'materials_pl')
    op.drop_column('products', 'materials_de')
    op.drop_column('products', 'materials_en')
    op.drop_column('products', 'materials_uk')
    
    # Remove per-language meta_description fields
    op.drop_column('products', 'meta_description_fr')
    op.drop_column('products', 'meta_description_dk')
    op.drop_column('products', 'meta_description_no')
    op.drop_column('products', 'meta_description_se')
    op.drop_column('products', 'meta_description_pl')
    op.drop_column('products', 'meta_description_de')
    op.drop_column('products', 'meta_description_en')
    op.drop_column('products', 'meta_description_uk')
    
    # Remove per-language meta_keywords fields
    op.drop_column('products', 'meta_keywords_fr')
    op.drop_column('products', 'meta_keywords_dk')
    op.drop_column('products', 'meta_keywords_no')
    op.drop_column('products', 'meta_keywords_se')
    op.drop_column('products', 'meta_keywords_pl')
    op.drop_column('products', 'meta_keywords_de')
    op.drop_column('products', 'meta_keywords_en')
    op.drop_column('products', 'meta_keywords_uk')
    
    # Remove phone from users
    op.drop_column('users', 'phone')

