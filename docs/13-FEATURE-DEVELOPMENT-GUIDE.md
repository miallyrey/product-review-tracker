# Feature Development Guide (Optional Challenges)

Use these after each milestone to deepen skills. Each includes **why**, **skills**, **difficulty**, and **starting hint**.

---

## Easy

### Filter by review status

| | |
|-|-|
| **Why** | Every real app needs list filtering |
| **Skills** | React state, query params or client-side filter |
| **Difficulty** | ⭐ Easy |
| **Start** | Add `<select>` in `App.jsx`, filter `products` array |

### Search by product name

| | |
|-|-|
| **Why** | UX for growing lists |
| **Skills** | String matching, debounced input |
| **Difficulty** | ⭐ Easy |
| **Start** | `products.filter(p => p.product_name.includes(query))` |

---

## Medium

### Separate Brands table (One-to-Many)

| | |
|-|-|
| **Why** | Normalized databases avoid duplicate brand strings |
| **Skills** | SQLAlchemy relationships, JOINs, FK migrations |
| **Difficulty** | ⭐⭐ Medium |
| **Start** | New `Brand` model, `brand_id` on `Product`, Alembic migration |

### Pagination

| | |
|-|-|
| **Why** | APIs can't return 10,000 rows at once |
| **Skills** | `limit`/`offset` SQL, FastAPI query params |
| **Difficulty** | ⭐⭐ Medium |
| **Start** | `GET /api/products?skip=0&limit=20` |

### Authentication (JWT)

| | |
|-|-|
| **Why** | Multi-user apps need identity |
| **Skills** | OAuth2, JWT, protected routes, httpOnly cookies |
| **Difficulty** | ⭐⭐ Medium |
| **Start** | `fastapi-users` or manual JWT with `python-jose` |

### Image uploads

| | |
|-|-|
| **Why** | Product photos for content planning |
| **Skills** | S3, presigned URLs, multipart forms |
| **Difficulty** | ⭐⭐ Medium |
| **Start** | AWS S3 bucket + `boto3` upload endpoint |

---

## Hard

### API versioning (`/api/v1`)

| | |
|-|-|
| **Why** | Breaking changes without breaking mobile apps |
| **Skills** | Router prefixes, deprecation policy |
| **Difficulty** | ⭐⭐⭐ Hard |

### Redis caching

| | |
|-|-|
| **Why** | Reduce database load on hot reads |
| **Skills** | Cache invalidation, TTL, Redis Docker service |
| **Difficulty** | ⭐⭐⭐ Hard |

### Async tasks (Celery)

| | |
|-|-|
| **Why** | Email reminders for review deadlines |
| **Skills** | Message queues, workers, RabbitMQ/Redis |
| **Difficulty** | ⭐⭐⭐ Hard |

### Audit logs

| | |
|-|-|
| **Why** | Compliance — who changed what when |
| **Skills** | DB triggers or middleware, immutable log table |
| **Difficulty** | ⭐⭐⭐ Hard |

---

## DevOps Extensions

| Feature | Skills | Difficulty |
|---------|--------|------------|
| HTTPS with Certbot | TLS, nginx | Medium |
| Staging environment | Terraform workspaces | Medium |
| Helm chart | K8s packaging | Hard |
| ArgoCD GitOps | Continuous deploy to K8s | Hard |

---

## How to Approach Any Feature

1. Read related doc chapter
2. Design DB/API changes first
3. Implement backend endpoint
4. Wire frontend
5. Test manually + document in README
6. Commit with clear message
