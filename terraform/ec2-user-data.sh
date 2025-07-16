#!/bin/bash
set -e

# Instalar Docker y Docker Compose
sudo apt-get update -y
sudo apt-get install -y ca-certificates curl gnupg git

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Clonar tu repositorio
git clone https://github.com/JexUgaz/risk-entity-scraper.git /home/ubuntu/app

# Ejecutar Docker Compose
cd /home/ubuntu/app
sudo docker compose up -d
