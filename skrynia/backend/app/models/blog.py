from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Table, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base


# Association table for blog-product relationships
blog_products = Table(
    'blog_products',
    Base.metadata,
    Column('blog_id', Integer, ForeignKey('blogs.id', ondelete='CASCADE')),
    Column('product_id', Integer, ForeignKey('products.id', ondelete='CASCADE'))
)


class Blog(Base):
    __tablename__ = "blogs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    excerpt = Column(Text, nullable=True)  # Short summary for preview
    content = Column(Text, nullable=False)  # Markdown content
    featured_image = Column(String(500), nullable=True)
    author = Column(String(100), nullable=True, default="Skrynia Team")

    # SEO fields
    meta_title = Column(String(255), nullable=True)
    meta_description = Column(String(500), nullable=True)
    og_image = Column(String(500), nullable=True)

    # Tags (comma-separated)
    tags = Column(String(500), nullable=True)

    # Publishing
    published = Column(Boolean, default=False, index=True)
    published_at = Column(DateTime, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    linked_products = relationship("Product", secondary=blog_products, backref="blogs")
