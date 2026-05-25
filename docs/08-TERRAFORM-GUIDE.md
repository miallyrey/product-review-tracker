# Terraform Guide — Concepts

> **Build IaC:** [labs/week-03/04-aws-terraform-lab.md](./labs/week-03/04-aws-terraform-lab.md)

## Why Terraform Matters

**Infrastructure as Code (IaC)** means your servers, networks, and security rules are defined in files — version controlled, reviewable, repeatable.

Real teams use Terraform (or Pulumi, CloudFormation) so:

- Staging matches production
- New environments spin up in minutes
- Changes go through PR review like application code

## File Map

| File | Purpose |
|------|---------|
| `main.tf` | Provider, security group, EC2 instance |
| `variables.tf` | Input parameters |
| `outputs.tf` | Values after apply (IP, SSH command) |
| `user_data.sh` | Bootstrap script on first boot (installs Docker) |
| `terraform.tfvars` | Your values (gitignored — copy from example) |

## Core Concepts

### Provider

```hcl
provider "aws" {
  region = var.aws_region
}
```

Tells Terraform *which cloud* and *which region*.

### Resources

```hcl
resource "aws_instance" "app" { ... }
```

Creates real AWS objects. `terraform destroy` deletes them.

### Variables & Outputs

- **Variables** = inputs (`key_pair_name`, `ssh_cidr`)
- **Outputs** = results (`public_ip`)

### State

Terraform tracks what it created in `terraform.tfstate`. **Never commit state with secrets** — use remote backend (S3 + DynamoDB) in real teams.

## Commands

```bash
cd terraform
terraform init      # Download AWS provider
terraform plan      # Preview changes
terraform apply     # Create resources
terraform output    # Show IP and URLs
terraform destroy   # Tear down (save money!)
```

## Modularization (Later)

Split into modules:

```
modules/
  ec2/
  networking/
environments/
  dev/
  prod/
```

**Skills:** Reuse, environment separation  
**Difficulty:** Medium-Hard

## Beginner Mistakes

| Mistake | Fix |
|---------|-----|
| No `key_pair_name` in tfvars | Create key in AWS first |
| `ssh_cidr = 0.0.0.0/0` | Use your IP only |
| Edited TF but didn't apply | Run `terraform apply` |
| Lost state file | Terraform loses track — painful; use remote state |

## Interview Talking Points

- "I used Terraform to provision EC2 and security groups"
- "Variables let me reuse the same code for different regions"
- "State tracks what Terraform manages vs what's manual"
