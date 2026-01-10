"""add blog tables

Revision ID: add_blog_tables
Revises: 20260109_1809_5b6f84cbc5db
Create Date: 2026-01-10

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_blog_tables'
down_revision = '20260109_1809_5b6f84cbc5db'
branch_labels = None
depends_on = None


def upgrade():
    # Create blogs table
    op.create_table(
        'blogs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('slug', sa.String(length=255), nullable=False),
        sa.Column('excerpt', sa.Text(), nullable=True),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('featured_image', sa.String(length=500), nullable=True),
        sa.Column('author', sa.String(length=100), nullable=True),
        sa.Column('meta_title', sa.String(length=255), nullable=True),
        sa.Column('meta_description', sa.String(length=500), nullable=True),
        sa.Column('og_image', sa.String(length=500), nullable=True),
        sa.Column('tags', sa.String(length=500), nullable=True),
        sa.Column('published', sa.Boolean(), nullable=True),
        sa.Column('published_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_blogs_id'), 'blogs', ['id'], unique=False)
    op.create_index(op.f('ix_blogs_slug'), 'blogs', ['slug'], unique=True)
    op.create_index(op.f('ix_blogs_title'), 'blogs', ['title'], unique=False)
    op.create_index(op.f('ix_blogs_published'), 'blogs', ['published'], unique=False)

    # Create blog_products association table
    op.create_table(
        'blog_products',
        sa.Column('blog_id', sa.Integer(), nullable=True),
        sa.Column('product_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['blog_id'], ['blogs.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ondelete='CASCADE')
    )


def downgrade():
    op.drop_table('blog_products')
    op.drop_index(op.f('ix_blogs_published'), table_name='blogs')
    op.drop_index(op.f('ix_blogs_title'), table_name='blogs')
    op.drop_index(op.f('ix_blogs_slug'), table_name='blogs')
    op.drop_index(op.f('ix_blogs_id'), table_name='blogs')
    op.drop_table('blogs')
