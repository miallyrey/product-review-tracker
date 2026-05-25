# Troubleshooting Guide

## How Engineers Debug

1. **Reproduce** — same steps every time?
2. **Isolate** — frontend, API, DB, or network?
3. **Read logs** — exact error message
4. **Change one thing** — don't fix five things at once
5. **Document** — add to this guide when you solve something new

---

## FastAPI / Backend

| Error | Cause | Fix |
|-------|-------|-----|
| `ModuleNotFoundError: app` | Wrong working directory | Run from `backend/` or set `WORKDIR` |
| `connection refused` to DB | Postgres not running | Start db container first |
| `relation "products" does not exist` | Tables not created | Restart backend (lifespan runs `create_all`) |
| CORS error in browser | Origin not allowed | Add URL to `CORS_ORIGINS` in `.env` |
| 422 Unprocessable Entity | Invalid JSON body | Check required `product_name`, rating 0–5 |

**View logs:**

```bash
docker compose logs -f backend
```

**Test API directly:**

```bash
curl http://localhost:8000/health
```

---

## React / Frontend

| Error | Cause | Fix |
|-------|-------|-----|
| `Failed to fetch` | Backend down or wrong URL | Check API running, Vite proxy |
| Blank page | JS build error | Check terminal running `npm run dev` |
| Stale data after edit | Forgot reload | `loadProducts()` after mutation |

**Browser DevTools:** Network tab → see failed requests, status codes

---

## Docker

| Error | Cause | Fix |
|-------|-------|-----|
| `port is already allocated` | Another process uses port | `lsof -i :5432` and stop conflict |
| Build cache stale | Old Dockerfile layer | `docker compose build --no-cache` |
| `Cannot connect to backend` | Service name wrong | Use `backend` not `localhost` inside compose |
| Volume full | Disk space | `docker system prune` (careful!) |

```bash
docker compose ps          # container status
docker inspect prt-db      # detailed config
```

---

## PostgreSQL

```bash
docker exec -it prt-db psql -U prt_user -d product_review_tracker
```

| Error | Fix |
|-------|-----|
| Auth failed | Match `POSTGRES_USER/PASSWORD` in `.env` and `DATABASE_URL` |
| DB empty after restart | Used `docker compose down -v` (deleted volume) |

---

## GitHub Actions / CI/CD

| Failure | Fix |
|---------|-----|
| SSH handshake failed | Key secret format, security group port 22 |
| Docker login failed | Check `GITHUB_TOKEN` permissions (packages: write) |
| `docker compose pull` 404 | Image name must match GHCR path |
| Deploy ok but old UI | Hard refresh browser, check image tag |

---

## AWS / EC2

| Issue | Fix |
|-------|-----|
| Can't SSH | Security group, correct IP in `ssh_cidr`, key permissions `chmod 400` |
| Site unreachable | Open port 80, check `docker compose ps` on server |
| Permission denied Docker | `sudo usermod -aG docker ubuntu` then re-login |

```bash
# On EC2
sudo journalctl -u docker
docker compose logs
```

---

## Terraform

| Error | Fix |
|-------|-----|
| `InvalidKeyPair.NotFound` | Create key pair in AWS Console first |
| `UnauthorizedOperation` | IAM user needs EC2 permissions |
| State drift | `terraform refresh` or import resources |

---

## Networking Mental Model

```
Your laptop → localhost:3000 → Docker frontend
                              → proxy /api → backend:8000
                                            → db:5432
```

**Rule:** Inside Docker network, use **service names**. On your laptop, use **localhost + published ports**.

---

## When You're Stuck

1. Copy exact error into search
2. Check `docs/` chapter for that layer
3. Ask in GitHub Discussions / Stack Overflow with minimal repro
4. Compare your file to repo `main` branch
