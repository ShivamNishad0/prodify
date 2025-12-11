# CRM System

A full-stack Customer Relationship Management (CRM) system built with React (frontend) and Node.js/Express (backend).

## Features

- User authentication and authorization
- Customer management
- Product catalog
- Order processing
- Inventory tracking
- Analytics and reporting
- Responsive dashboard

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Vite
- ESLint

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd crm
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. Set up environment variables:
   - Copy `backend/.env` and update the values as needed
   - Make sure MongoDB is running on your system

## Running the Application

### Development Mode

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. In a new terminal, start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

The frontend will run on `http://localhost:5173` and the backend on `http://localhost:5000`.

### Production Mode

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Start the backend:
   ```bash
   cd backend
   npm start
   ```

## API Documentation

See the [backend README](./backend/README.md) for detailed API documentation.

## Project Structure

```
crm/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── package.json
│   └── vite.config.js
├── backend/           # Node.js backend
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   ├── server.js      # Main server file
│   └── package.json
└── README.md
