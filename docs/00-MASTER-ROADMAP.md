# Master Roadmap — Product Review Tracker

**Time:** 1–3 hours/day · **6 weeks**  
**Method:** [Hands-on labs](./labs/README.md) — you create every file manually

---

## How to Use This Roadmap

Each week links to a **lab manual** (full code inside) plus a **concept guide** (why + debugging).

Do **not** skip ahead to `reference/` — build muscle memory first.

---

## Week 1 — Local CRUD App

| Goal | Lab | Concept guides |
|------|-----|----------------|
| FastAPI API + PostgreSQL | [01-backend-lab](./labs/week-01/01-backend-lab.md) | [03-BACKEND](./03-BACKEND-GUIDE.md), [05-DATABASE](./05-DATABASE-GUIDE.md) |
| React UI | [02-frontend-lab](./labs/week-01/02-frontend-lab.md) | [04-FRONTEND](./04-FRONTEND-GUIDE.md) |

**Checkpoint:** Create 3 products via UI; API docs at `:8000/docs`.

**Resume:** "Built full-stack CRUD with FastAPI and React"

---

## Week 2 — Docker + PostgreSQL

| Lab | [03-docker-lab](./labs/week-02/03-docker-lab.md) |
| Guide | [06-DOCKER](./06-DOCKER-GUIDE.md) |

**Checkpoint:** `docker compose up` — data survives restart.

**Resume:** "Containerized services with Docker Compose"

---

## Week 3 — AWS Deployment

| Lab | [04-aws-terraform-lab](./labs/week-03/04-aws-terraform-lab.md) |
| Guides | [07-AWS](./07-AWS-DEPLOYMENT-GUIDE.md), [08-TERRAFORM](./08-TERRAFORM-GUIDE.md) |

**Checkpoint:** App reachable at EC2 public IP.

**Resume:** "Provisioned EC2 with Terraform (IaC)"

---

## Week 4 — CI/CD Pipeline

| Lab | [05-github-actions-lab](./labs/week-04/05-github-actions-lab.md) |
| Guide | [10-GITHUB-ACTIONS](./10-GITHUB-ACTIONS-GUIDE.md) |

**Checkpoint:** Push to `main` deploys to EC2.

**Resume:** "CI/CD with GitHub Actions and GHCR"

---

## Week 5 — Terraform + Ansible

| Lab | [06-ansible-lab](./labs/week-05/06-ansible-lab.md) |
| Guides | [08-TERRAFORM](./08-TERRAFORM-GUIDE.md), [09-ANSIBLE](./09-ANSIBLE-GUIDE.md) |

**Checkpoint:** `terraform destroy` then rebuild; Ansible playbook green.

**Resume:** "IaC + configuration management (Terraform, Ansible)"

---

## Week 6 — Monitoring + Improvements

| Lab | [07-monitoring-lab](./labs/week-06/07-monitoring-lab.md) |
| Guide | [11-OBSERVABILITY](./11-OBSERVABILITY-GUIDE.md) |

**Checkpoint:** Grafana screenshot of request metrics.

**Resume:** "Observability with Prometheus and Grafana"

---

## Evaluation Criteria

- [ ] Built files yourself using labs (can explain each file)
- [ ] Can demo app (local or EC2)
- [ ] No secrets in git
- [ ] Docs + public GitHub repo
- [ ] One optional feature attempted ([13-FEATURE](./13-FEATURE-DEVELOPMENT-GUIDE.md))

---

## Learning Rules

[16-HANDS-ON-LEARNING-GUIDE.md](./16-HANDS-ON-LEARNING-GUIDE.md) — lab format, tooling explained, when to use `reference/`.
