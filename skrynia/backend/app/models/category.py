from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name_uk = Column(String, nullable=False)
    name_en = Column(String, nullable=True)
    name_de = Column(String, nullable=True)
    name_pl = Column(String, nullable=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    description_uk = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)
    icon = Column(String, nullable=True)  # Icon name or SVG path
    culture_type = Column(String, nullable=False)  # slavic, viking, celtic (or custom)
    is_featured = Column(Boolean, default=False)  # Featured collections (main: slavic, viking, celtic)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    products = relationship("Product", back_populates="category")
