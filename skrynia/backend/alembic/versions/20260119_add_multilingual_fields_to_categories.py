"""Add multilingual fields to categories (SE, NO, DK, FR + descriptions)

Revision ID: 20260119_multilang_categories
Revises: 20260119_multilang_products
Create Date: 2026-01-19

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20260119_multilang_categories'
down_revision = '20260119_multilang_products'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add name fields for SE, NO, DK, FR
    op.add_column('categories', sa.Column('name_se', sa.String(), nullable=True))
    op.add_column('categories', sa.Column('name_no', sa.String(), nullable=True))
    op.add_column('categories', sa.Column('name_dk', sa.String(), nullable=True))
    op.add_column('categories', sa.Column('name_fr', sa.String(), nullable=True))
    
    # Add description fields for DE, PL, SE, NO, DK, FR
    op.add_column('categories', sa.Column('description_de', sa.Text(), nullable=True))
    op.add_column('categories', sa.Column('description_pl', sa.Text(), nullable=True))
    op.add_column('categories', sa.Column('description_se', sa.Text(), nullable=True))
    op.add_column('categories', sa.Column('description_no', sa.Text(), nullable=True))
    op.add_column('categories', sa.Column('description_dk', sa.Text(), nullable=True))
    op.add_column('categories', sa.Column('description_fr', sa.Text(), nullable=True))


def downgrade() -> None:
    # Remove description fields
    op.drop_column('categories', 'description_fr')
    op.drop_column('categories', 'description_dk')
    op.drop_column('categories', 'description_no')
    op.drop_column('categories', 'description_se')
    op.drop_column('categories', 'description_pl')
    op.drop_column('categories', 'description_de')
    
    # Remove name fields
    op.drop_column('categories', 'name_fr')
    op.drop_column('categories', 'name_dk')
    op.drop_column('categories', 'name_no')
    op.drop_column('categories', 'name_se')

