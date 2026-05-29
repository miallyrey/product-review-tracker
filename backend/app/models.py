"""SQLAlchemy ORM models."""

from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, Float, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base

class Product(Base):
    __tablename__="products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    product_name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str | None] = mapped_column(String(100), nullable=True)
    brand_name: Mapped[str | None] = mapped_column(String(255), nullable=True)

    status_received: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    status_reviewed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    status_posted_instagram: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    status_posted_tiktok: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    status_posted_youtube: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    sponsorship_status: Mapped[str | None] = mapped_column(String(50), nullable=True)

    rating: Mapped[float | None] = mapped_column(Float, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    date_received: Mapped[date | None] = mapped_column(Date, nullable=True)
    review_deadline: Mapped[date | None] = mapped_column(Date, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
            DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
            DateTime(timezone=True),
            server_default=func.now(),
            onupdate=func.now(),
            nullable=False,
    )

