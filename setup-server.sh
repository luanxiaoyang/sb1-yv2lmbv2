#!/bin/bash

# Exit on error
set -e

echo "Starting server setup..."

# Update system packages
apt update && apt upgrade -y

# Install required packages
apt install -y curl git nginx

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Configure Nginx
cat > /etc/nginx/sites-available/chat-app << 'EOL'
server {
    listen 80;
    listen [::]:80;
    server_name $HOSTNAME;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOL

# Enable the site
ln -sf /etc/nginx/sites-available/chat-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx

# Configure firewall
ufw allow 80
ufw allow 443
ufw allow 22

echo "Server setup completed successfully!"