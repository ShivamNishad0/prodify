# Prodify CRM

A comprehensive Customer Relationship Management (CRM) system built with React and Node.js/Express. Manage your customers, products, orders, and analytics all in one place.

![Welcome Page](asset/img/Welcome_Page.png)

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** - Secure JWT-based authentication
- **Customer Management** - Add, edit, and manage customer information
- **Product Catalog** - Comprehensive product management system
- **Order Processing** - Streamlined order creation and tracking
- **Inventory Tracking** - Real-time inventory management
- **Analytics & Reporting** - Data-driven insights and analytics
- **Dashboard** - Responsive and intuitive user interface

### Additional Features
- **Notes & Notifications** - Internal communication system
- **Messages** - Customer communication tracking
- **Settings** - Customizable system preferences
- **Support** - Help and support resources

## 🛠 Tech Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **React Router DOM** - Client-side routing
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and quality assurance
- **Custom CSS** - Responsive design system

### Backend
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing and validation

## 📸 Screenshots

### Welcome Page
![Welcome Page](asset/img/Welcome_Page.png)
*The landing page introducing users to the CRM system*

### Sign Up Page
![Sign Up Page](asset/img/Signup_Page.png)
*User registration form with validation*

### Sign In Page
![Sign In Page](asset/img/Signin_Page.png)
*Secure login interface with authentication*

### Dashboard Home
![Home Page](asset/img/Home_Page.png)
*Main dashboard with overview of key metrics and recent activities*

### Navigation Sidebar
![Sidebar](asset/img/Sidebar.png)
*Intuitive navigation menu with all CRM modules*

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager

## 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd crm
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/crm
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

2. **Start the frontend (in a new terminal):**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

### Production Mode

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the backend:**
   ```bash
   cd backend
   npm start
   ```

## 📚 API Documentation

For detailed API documentation, see the [Backend README](./backend/README.md)

### Key API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

#### Core Resources
- `GET /api/customers` - List all customers
- `GET /api/products` - List all products
- `GET /api/orders` - List all orders
- `GET /api/analytics/dashboard` - Dashboard analytics

## 🏗 Project Structure

```
prodify-crm/
├── asset/
│   └── img/                 # Project screenshots
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # Application entry point
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── models/             # Mongoose data models
│   ├── routes/             # API route handlers
│   ├── middleware/         # Custom middleware
│   └── server.js           # Main server file
└── README.md               # This file
```

## 🔐 Authentication

The system uses JWT-based authentication. After successful login, you'll receive a token that must be included in subsequent requests:

```javascript
headers: {
  'Authorization': 'Bearer <your_jwt_token>'
}
```

## 🧪 Testing

Run the test suites:

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Frontend Deployment
The frontend can be deployed to any static hosting service:
```bash
cd frontend
npm run build
# Deploy the dist/ folder
```

### Backend Deployment
Deploy the backend to your preferred Node.js hosting service:
```bash
cd backend
npm start
```

Ensure environment variables are properly configured in your hosting environment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Prodify Development Team** - *Initial work* - [Prodify](https://prodify.com)

## 🙏 Acknowledgments

- MongoDB for the robust database solution
- React team for the excellent frontend framework
- Express.js community for the web framework
- All contributors who have helped improve this project

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `/docs` folder

---

**Happy CRM Management! 🚀**
