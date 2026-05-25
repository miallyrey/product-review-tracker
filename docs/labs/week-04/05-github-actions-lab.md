# Lab 05 — GitHub Actions CI/CD

**Prerequisites:** App on EC2, code in GitHub.  
**Goal:** Manually create the workflow YAML — understand every step.

---

## Checkpoint 1 — Create workflow folder

```bash
mkdir -p .github/workflows
```

**What GitHub expects:** YAML files under `.github/workflows/` trigger on events (`push`, etc.).

---

## Checkpoint 2 — deploy.yml (full file)

**FILE:** `.github/workflows/deploy.yml`

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  REGISTRY: ghcr.io
  IMAGE_BACKEND: ${{ github.repository }}/backend
  IMAGE_FRONTEND: ${{ github.repository }}/frontend

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push backend image
        uses: docker/build-push-action@v6
        with:
          context: ./backend
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_BACKEND }}:latest
            ${{ env.REGISTRY }}/${{ env.IMAGE_BACKEND }}:${{ github.sha }}

      - name: Build and push frontend image
        uses: docker/build-push-action@v6
        with:
          context: ./frontend
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_FRONTEND }}:latest
            ${{ env.REGISTRY }}/${{ env.IMAGE_FRONTEND }}:${{ github.sha }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to EC2 via SSH
        uses: appleboy/ssh-action@v1.2.0
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd ~/product-review-tracker
            git pull origin main
            echo "${{ secrets.GITHUB_TOKEN }}" | docker login ghcr.io -u ${{ github.actor }} --password-stdin
            docker compose pull
            docker compose up -d --remove-orphans
            docker image prune -f
```

**EXPLANATION:**

| Section | Purpose |
|---------|---------|
| `on: push: branches: [main]` | Triggers pipeline |
| `build-and-push` | Builds Docker images in CI, pushes to GHCR |
| `deploy` | SSH to EC2, pull images, restart compose |
| `secrets.*` | Never hardcode keys in YAML |

---

## Checkpoint 3 — GitHub Secrets

Repo → **Settings → Secrets and variables → Actions → New repository secret**

| Name | Value |
|------|-------|
| `EC2_HOST` | EC2 public IP |
| `EC2_USER` | `ubuntu` |
| `EC2_SSH_KEY` | Full contents of `.pem` file |

---

## Checkpoint 4 — Test pipeline

```bash
git add .github/workflows/deploy.yml
git commit -m "Add CI/CD workflow"
git push origin main
```

**EXPECTED:** Actions tab shows green checkmarks for both jobs.

**MISTAKES:**

| Failure | Fix |
|---------|-----|
| Permission denied (SSH) | Key format, security group port 22 |
| 403 GHCR | Enable packages write on `GITHUB_TOKEN` (workflow has `packages: write`) |
| compose pull 404 | Image path must match `ghcr.io/OWNER/REPO/backend` |

**Next:** [Week 5 — Ansible](../week-05/06-ansible-lab.md)
