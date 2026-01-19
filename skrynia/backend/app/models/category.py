from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.types import Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    
    # Multilingual names
    name_uk = Column(String, nullable=False)
    name_en = Column(String, nullable=True)
    name_de = Column(String, nullable=True)
    name_pl = Column(String, nullable=True)
    name_se = Column(String, nullable=True)  # Swedish
    name_no = Column(String, nullable=True)  # Norwegian
    name_dk = Column(String, nullable=True)  # Danish
    name_fr = Column(String, nullable=True)  # French
    
    slug = Column(String, unique=True, index=True, nullable=False)
    
    # Multilingual descriptions
    description_uk = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)
    description_de = Column(Text, nullable=True)
    description_pl = Column(Text, nullable=True)
    description_se = Column(Text, nullable=True)  # Swedish
    description_no = Column(Text, nullable=True)  # Norwegian
    description_dk = Column(Text, nullable=True)  # Danish
    description_fr = Column(Text, nullable=True)  # French
    
    icon = Column(String, nullable=True)  # Icon name or SVG path
    culture_type = Column(String, nullable=False)  # slavic, viking, celtic (or custom)
    is_featured = Column(Boolean, default=False)  # Featured collections (main: slavic, viking, celtic)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    products = relationship("Product", back_populates="category")
