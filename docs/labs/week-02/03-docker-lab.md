# Lab 03 — Docker + Docker Compose

**Prerequisites:** Week 1 labs complete (`backend/`, `frontend/` exist).  
**Goal:** Containerize each service and run the full stack with Compose — **you write every Dockerfile and compose line**.

---

## Checkpoint 1 — Backend Dockerfile

**FILE:** `backend/Dockerfile`

```dockerfile
FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**EXPLANATION:**

| Line | Meaning |
|------|---------|
| `FROM python:3.12-slim` | Base image with Python |
| `WORKDIR /app` | Commands run inside `/app` |
| `COPY` + `RUN pip` | Install deps before app code (layer caching) |
| `CMD uvicorn` | Process that runs when container starts |

**RUN:**

```bash
cd backend
docker build -t prt-backend .
```

**EXPECTED:** `Successfully tagged prt-backend:latest`

**TEST:**

```bash
docker run --rm -p 8000:8000 \
  -e DATABASE_URL=postgresql+psycopg://prt_user:prt_password@host.docker.internal:5432/product_review_tracker \
  prt-backend
```

(Mac/Windows: `host.docker.internal` reaches Postgres on your laptop.)

---

## Checkpoint 2 — Frontend Dockerfile + nginx

**FILE:** `frontend/nginx.conf`

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /health {
        proxy_pass http://backend:8000/health;
    }
}
```

**FILE:** `frontend/Dockerfile`

```dockerfile
FROM node:20-alpine AS build

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
ARG VITE_API_URL=
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**EXPLANATION:** Multi-stage build — stage 1 compiles React; stage 2 serves static files with nginx (smaller final image).

**RUN:**

```bash
cd frontend
docker build -t prt-frontend .
```

---

## Checkpoint 3 — Root `.env.example`

**FILE:** `.env.example` (project root)

```bash
POSTGRES_USER=prt_user
POSTGRES_PASSWORD=prt_password
POSTGRES_DB=product_review_tracker

DATABASE_URL=postgresql+psycopg://prt_user:prt_password@localhost:5432/product_review_tracker
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost
DEBUG=false
```

**RUN:** `cp .env.example .env`

---

## Checkpoint 4 — docker-compose.yml

**FILE:** `docker-compose.yml` (project root)

```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: prt-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-prt_user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-prt_password}
      POSTGRES_DB: ${POSTGRES_DB:-product_review_tracker}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-prt_user} -d ${POSTGRES_DB:-product_review_tracker}"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    container_name: prt-backend
    restart: unless-stopped
    environment:
      DATABASE_URL: postgresql+psycopg://${POSTGRES_USER:-prt_user}:${POSTGRES_PASSWORD:-prt_password}@db:5432/${POSTGRES_DB:-product_review_tracker}
      CORS_ORIGINS: ${CORS_ORIGINS:-http://localhost:5173,http://localhost:3000,http://localhost}
    ports:
      - "8000:8000"
    depends_on:
      db:
        condition: service_healthy

  frontend:
    build:
      context: ./frontend
      args:
        VITE_API_URL: ""
    container_name: prt-frontend
    restart: unless-stopped
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

**EXPLANATION:** Service name `db` is the hostname backend uses (`@db:5432`). `depends_on` + `healthcheck` prevents API starting before Postgres is ready.

**RUN:**

```bash
docker compose up --build
```

**EXPECTED:**

| URL | Result |
|-----|--------|
| http://localhost:3000 | React UI |
| http://localhost:8000/docs | Swagger |
| http://localhost:8000/health | `{"status":"ok",...}` |

**TEST persistence:** Add a product → `docker compose down` → `docker compose up -d` → product still there.

**MISTAKES:**

| Error | Fix |
|-------|-----|
| `connection refused` to db | Wait for healthcheck; check `DATABASE_URL` uses `db` not `localhost` inside backend container |
| Frontend can't reach API | nginx proxies `/api` — use port 3000, not 5173 |

**Next:** [Week 3 — AWS + Terraform](../week-03/04-aws-terraform-lab.md)  
**Concept:** [06-DOCKER-GUIDE.md](../../06-DOCKER-GUIDE.md)
