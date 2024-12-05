#!/bin/bash

# Exit on error
set -e

echo "Starting deployment process..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo "Please run as root"
  exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building application..."
npm run build

# Install PM2 globally if not already installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Ensure correct permissions
echo "Setting permissions..."
chown -R www-data:www-data /var/www/chat-app
chmod -R 755 /var/www/chat-app

# Start/Restart the application using PM2
echo "Starting application with PM2..."
pm2 start ecosystem.config.js || pm2 restart ecosystem.config.js

# Save the PM2 process list
echo "Saving PM2 process list..."
pm2 save

# Setup PM2 to start on system boot
echo "Setting up PM2 startup..."
pm2 startup

echo "Deployment completed successfully!"