# Evonik Matrix Manager

A web application for managing chemical-material matrices with user authentication and role-based access control.

## Features

- User authentication with JWT tokens
- Role-based access control (matrix_admin, data_admin, role_admin)
- SQLite database for data persistence
- Modern React frontend with TypeScript
- Secure password hashing and session management

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   JWT_SECRET=your-super-secret-key-change-this-in-production
   NODE_ENV=development
   ```

3. Initialize the database:
   ```bash
   npm run init-db
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. In a separate terminal, start the backend server:
   ```bash
   npm run server
   ```

## Default Users

The database initialization script creates two test users:

1. Admin User:
   - Email: john.doe@evonik.com
   - Password: password
   - Role: matrix_admin

2. Data Admin:
   - Email: jane.smith@evonik.com
   - Password: password123
   - Role: data_admin

## Development

- Frontend runs on: http://localhost:5173
- Backend API runs on: http://localhost:5000

## Security Notes

- Change the JWT_SECRET in production
- Use HTTPS in production
- Implement rate limiting for production
- Add proper error logging
- Consider adding password complexity requirements

# Evonik Website

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


# Custom Domain 

Might use Netlify to get a own domain soon. 

evonik-gatekeeper.lovable.app - Link to the website for now

