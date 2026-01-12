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
    
    # Multilingual titles
    title_uk = Column(String(255), nullable=False, index=True)  # Ukrainian (required)
    title_en = Column(String(255), nullable=True)  # English
    title_de = Column(String(255), nullable=True)  # German
    title_pl = Column(String(255), nullable=True)  # Polish
    title_se = Column(String(255), nullable=True)  # Swedish
    title_no = Column(String(255), nullable=True)  # Norwegian
    title_dk = Column(String(255), nullable=True)  # Danish
    title_fr = Column(String(255), nullable=True)  # French
    
    # Legacy field for backward compatibility
    title = Column(String(255), nullable=True)
    
    slug = Column(String(255), unique=True, nullable=False, index=True)
    
    # Multilingual excerpts
    excerpt_uk = Column(Text, nullable=True)  # Ukrainian
    excerpt_en = Column(Text, nullable=True)  # English
    excerpt_de = Column(Text, nullable=True)  # German
    excerpt_pl = Column(Text, nullable=True)  # Polish
    excerpt_se = Column(Text, nullable=True)  # Swedish
    excerpt_no = Column(Text, nullable=True)  # Norwegian
    excerpt_dk = Column(Text, nullable=True)  # Danish
    excerpt_fr = Column(Text, nullable=True)  # French
    
    # Legacy field for backward compatibility
    excerpt = Column(Text, nullable=True)  # Short summary for preview
    
    # Multilingual content (Markdown)
    content_uk = Column(Text, nullable=False)  # Ukrainian (required)
    content_en = Column(Text, nullable=True)  # English
    content_de = Column(Text, nullable=True)  # German
    content_pl = Column(Text, nullable=True)  # Polish
    content_se = Column(Text, nullable=True)  # Swedish
    content_no = Column(Text, nullable=True)  # Norwegian
    content_dk = Column(Text, nullable=True)  # Danish
    content_fr = Column(Text, nullable=True)  # French
    
    # Legacy field for backward compatibility
    content = Column(Text, nullable=True)  # Markdown content
    
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
