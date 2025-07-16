variable "aws_region" {
  default = "us-east-1"
}

variable "ami_id" {
  default = "ami-053b0d53c279acc90"
}

variable "public_key_path" {
  default = "~/.ssh/id_rsa.pub"
  type = string
}
