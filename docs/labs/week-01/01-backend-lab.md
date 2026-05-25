# Lab 01 — Backend (FastAPI + PostgreSQL)

**Goal:** Build the API yourself, file by file, with a test after each checkpoint.  
**Time:** ~3–5 hours · **Week:** 1

---

## Checkpoint 0 — Create folders

**RUN:**

```bash
cd product-review-tracker
mkdir -p backend/app/routers
```

**EXPECTED:** `ls backend/app` shows `routers/` (empty for now).

**MISTAKES:** Creating `app` inside wrong directory — always `backend/app/`.

---

## Checkpoint 1 — Dependencies

**FILE:** `backend/requirements.txt`  
**PURPOSE:** Lists Python packages pip will install.

**CODE:**

```text
fastapi==0.115.6
uvicorn[standard]==0.34.0
sqlalchemy==2.0.36
psycopg[binary]==3.2.3
pydantic==2.10.3
pydantic-settings==2.7.0
python-dotenv==1.0.1
prometheus-fastapi-instrumentator==7.0.0
```

**EXPLANATION:**

| Package | Why |
|---------|-----|
| fastapi | Web framework + auto API docs |
| uvicorn | ASGI server that runs FastAPI |
| sqlalchemy | Talks to PostgreSQL |
| psycopg | PostgreSQL driver (`+psycopg` in DB URL) |
| pydantic-settings | Reads `.env` safely |

**RUN:**

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

**EXPECTED:** `Successfully installed fastapi ...` with no errors.

**MISTAKES:** Using Python 3.14 without binary wheels — use 3.12+ or Docker later.

---

## Checkpoint 2 — Package marker

**FILE:** `backend/app/__init__.py`  
**PURPOSE:** Marks `app` as a Python package (can be empty).

**CODE:**

```python
# Product Review Tracker — backend package
```

**FILE:** `backend/app/routers/__init__.py`  
**PURPOSE:** Marks `routers` as a package.

**CODE:**

```python
# API routers
```

---

## Checkpoint 3 — Configuration

**FILE:** `backend/app/config.py`  
**PURPOSE:** Central place for environment variables (12-factor app pattern).

**CODE:**

```python
"""Application settings loaded from environment variables."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = (
        "postgresql+psycopg://prt_user:prt_password@localhost:5432/product_review_tracker"
    )
    cors_origins: str = "http://localhost:5173,http://localhost:3000"
    app_name: str = "Product Review Tracker API"
    debug: bool = False

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
```

**EXPLANATION:** `DATABASE_URL` in `.env` overrides the default. `cors_origin_list` splits comma-separated frontend URLs for CORS.

**RUN:**

```bash
cd backend && source .venv/bin/activate
python -c "from app.config import settings; print(settings.app_name)"
```

**EXPECTED:** `Product Review Tracker API`

---

## Checkpoint 4 — Database connection

**FILE:** `backend/app/database.py`  
**PURPOSE:** SQLAlchemy engine, session factory, and `get_db()` for FastAPI.

**CODE:**

