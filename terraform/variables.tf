variable "ami_id" {
    description = "AMI ID for the EC2 instance"
    type = string
    #add default ="paste_here_the_ami_id"
}

variable "instance_type" {
    description = "EC2 instance type"
    type = string
    default = "t2.micro"
}
