variable "ami_id" {
    description = "AMI ID for the EC2 instance"
    type = string
    default ="ami-029a761f237195c2c"
}

variable "instance_type" {
    description = "EC2 instance type"
    type = string
    default = "t2.micro"
}
