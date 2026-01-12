"""add_multilingual_fields_to_blog

Revision ID: add_multilingual_blog
Revises: 4a58bdf4ed05
Create Date: 2026-01-13 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_multilingual_blog'
down_revision = '4a58bdf4ed05'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add multilingual title fields
    op.add_column('blogs', sa.Column('title_uk', sa.String(length=255), nullable=True))
    op.add_column('blogs', sa.Column('title_en', sa.String(length=255), nullable=True))
    op.add_column('blogs', sa.Column('title_de', sa.String(length=255), nullable=True))
    op.add_column('blogs', sa.Column('title_pl', sa.String(length=255), nullable=True))
    op.add_column('blogs', sa.Column('title_se', sa.String(length=255), nullable=True))
    op.add_column('blogs', sa.Column('title_no', sa.String(length=255), nullable=True))
    op.add_column('blogs', sa.Column('title_dk', sa.String(length=255), nullable=True))
    op.add_column('blogs', sa.Column('title_fr', sa.String(length=255), nullable=True))
    
    # Add multilingual excerpt fields
    op.add_column('blogs', sa.Column('excerpt_uk', sa.Text(), nullable=True))
    op.add_column('blogs', sa.Column('excerpt_en', sa.Text(), nullable=True))
    op.add_column('blogs', sa.Column('excerpt_de', sa.Text(), nullable=True))
    op.add_column('blogs', sa.Column('excerpt_pl', sa.Text(), nullable=True))
    op.add_column('blogs', sa.Column('excerpt_se', sa.Text(), nullable=True))
    op.add_column('blogs', sa.Column('excerpt_no', sa.Text(), nullable=True))
    op.add_column('blogs', sa.Column('excerpt_dk', sa.Text(), nullable=True))
    op.add_column('blogs', sa.Column('excerpt_fr', sa.Text(), nullable=True))
    
    # Add multilingual content fields
    op.add_column('blogs', sa.Column('content_uk', sa.Text(), nullable=True))
    op.add_column('blogs', sa.Column('content_en', sa.Text(), nullable=True))
    op.add_column('blogs', sa.Column('content_de', sa.Text(), nullable=True))
    op.add_column('blogs', sa.Column('content_pl', sa.Text(), nullable=True))
    op.add_column('blogs', sa.Column('content_se', sa.Text(), nullable=True))
    op.add_column('blogs', sa.Column('content_no', sa.Text(), nullable=True))
    op.add_column('blogs', sa.Column('content_dk', sa.Text(), nullable=True))
    op.add_column('blogs', sa.Column('content_fr', sa.Text(), nullable=True))
    
    # Migrate existing data: copy title, excerpt, content to title_uk, excerpt_uk, content_uk
    op.execute("""
        UPDATE blogs 
        SET title_uk = title,
            excerpt_uk = excerpt,
            content_uk = content
        WHERE title_uk IS NULL
    """)
    
    # Make title_uk and content_uk NOT NULL after migration
    # First ensure all rows have values
    op.execute("""
        UPDATE blogs 
        SET title_uk = COALESCE(title_uk, title, 'Untitled'),
            content_uk = COALESCE(content_uk, content, '')
        WHERE title_uk IS NULL OR content_uk IS NULL
    """)
    
    op.alter_column('blogs', 'title_uk', nullable=False, existing_type=sa.String(length=255))
    op.alter_column('blogs', 'content_uk', nullable=False, existing_type=sa.Text())
    
    # Add index on title_uk
    op.create_index('ix_blogs_title_uk', 'blogs', ['title_uk'], unique=False)


def downgrade() -> None:
    # Remove indexes
    op.drop_index('ix_blogs_title_uk', table_name='blogs')
    
    # Remove multilingual fields
    op.drop_column('blogs', 'content_fr')
    op.drop_column('blogs', 'content_dk')
    op.drop_column('blogs', 'content_no')
    op.drop_column('blogs', 'content_se')
    op.drop_column('blogs', 'content_pl')
    op.drop_column('blogs', 'content_de')
    op.drop_column('blogs', 'content_en')
    op.drop_column('blogs', 'content_uk')
    
    op.drop_column('blogs', 'excerpt_fr')
    op.drop_column('blogs', 'excerpt_dk')
    op.drop_column('blogs', 'excerpt_no')
    op.drop_column('blogs', 'excerpt_se')
    op.drop_column('blogs', 'excerpt_pl')
    op.drop_column('blogs', 'excerpt_de')
    op.drop_column('blogs', 'excerpt_en')
    op.drop_column('blogs', 'excerpt_uk')
    
    op.drop_column('blogs', 'title_fr')
    op.drop_column('blogs', 'title_dk')
    op.drop_column('blogs', 'title_no')
    op.drop_column('blogs', 'title_se')
    op.drop_column('blogs', 'title_pl')
    op.drop_column('blogs', 'title_de')
    op.drop_column('blogs', 'title_en')
    op.drop_column('blogs', 'title_uk')

