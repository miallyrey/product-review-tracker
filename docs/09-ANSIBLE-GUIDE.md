# Ansible Guide — Concepts

> **Build playbooks:** [labs/week-05/06-ansible-lab.md](./labs/week-05/06-ansible-lab.md)

## Terraform vs Ansible

| Tool | When | Does |
|------|------|------|
| **Terraform** | Before/during server existence | Creates EC2, VPC, security groups |
| **Ansible** | After server exists | Installs packages, clones repo, starts Docker |

**Together:** Terraform builds the house; Ansible furnishes it.

## Concepts

| Term | Meaning |
|------|---------|
| **Inventory** | List of servers (`inventory.ini`) |
| **Playbook** | YAML file of tasks (`playbook.yml`) |
| **Task** | One action (install Docker, git clone) |
| **Role** | Reusable bundle of tasks (not used yet — keep simple) |
| **Idempotent** | Running twice = same result (safe to re-run) |

## Setup

```bash
pip install ansible
cd ansible
ansible-galaxy collection install -r requirements.yml
```

Edit `inventory.ini`:

```ini
app ansible_host=203.0.113.50 ansible_user=ubuntu
```

## Run Playbook

```bash
ansible-playbook -i inventory.ini playbook.yml
```

**Expected:** Tasks green (ok/changed), health check passes.

## What the Playbook Does

1. Ensures Docker is running
2. Clones/updates git repo
3. Copies `.env` from example if missing
4. Runs `docker compose up`
5. Waits for `/health` to return 200

## Roles (Future Structure)

```
roles/
  docker/
    tasks/main.yml
  app/
    tasks/main.yml
```

**Difficulty:** Medium — teaches DRY automation

## Beginner Mistakes

| Mistake | Fix |
|---------|-----|
| SSH permission denied | `chmod 400` on `.pem`, correct `ansible_host` |
| `community.docker` not found | Run `ansible-galaxy collection install` |
| Wrong `repo_url` | Update to your GitHub URL |

## Industry Use

Ansible is common for:

- Patching servers
- Deploying configs
- Bootstrap new VMs from golden images

Kubernetes reduced Ansible usage for *app* deploys, but it's still widely used for **machine configuration**.
