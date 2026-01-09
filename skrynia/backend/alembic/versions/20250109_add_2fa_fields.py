"""Add 2FA fields to users table

Revision ID: add_2fa_fields
Revises: 
Create Date: 2025-01-09

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_2fa_fields'
down_revision = None  # Update this with the latest migration
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('users', sa.Column('two_factor_secret', sa.String(), nullable=True))
    op.add_column('users', sa.Column('two_factor_enabled', sa.Boolean(), nullable=False, server_default='false'))


def downgrade():
    op.drop_column('users', 'two_factor_enabled')
    op.drop_column('users', 'two_factor_secret')

