resource "aws_security_group" "backend_sg" {
    name = "back-end-sg"
    description = "Allow SSH and FastAPI"

    ingress {
        from_port = 22
        to_port = 22
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        from_port = 8000
        to_port = 8000
        protocol ="tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress{
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_key_pair" "backend_key" {
    key_name = "labuser"
    public_key = file("~/.ssh/id_ed25519.pub")
}

resource "aws_instance" "backend_ec2" {
    ami = var.ami_id
    instance_type = var.instance_type
    key_name = aws_key_pair.backend_key.key_name
    security_groups = [aws_security_group.backend_sg.name]
}