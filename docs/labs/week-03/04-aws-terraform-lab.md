# Lab 04 — AWS EC2 + Terraform

**Prerequisites:** Docker lab complete. AWS account with billing alerts enabled.  
**Goal:** Manually create Terraform files and provision EC2.

---

## Checkpoint 0 — AWS prep (Console)

1. Create EC2 **Key Pair** → download `.pem` → `chmod 400 ~/.ssh/your-key.pem`
2. Find your public IP: https://ifconfig.me → use `YOUR.IP.ADDRESS/32` for SSH
3. Enable MFA on root/IAM user (security basics)

**Do NOT:** Open SSH to `0.0.0.0/0` permanently.

---

## Checkpoint 1 — Terraform folder

```bash
mkdir -p terraform
cd terraform
```

**RUN:** `terraform version` — need >= 1.5.

---

## Checkpoint 2 — variables.tf

**FILE:** `terraform/variables.tf`

```hcl
variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Prefix for resource names"
  type        = string
  default     = "product-review-tracker"
}

variable "instance_type" {
  description = "EC2 instance type (t3.micro is Free Tier eligible)"
  type        = string
  default     = "t3.micro"
}

variable "key_pair_name" {
  description = "Existing AWS EC2 key pair name for SSH"
  type        = string
}

variable "ssh_cidr" {
  description = "Your IP in CIDR format for SSH access (e.g. 203.0.113.10/32)"
  type        = string
}
```

---

## Checkpoint 3 — main.tf

**FILE:** `terraform/main.tf` — full file in [04-aws-terraform-lab-MAIN.md](./04-aws-terraform-lab-MAIN.md) (100 lines).

---

## Checkpoint 4 — outputs.tf

**FILE:** `terraform/outputs.tf`

```hcl
output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.app.id
}

output "public_ip" {
  description = "Public IP — use for SSH and browser access"
  value       = aws_instance.app.public_ip
}

output "app_url" {
  description = "Application URL after deployment"
  value       = "http://${aws_instance.app.public_ip}"
}

output "ssh_command" {
  description = "SSH into the server"
  value       = "ssh -i ~/.ssh/YOUR_KEY.pem ubuntu@${aws_instance.app.public_ip}"
}
```

---

## Checkpoint 5 — user_data.sh

**FILE:** `terraform/user_data.sh`

```bash
#!/bin/bash
set -eux

apt-get update -y
apt-get install -y ca-certificates curl git

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" > /etc/apt/sources.list.d/docker.list
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
usermod -aG docker ubuntu

mkdir -p /home/ubuntu/${project_name}
chown ubuntu:ubuntu /home/ubuntu/${project_name}
```

**EXPLANATION:** Runs once at instance first boot — installs Docker before you SSH.

---

## Checkpoint 6 — terraform.tfvars

**FILE:** `terraform/terraform.tfvars` (gitignored — copy from example)

**FILE:** `terraform/terraform.tfvars.example`

```hcl
aws_region      = "us-east-1"
project_name    = "product-review-tracker"
instance_type   = "t3.micro"
key_pair_name   = "your-ec2-key-name"
ssh_cidr        = "YOUR.IP.ADDRESS/32"
```

**RUN:**

```bash
cp terraform.tfvars.example terraform.tfvars
# Edit with your real key name and IP
terraform init
terraform plan
terraform apply
```

**EXPECTED:** `Apply complete!` and `public_ip = "x.x.x.x"`

---

## Checkpoint 7 — Deploy app on EC2

```bash
ssh -i ~/.ssh/your-key.pem ubuntu@PUBLIC_IP
git clone https://github.com/YOUR_USERNAME/product-review-tracker.git
cd product-review-tracker
cp .env.example .env
docker compose up -d --build
curl http://localhost:8000/health
```

**EXPECTED:** Health JSON from server.

**Browser:** `http://PUBLIC_IP:3000` (security group must allow 80/3000 — HTTP ingress is in main.tf).

---

## Cleanup (save money)

```bash
terraform destroy
```

**Next:** [Week 4 — GitHub Actions](../week-04/05-github-actions-lab.md)
