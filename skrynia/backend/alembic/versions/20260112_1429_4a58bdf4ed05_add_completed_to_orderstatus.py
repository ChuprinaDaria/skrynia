"""add_completed_to_orderstatus

Revision ID: 4a58bdf4ed05
Revises: add_category_is_featured
Create Date: 2026-01-12 14:29:18.818572

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4a58bdf4ed05'
down_revision = 'add_category_is_featured'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Додаємо нове значення 'COMPLETED' до enum типу orderstatus
    op.execute("ALTER TYPE orderstatus ADD VALUE IF NOT EXISTS 'COMPLETED'")


def downgrade() -> None:
    # Примітка: PostgreSQL не підтримує видалення значень з enum типу напряму
    # Потрібно було б створити новий enum, перенести дані, видалити старий і перейменувати новий
    # Для простоти залишаємо це значення в enum, але воно не буде використовуватися в коді
    pass
