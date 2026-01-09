from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base


class BlogPost(Base):
    """Blog articles"""
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    content = Column(Text, nullable=False)
    excerpt = Column(Text, nullable=True)

    # Media
    featured_image = Column(String, nullable=True)
    video_url = Column(String, nullable=True)

    # Author
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Status
    is_published = Column(Boolean, default=False)
    published_at = Column(DateTime(timezone=True), nullable=True)

    # SEO
    meta_title = Column(String(255), nullable=True)
    meta_description = Column(Text, nullable=True)

    # Stats
    views_count = Column(Integer, default=0)
    average_rating = Column(Float, default=0.0)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    author = relationship("User")
    comments = relationship("BlogComment", back_populates="post", cascade="all, delete-orphan")
    ratings = relationship("BlogRating", back_populates="post", cascade="all, delete-orphan")


class BlogComment(Base):
    """Comments on blog posts"""
    __tablename__ = "blog_comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("blog_posts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    content = Column(Text, nullable=False)

    # Moderation
    is_approved = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    post = relationship("BlogPost", back_populates="comments")
    user = relationship("User", back_populates="blog_comments", foreign_keys=[user_id])


class BlogRating(Base):
    """Ratings on blog posts"""
    __tablename__ = "blog_ratings"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("blog_posts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    rating = Column(Integer, nullable=False)  # 1-5 stars

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    post = relationship("BlogPost", back_populates="ratings")
    user = relationship("User", back_populates="blog_ratings", foreign_keys=[user_id])