```python
"""Database engine and session management."""

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings

engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    """Yield a database session per request; always close when done."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

**EXPLANATION:** `get_db()` is a **generator** — FastAPI calls it per request and always runs `finally: db.close()`.

**RUN:** (needs Postgres running — see Checkpoint 8 for Docker one-liner)

```bash
python -c "from app.database import engine; print(engine)"
```

**EXPECTED:** `Engine(postgresql+psycopg://...)` (no connection error if DB is up).

---

## Checkpoint 5 — Product model (database table)

**FILE:** `backend/app/models.py`  
**PURPOSE:** Defines the `products` table structure in Python.

**CODE:**

```python
"""SQLAlchemy ORM models."""

from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, Float, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Product(Base):
    __tablename__ = "products"

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
```

**EXPLANATION:** Each `Mapped[...]` column becomes a PostgreSQL column. Booleans track review workflow states.

**RUN:**

```bash
python -c "from app.models import Product; print(Product.__tablename__)"
```

**EXPECTED:** `products`

---

## Checkpoint 6 — API schemas (Pydantic)

**FILE:** `backend/app/schemas.py`  
**PURPOSE:** Validates JSON request/response bodies (separate from DB model).

**CODE:**

```python
"""Pydantic schemas for API request/response validation."""

from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class ProductBase(BaseModel):
    product_name: str = Field(..., min_length=1, max_length=255)
    category: str | None = None
    brand_name: str | None = None
    status_received: bool = False
    status_reviewed: bool = False
    status_posted_instagram: bool = False
    status_posted_tiktok: bool = False
    status_posted_youtube: bool = False
    sponsorship_status: str | None = None
    rating: float | None = Field(default=None, ge=0, le=5)
    notes: str | None = None
    date_received: date | None = None
    review_deadline: date | None = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    product_name: str | None = Field(default=None, min_length=1, max_length=255)
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
```

**EXPLANATION:** `ProductUpdate` has all optional fields for partial PUT. `from_attributes=True` lets Pydantic read SQLAlchemy objects.

---

## Checkpoint 7 — CRUD router

**FILE:** `backend/app/routers/products.py`  
**PURPOSE:** HTTP endpoints for list/create/read/update/delete.

**CODE:**

```python
"""CRUD endpoints for products."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Product
from app.schemas import ProductCreate, ProductResponse, ProductUpdate

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[ProductResponse])
def list_products(db: Session = Depends(get_db)):
    return db.query(Product).order_by(Product.created_at.desc()).all()


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, payload: ProductUpdate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    db.delete(product)
    db.commit()
    return None
```

**EXPLANATION:** `Depends(get_db)` injects the DB session. `exclude_unset=True` only updates fields the client sent.

---

## Checkpoint 8 — Application entrypoint

**FILE:** `backend/app/main.py`  
**PURPOSE:** Creates FastAPI app, CORS, routes, health check, metrics.

**CODE:**

```python
"""FastAPI application entrypoint."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

from app.config import settings
from app.database import Base, engine
from app.routers import products


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, prefix="/api")

Instrumentator().instrument(app).expose(app, endpoint="/metrics")


@app.get("/health")
def health_check():
    return {"status": "ok", "service": settings.app_name}
```

**EXPLANATION:** `lifespan` runs `create_all` on startup — creates `products` table if missing (learning only; production uses migrations).

---

## Checkpoint 9 — Environment file (project root)

**FILE:** `.env.example` (project root — copy to `.env` when running)

**PURPOSE:** Documents required environment variables.

**CODE:**

```bash
POSTGRES_USER=prt_user
POSTGRES_PASSWORD=prt_password
POSTGRES_DB=product_review_tracker

DATABASE_URL=postgresql+psycopg://prt_user:prt_password@localhost:5432/product_review_tracker
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
DEBUG=false
```

**RUN:**

```bash
cp .env.example .env
```

---

## Checkpoint 10 — Start PostgreSQL (temporary container)

**RUN:**

```bash
docker run -d --name prt-postgres \
  -e POSTGRES_USER=prt_user \
  -e POSTGRES_PASSWORD=prt_password \
  -e POSTGRES_DB=product_review_tracker \
  -p 5432:5432 \
  postgres:16-alpine
```

**EXPECTED:** Container running: `docker ps` shows `prt-postgres`.

---

## Checkpoint 11 — Run API and test

**RUN:**

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

**EXPECTED:**

```
Uvicorn running on http://127.0.0.1:8000
```

**TEST in another terminal:**

```bash
curl http://localhost:8000/health
curl -X POST http://localhost:8000/api/products \
  -H "Content-Type: application/json" \
  -d '{"product_name":"Keychron K2","category":"keyboard","status_received":true}'
curl http://localhost:8000/api/products
```

**EXPECTED:**

- Health: `{"status":"ok","service":"Product Review Tracker API"}`
- Create: JSON with `"id":1`
- List: array with your product

**Browser:** http://localhost:8000/docs — try endpoints interactively.

---

## Debugging This Lab

| Problem | Check |
|---------|-------|
| `ModuleNotFoundError: app` | Run uvicorn from `backend/` directory |
| DB connection refused | Is `prt-postgres` container running? |
| 422 on POST | `product_name` required; rating must be 0–5 |
| CORS later | Frontend lab — add origin to `CORS_ORIGINS` |

Full guide: [14-TROUBLESHOOTING-GUIDE.md](../../14-TROUBLESHOOTING-GUIDE.md)

---

## Lab Complete ✓

You should have:

```
backend/
├── requirements.txt
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── routers/
│       ├── __init__.py
│       └── products.py
```

**Next:** [02-frontend-lab.md](./02-frontend-lab.md)

**Stuck?** Compare one file at a time with `reference/backend/`.
