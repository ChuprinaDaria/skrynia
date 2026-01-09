"""merge heads

Revision ID: merge_heads_20260109
Revises: add_2fa_fields, 9195f4b4f9a6
Create Date: 2026-01-09 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'merge_heads_20260109'
down_revision = ('add_2fa_fields', '9195f4b4f9a6')
branch_labels = None
depends_on = None


def upgrade() -> None:
    # This is a merge migration - no schema changes needed
    pass


def downgrade() -> None:
    # This is a merge migration - no schema changes needed
    pass

