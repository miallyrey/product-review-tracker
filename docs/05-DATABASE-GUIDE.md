# Database Guide (PostgreSQL)

## Schema: `products` Table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PK | Auto-increment ID |
| product_name | VARCHAR(255) | Required name |
| category | VARCHAR(100) | e.g. keyboard, beauty |
| brand_name | VARCHAR(255) | Simple string (future: FK to brands) |
| status_received | BOOLEAN | Item arrived? |
| status_reviewed | BOOLEAN | Written/video review done? |
| status_posted_instagram | BOOLEAN | IG content live? |
| status_posted_tiktok | BOOLEAN | TikTok content live? |
| status_posted_youtube | BOOLEAN | YouTube content live? |
| sponsorship_status | VARCHAR(50) | gifted, sponsored, affiliate, purchased |
| rating | FLOAT | 0–5 stars |
| notes | TEXT | Free-form notes |
| date_received | DATE | When product arrived |
| review_deadline | DATE | Brand deadline |
| created_at | TIMESTAMP | Auto-set on insert |
| updated_at | TIMESTAMP | Auto-updated |

## Connection URL Format

SQLAlchemy uses the **psycopg v3** driver:

```
postgresql+psycopg://USER:PASSWORD@HOST:5432/DATABASE
```

The `+psycopg` part tells SQLAlchemy which Python driver to use.

## Connect with psql

```bash
docker exec -it prt-db psql -U prt_user -d product_review_tracker
```

```sql
SELECT id, product_name, status_received, status_reviewed FROM products;
\dt
\q
```

## How Tables Are Created

On backend startup, `Base.metadata.create_all(bind=engine)` creates missing tables.

**Production note:** Teams use **Alembic** for versioned migrations. For learning, auto-create is fine.

## Sample Data

```sql
INSERT INTO products (product_name, category, brand_name, status_received, status_reviewed)
VALUES ('Keychron K2', 'keyboard', 'Keychron', true, false);
```

## Future: Brands Table (One-to-Many)

```
brands (id, name, contact_email)
   └── products.brand_id → brands.id
```

**Skills taught:** Foreign keys, JOIN queries, SQLAlchemy relationships  
**Difficulty:** Medium  
See [13-FEATURE-DEVELOPMENT-GUIDE.md](./13-FEATURE-DEVELOPMENT-GUIDE.md)

## Backup (Docker Volume)

```bash
docker exec prt-db pg_dump -U prt_user product_review_tracker > backup.sql
```
