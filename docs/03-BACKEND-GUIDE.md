# Backend Guide (FastAPI) — Concepts

> **Build the code:** [labs/week-01/01-backend-lab.md](./labs/week-01/01-backend-lab.md) has every file with full contents and test commands.

This guide explains **why** — use it while building, not instead of the lab.

## Architecture Role

```
HTTP Request → FastAPI router → Pydantic schema → SQLAlchemy → PostgreSQL
```

## File Map (you create these)

| File | Role |
|------|------|
| `app/main.py` | App entry, CORS, lifespan, metrics |
| `app/config.py` | Environment settings |
| `app/database.py` | Engine + `get_db()` |
| `app/models.py` | `products` table |
| `app/schemas.py` | JSON validation |
| `app/routers/products.py` | CRUD routes |

## `get_db()` Pattern

Industry standard for request-scoped DB sessions — always closes connection in `finally`.

## Create vs Update Schemas

- `ProductCreate` — new row
- `ProductUpdate` — partial update (`exclude_unset=True`)

## Metrics

`/metrics` endpoint (Week 6) — Prometheus scrapes request counts and latency.

## Professional Next Steps

- Alembic migrations (replace `create_all` on startup)
- pytest + `TestClient`
- Structured logging

Optional features: [13-FEATURE-DEVELOPMENT-GUIDE.md](./13-FEATURE-DEVELOPMENT-GUIDE.md)
