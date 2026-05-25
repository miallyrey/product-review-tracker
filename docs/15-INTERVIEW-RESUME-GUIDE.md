# Interview & Resume Guide

## Elevator Pitch (30 seconds)

> "I built Product Review Tracker — a full-stack app for tracking brand review products. It uses FastAPI and React with PostgreSQL, containerized with Docker, deployed to AWS EC2 with Terraform and Ansible, and a GitHub Actions CI/CD pipeline. I also added Prometheus metrics and Grafana dashboards."

## Resume Bullets (Copy and Customize)

**Full-stack:**
- Developed a full-stack CRUD application (FastAPI, React, PostgreSQL) to track product reviews, social post status, and deadlines for content creators

**DevOps:**
- Containerized multi-service application with Docker and Docker Compose including health checks and persistent volumes
- Provisioned AWS infrastructure using Terraform (EC2, security groups) following Infrastructure as Code practices
- Automated server configuration with Ansible playbooks for repeatable deployments
- Implemented CI/CD pipeline with GitHub Actions building Docker images and deploying to EC2 via SSH

**Observability:**
- Integrated Prometheus metrics and Grafana for API request monitoring and operational visibility

## Skills Matrix (Be Honest)

| Skill | Level after this project |
|-------|--------------------------|
| Python / FastAPI | Beginner → Intermediate |
| React | Beginner |
| SQL / PostgreSQL | Beginner → Intermediate |
| Docker | Beginner → Intermediate |
| AWS EC2 | Beginner |
| Terraform | Beginner |
| Ansible | Beginner |
| GitHub Actions | Beginner → Intermediate |
| Kubernetes | Awareness only (unless optional guide completed) |

## Common Interview Questions

### "Walk me through your project architecture."

Use the diagram in [01-PROJECT-ARCHITECTURE.md](./01-PROJECT-ARCHITECTURE.md). Mention: browser → React → FastAPI → PostgreSQL, Docker for packaging, AWS for hosting.

### "Why Docker?"

Consistent environments, easy deploy, isolates dependencies. Mention Compose for multi-container local dev.

### "What's the difference between Terraform and Ansible?"

Terraform **creates** cloud resources. Ansible **configures** servers after they exist.

### "How does your CI/CD pipeline work?"

Push to main → Actions builds images → pushes to GHCR → SSH to EC2 → pull and restart containers.

### "How would you add authentication?"

JWT tokens, login endpoint, protect routes with FastAPI `Depends`, store users table, never store plain passwords (bcrypt).

### "What would you improve for production?"

- Alembic migrations
- HTTPS + domain
- Secrets manager (not `.env` on server)
- Automated tests in CI
- Restrict security groups
- Database backups
- Rate limiting

## Portfolio Checklist

- [ ] GitHub README with screenshot
- [ ] Live demo URL or short Loom video
- [ ] Docs folder linked from README
- [ ] No secrets in repository
- [ ] Pinned repository on GitHub profile

## STAR Story Example

**Situation:** Needed a portfolio project showing DevOps skills, not just tutorials.  
**Task:** Build and deploy a real CRUD app end-to-end.  
**Action:** Implemented FastAPI/React stack, Dockerized, used Terraform for EC2, GitHub Actions for CD, added Prometheus metrics.  
**Result:** Public repo with documentation; can demo live deployment and explain each layer in interviews.
