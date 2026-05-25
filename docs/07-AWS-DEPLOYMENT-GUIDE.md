# AWS Deployment Guide

## What You Will Learn

- EC2 virtual server basics
- Security Groups (firewall rules)
- SSH access
- Running Docker on a Linux server
- Cost-aware deployment

## Cost Control (Important)

| Do | Don't |
|----|-------|
| Use `t3.micro` (Free Tier eligible) | Use large GPU instances |
| `terraform destroy` when not learning | Leave EC2 running 24/7 unused |
| Restrict SSH to your IP (`/32`) | Open SSH to `0.0.0.0/0` |
| Set billing alerts in AWS Console | Ignore AWS bills |

## Deployment Steps

### 1. Create EC2 Key Pair

AWS Console → EC2 → Key Pairs → Create → download `.pem`

```bash
chmod 400 ~/.ssh/your-key.pem
```

### 2. Provision with Terraform

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit: key_pair_name, ssh_cidr (your IP/32)
terraform init
terraform plan
terraform apply
```

Note `public_ip` from output.

### 3. Clone App on Server

```bash
ssh -i ~/.ssh/your-key.pem ubuntu@YOUR_PUBLIC_IP
git clone https://github.com/YOUR_USERNAME/product-review-tracker.git
cd product-review-tracker
cp .env.example .env
# Edit POSTGRES_PASSWORD to something strong
docker compose up -d --build
```

### 4. Verify

Browser: `http://YOUR_PUBLIC_IP:3000`  
If using only port 80, map frontend to 80 in compose or add nginx reverse proxy on host.

### 5. GitHub Actions Deploy (Week 4)

Store secrets in GitHub repo → Settings → Secrets:

- `EC2_HOST` — public IP
- `EC2_USER` — `ubuntu`
- `EC2_SSH_KEY` — private key contents

## Security Basics

1. **Never** commit `.pem` or `.env` files
2. Use **IAM** with least privilege (don't use root account access keys)
3. Close port 8000 to public in production — only expose 80/443
4. Enable HTTPS with Let's Encrypt (Certbot) when you add a domain

## Reverse Proxy (Production Pattern)

Companies put **nginx** or **Caddy** in front:

```
Internet → :443 HTTPS → nginx → frontend:80
                              → /api → backend:8000
```

## DNS Basics

1. Buy domain (Route 53, Namecheap, etc.)
2. Create **A record** pointing to EC2 public IP
3. Point Certbot at domain for HTTPS

## Common AWS Mistakes

- Wrong security group (forgot port 80)
- Elastic IP not associated (IP changes on stop/start without EIP)
- Out of disk space on small volume — we use 20GB gp3
