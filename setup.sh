#!/bin/bash

# Create .env file
echo "PORT=5000
JWT_SECRET=your-super-secret-key-change-this-in-production
NODE_ENV=development" > .env

# Create database directory if it doesn't exist
mkdir -p database

# Make the script executable
chmod +x setup.sh

echo "Setup completed! Please check the .env file and modify the JWT_SECRET if needed." 