"""Add deposit_amount field to orders for made-to-order partial payments

Revision ID: 20260119_add_deposit
Revises: 20260119_multilang_categories
Create Date: 2026-01-19

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20260119_add_deposit'
down_revision = '20260119_multilang_categories'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add deposit_amount field for made-to-order partial payments (50%)
    op.add_column('orders', sa.Column('deposit_amount', sa.Float(), nullable=True))
    op.add_column('orders', sa.Column('is_made_to_order', sa.Boolean(), nullable=True, server_default='false'))


def downgrade() -> None:
    op.drop_column('orders', 'is_made_to_order')
    op.drop_column('orders', 'deposit_amount')

