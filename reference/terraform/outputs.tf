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
