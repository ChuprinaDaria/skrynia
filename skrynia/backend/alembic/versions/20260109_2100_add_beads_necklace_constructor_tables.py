"""Add beads necklace constructor tables

Revision ID: add_beads_constructor
Revises: 5b6f84cbc5db
Create Date: 2026-01-09 21:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_beads_constructor'
down_revision = '5b6f84cbc5db'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create beads table
    op.create_table('beads',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('image_url', sa.String(), nullable=False),
    sa.Column('category', sa.Enum('STONE', 'HARDWARE', 'EXTRA', name='beadcategory'), nullable=False),
    sa.Column('subcategory', sa.String(), nullable=True),
    sa.Column('size_mm', sa.Integer(), nullable=False),
    sa.Column('material', sa.String(), nullable=True),
    sa.Column('price_netto', sa.Float(), nullable=False),
    sa.Column('price_brutto', sa.Float(), nullable=False),
    sa.Column('currency', sa.String(), nullable=True),
    sa.Column('supplier_link', sa.Text(), nullable=True),
    sa.Column('supplier_name', sa.String(), nullable=True),
    sa.Column('stock_quantity', sa.Integer(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_beads_id'), 'beads', ['id'], unique=False)
    op.create_index(op.f('ix_beads_name'), 'beads', ['name'], unique=False)
    op.create_index(op.f('ix_beads_category'), 'beads', ['category'], unique=False)
    op.create_index(op.f('ix_beads_subcategory'), 'beads', ['subcategory'], unique=False)

    # Create necklace_configurations table
    op.create_table('necklace_configurations',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('necklace_data', sa.JSON(), nullable=False),
    sa.Column('thumbnail_url', sa.String(), nullable=True),
    sa.Column('status', sa.Enum('DRAFT', 'SENT_FOR_QUOTE', name='necklacestatus'), nullable=True),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_necklace_configurations_id'), 'necklace_configurations', ['id'], unique=False)
    op.create_index(op.f('ix_necklace_configurations_user_id'), 'necklace_configurations', ['user_id'], unique=False)

    # Create quote_requests table
    op.create_table('quote_requests',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('necklace_configuration_id', sa.Integer(), nullable=True),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('customer_name', sa.String(), nullable=True),
    sa.Column('customer_phone', sa.String(), nullable=True),
    sa.Column('necklace_data', sa.JSON(), nullable=False),
    sa.Column('comment', sa.Text(), nullable=True),
    sa.Column('status', sa.Enum('PENDING', 'QUOTED', 'APPROVED', 'REJECTED', name='quotestatus'), nullable=True),
    sa.Column('is_read', sa.Boolean(), nullable=True),
    sa.Column('admin_notes', sa.Text(), nullable=True),
    sa.Column('admin_quote_price', sa.Float(), nullable=True),
    sa.Column('admin_quote_currency', sa.String(), nullable=True),
    sa.Column('calculated_netto', sa.Float(), nullable=True),
    sa.Column('calculated_brutto', sa.Float(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('quoted_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['necklace_configuration_id'], ['necklace_configurations.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_quote_requests_id'), 'quote_requests', ['id'], unique=False)
    op.create_index(op.f('ix_quote_requests_user_id'), 'quote_requests', ['user_id'], unique=False)
    op.create_index(op.f('ix_quote_requests_email'), 'quote_requests', ['email'], unique=False)


def downgrade() -> None:
    # Drop tables in reverse order
    op.drop_index(op.f('ix_quote_requests_email'), table_name='quote_requests')
    op.drop_index(op.f('ix_quote_requests_user_id'), table_name='quote_requests')
    op.drop_index(op.f('ix_quote_requests_id'), table_name='quote_requests')
    op.drop_table('quote_requests')

    op.drop_index(op.f('ix_necklace_configurations_user_id'), table_name='necklace_configurations')
    op.drop_index(op.f('ix_necklace_configurations_id'), table_name='necklace_configurations')
    op.drop_table('necklace_configurations')

    op.drop_index(op.f('ix_beads_subcategory'), table_name='beads')
    op.drop_index(op.f('ix_beads_category'), table_name='beads')
    op.drop_index(op.f('ix_beads_name'), table_name='beads')
    op.drop_index(op.f('ix_beads_id'), table_name='beads')
    op.drop_table('beads')

    # Drop ENUM types
    op.execute('DROP TYPE IF EXISTS quotestatus')
    op.execute('DROP TYPE IF EXISTS necklacestatus')
    op.execute('DROP TYPE IF EXISTS beadcategory')
