# Local Development Guide

> **Implementation:** Follow the [lab manuals](./labs/README.md). This guide covers **prerequisites and tools only** — not copy-paste code.

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Python | 3.12+ recommended | `python3 --version` |
| Node.js | 20+ | `node --version` |
| Docker | Latest | `docker --version` |
| Git | Latest | `git --version` |

Optional for Week 3+: AWS CLI, Terraform, Ansible.

## Learning Path (Do This Order)

1. [16-HANDS-ON-LEARNING-GUIDE.md](./16-HANDS-ON-LEARNING-GUIDE.md)
2. [Lab 01 — Backend](./labs/week-01/01-backend-lab.md)
3. [Lab 02 — Frontend](./labs/week-01/02-frontend-lab.md)
4. [Lab 03 — Docker](./labs/week-02/03-docker-lab.md)

## After Labs — How You Will Run the App

**Docker (Week 2+):**

```bash
cp .env.example .env
docker compose up --build
```

| Service | URL |
|---------|-----|
| UI | http://localhost:3000 |
| API docs | http://localhost:8000/docs |

**Local dev (Week 1):** Labs use `uvicorn` + `npm run dev` — see backend/frontend labs for exact commands.

## Vite: Files You Will Touch vs Ignore

| Path | Action |
|------|--------|
| `src/App.jsx`, `src/api.js`, `components/` | You write these (lab) |
| `vite.config.js` | You edit proxy section (lab) |
| `node_modules/` | Generated — never edit |
| `dist/` | Build output — gitignore |

## Python: Virtual Environment

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

**MISTAKE:** Running uvicorn from repo root → `ModuleNotFoundError: app`. Always run from `backend/`.

## Stuck?

[14-TROUBLESHOOTING-GUIDE.md](./14-TROUBLESHOOTING-GUIDE.md) → then one file in `reference/`.
