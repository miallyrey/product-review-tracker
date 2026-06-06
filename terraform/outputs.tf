output "ec2_public_ips" {
    value = [for server in aws_instance.my_servers : server.public_ip]
}
