"""Pydantic schemas for API request/response validation."""

from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field

class ProductBase(BaseModel):
        product_name: str = Field(..., min_length=1, max_length=255)
        category: str | None = None
        brand_name: str | None = None
        status_received: bool = False
        status_reviewed: bool = False
        status_posted_tiktok: bool = False
        sponsorship_status: str | None = None
        rating: float | None = Field(default=None, ge=0, le=5)
        notes: str| None = None
        date_received: date | None = None
        review_deadline: date | None = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    product_name: str | None = Field(default=None, min_legth=1, max_length=255)
    category: str | None = None
    brand_name: str | None = None
    status_received: bool | None = None
    status_reviewed: bool | None = None
    status_posted_instagram: bool | None = None
    status_posted_tiktok: bool | None = None
    status_posted_youtube: bool | None = None
    sponsorship_status: str | None = None
    rating: float | None = Field(default=None, ge=0, le=5)
    notes: str | None = None
    date_received: date | None = None
    review_deadline: date | None = None

class ProductResponse(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


    