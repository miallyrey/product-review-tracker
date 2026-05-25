# Docker Guide — Concepts

> **Build the files:** [labs/week-02/03-docker-lab.md](./labs/week-02/03-docker-lab.md) — full Dockerfiles and `docker-compose.yml`.

## Why Companies Use Docker

- **Same environment everywhere** — dev laptop = CI server = production
- **Isolation** — app dependencies don't conflict with host OS
- **Portable deploys** — ship an image, not "install Python 3.12 and these 40 packages"

## Files Explained

| File | Purpose |
|------|---------|
| `backend/Dockerfile` | Python image, installs deps, runs uvicorn |
| `frontend/Dockerfile` | Multi-stage: Node builds, nginx serves static files |
| `frontend/nginx.conf` | Proxies `/api` to backend container |
| `docker-compose.yml` | Orchestrates db + backend + frontend |

## Commands

```bash
# Build and start all services
docker compose up --build

# Run in background
docker compose up -d

# View logs
docker compose logs -f backend

# Stop and remove containers (keeps DB volume)
docker compose down

# Stop and DELETE database data
docker compose down -v
```

## Service Networking

Inside Compose, services talk by **service name**:

- Backend uses host `db` (not `localhost`)
- Frontend nginx proxies to host `backend`

```
browser → localhost:3000 → frontend container
                              → backend:8000 → db:5432
```

## Monitoring Profile

```bash
docker compose --profile monitoring up -d
```

Starts Prometheus (9090) and Grafana (3001).

## Beginner Mistakes

| Mistake | Why it's wrong |
|---------|----------------|
| Using `localhost` inside a container | `localhost` = that container only |
| Forgetting `--build` after code change | Old image still runs |
| Committing `.env` with real passwords | Secrets leak in git history |
| Running as root in production | Use non-root user (advanced hardening) |

## Expected Output

```
✔ Container prt-db       Healthy
✔ Container prt-backend   Started
✔ Container prt-frontend  Started
```

Open http://localhost:3000
