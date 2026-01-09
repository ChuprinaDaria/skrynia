"""Add made to order fields

Revision ID: 1b570db54590
Revises: 
Create Date: 2026-01-09 09:32:29.550613

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

# revision identifiers, used by Alembic.
revision = '1b570db54590'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Check if products table exists before adding columns
    bind = op.get_bind()
    inspector = inspect(bind)
    tables = inspector.get_table_names()
    
    if 'products' in tables:
        # Check if columns already exist to avoid errors
        columns = [col['name'] for col in inspector.get_columns('products')]
        
        # Add made to order fields to products table if they don't exist
        if 'is_made_to_order' not in columns:
            op.add_column('products', sa.Column('is_made_to_order', sa.Boolean(), nullable=True, server_default='false'))
        if 'made_to_order_duration' not in columns:
            op.add_column('products', sa.Column('made_to_order_duration', sa.String(), nullable=True))
        
        # Create made_to_order_requests table if it doesn't exist (only if products table exists)
        if 'made_to_order_requests' not in tables:
            op.create_table(
                'made_to_order_requests',
                sa.Column('id', sa.Integer(), nullable=False),
                sa.Column('product_id', sa.Integer(), nullable=False),
                sa.Column('customer_name', sa.String(), nullable=False),
                sa.Column('customer_email', sa.String(), nullable=False),
                sa.Column('customer_phone', sa.String(), nullable=True),
                sa.Column('custom_text', sa.Text(), nullable=True),
                sa.Column('description', sa.Text(), nullable=True),
                sa.Column('status', sa.String(), nullable=True, server_default='new'),
                sa.Column('is_read', sa.Boolean(), nullable=True, server_default='false'),
                sa.Column('admin_notes', sa.Text(), nullable=True),
                sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
                sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
                sa.ForeignKeyConstraint(['product_id'], ['products.id'], ),
                sa.PrimaryKeyConstraint('id')
            )
            op.create_index(op.f('ix_made_to_order_requests_id'), 'made_to_order_requests', ['id'], unique=False)
            op.create_index(op.f('ix_made_to_order_requests_product_id'), 'made_to_order_requests', ['product_id'], unique=False)


def downgrade() -> None:
    # Check if tables exist before dropping
    bind = op.get_bind()
    inspector = inspect(bind)
    tables = inspector.get_table_names()
    
    # Drop made_to_order_requests table if it exists
    if 'made_to_order_requests' in tables:
        indexes = [idx['name'] for idx in inspector.get_indexes('made_to_order_requests')]
        if 'ix_made_to_order_requests_product_id' in indexes:
            op.drop_index(op.f('ix_made_to_order_requests_product_id'), table_name='made_to_order_requests')
        if 'ix_made_to_order_requests_id' in indexes:
            op.drop_index(op.f('ix_made_to_order_requests_id'), table_name='made_to_order_requests')
        op.drop_table('made_to_order_requests')
    
    # Remove made to order fields from products table if it exists
    if 'products' in tables:
        columns = [col['name'] for col in inspector.get_columns('products')]
        if 'made_to_order_duration' in columns:
            op.drop_column('products', 'made_to_order_duration')
        if 'is_made_to_order' in columns:
            op.drop_column('products', 'is_made_to_order')
