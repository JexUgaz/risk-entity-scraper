provider "aws" {
  region = var.aws_region
}

data "aws_vpc" "default" {
  default = true
}

resource "aws_security_group" "allow_ssh" {
  name        = "allow_ssh"
  description = "Allow SSH inbound traffic"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "SSH from anywhere"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Reemplaza por tu IP para seguridad 206.84.200.41
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_key_pair" "deployer" {
  key_name   = "ec2_risk_scraper_key"
  public_key = file("${path.module}/${var.public_key_path}")
}

resource "aws_instance" "app" {
  ami                    = var.ami_id
  instance_type          = "t2.micro"
  key_name               = aws_key_pair.deployer.key_name
  associate_public_ip_address = true
  vpc_security_group_ids = [aws_security_group.allow_ssh.id]

  tags = {
    Name = "risk-entity-scraper"
  }

  provisioner "file" {
    source      = "${path.module}/ec2-user-data.sh"
    destination = "/home/ubuntu/ec2-user-data.sh"

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("${path.module}/ec2_risk_scraper")
      host        = self.public_ip
    }
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /home/ubuntu/ec2-user-data.sh",
      "sudo /home/ubuntu/ec2-user-data.sh"
    ]

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("${path.module}/ec2_risk_scraper")
      host        = self.public_ip
    }
  }
}
