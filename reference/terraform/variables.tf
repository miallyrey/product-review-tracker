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
