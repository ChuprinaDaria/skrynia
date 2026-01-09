"""Add 2FA fields to users table

Revision ID: add_2fa_fields
Revises: 
Create Date: 2025-01-09

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision = 'add_2fa_fields'
down_revision = None  # Update this with the latest migration
branch_labels = None
depends_on = None


def upgrade():
    # Check if users table exists before adding columns
    bind = op.get_bind()
    inspector = inspect(bind)
    tables = inspector.get_table_names()
    
    if 'users' not in tables:
        # Table doesn't exist yet, skip this migration
        # It will be created by Base.metadata.create_all() or initial migration
        return
    
    # Check if columns already exist
    columns = [col['name'] for col in inspector.get_columns('users')]
    
    if 'two_factor_secret' not in columns:
        op.add_column('users', sa.Column('two_factor_secret', sa.String(), nullable=True))
    
    if 'two_factor_enabled' not in columns:
        op.add_column('users', sa.Column('two_factor_enabled', sa.Boolean(), nullable=False, server_default='false'))


def downgrade():
    # Check if users table exists before dropping columns
    bind = op.get_bind()
    inspector = inspect(bind)
    tables = inspector.get_table_names()
    
    if 'users' not in tables:
        return
    
    columns = [col['name'] for col in inspector.get_columns('users')]
    
    if 'two_factor_enabled' in columns:
        op.drop_column('users', 'two_factor_enabled')
    
    if 'two_factor_secret' in columns:
        op.drop_column('users', 'two_factor_secret')

