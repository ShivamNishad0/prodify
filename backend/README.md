# CRM Backend API

A robust Node.js/Express backend API for a comprehensive Customer Relationship Management (CRM) system. This API handles authentication, customer management, products, orders, tenders, inventory, analytics, and more.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Seeding Data](#-seeding-data)
- [Running the Server](#-running-the-server)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Project Structure](#-project-structure)

---

## ✨ Features

### Core Features
- **User Authentication** - JWT-based secure authentication with role-based access control
- **Customer Management** - Complete CRUD operations with status tracking
- **Product Catalog** - Product management with categories and pricing
- **Order Processing** - Order creation, tracking, and status management
- **Inventory Management** - Real-time stock tracking and management
- **Tender Management** - Government and corporate tender tracking with document support
- **Analytics API** - Dashboard analytics and sales reporting
- **Messaging System** - Internal communication tracking
- **Notes & Notifications** - Activity tracking and team communication

### Security Features
- JWT token authentication
- Password hashing with bcryptjs
- Role-based access control (Admin/User)
- CORS configuration
- Input validation

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Server-side JavaScript runtime |
| **Express.js 5** | Web application framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB object modeling |
| **JWT** | JSON Web Token authentication |
| **bcryptjs** | Password hashing |
| **Nodemailer** | Email sending |
| **CORS** | Cross-Origin Resource Sharing |
| **dotenv** | Environment variables |

---

## 📦 Installation

### Prerequisites

- Node.js v16 or higher
- MongoDB v4.4 or higher
- npm v7 or higher

### Steps

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create environment file:**

   ```bash
   cp .env.example .env
   # Or create a new .env file manually
   ```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/crm

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Admin User Configuration (optional - for initial seeding)
INITIAL_ADMIN_EMAIL=admin@prodify.com
INITIAL_ADMIN_PASSWORD=admin123
INITIAL_ADMIN_NAME=System Administrator

# Email Configuration (optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# CORS Origins
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

### Variable Descriptions

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 5000 | Port number for the server |
| `NODE_ENV` | No | development | Environment (development/production) |
| `MONGODB_URI` | Yes | - | MongoDB connection string |
| `JWT_SECRET` | Yes | - | Secret key for JWT signing |
| `JWT_EXPIRE` | No | 7d | JWT token expiration time |
| `INITIAL_ADMIN_EMAIL` | No | admin@prodify.com | Initial admin email address |
| `INITIAL_ADMIN_PASSWORD` | No | admin123 | Initial admin password |
| `INITIAL_ADMIN_NAME` | No | System Administrator | Initial admin name |

---

## 🌱 Seeding Data

The backend includes seed scripts to populate the database with sample data for testing and development. Always run seeds in the specified order to maintain referential integrity.

### ⚠️ Important Seeding Order

```
1. seedAdmin.js    → Creates admin user
2. seedCustomers.js → Creates customer records
3. (seedProducts.js) → Creates product records
4. seedOrders.js   → Creates orders (requires customers & products)
5. seedTenders.js  → Creates tender records
```

### Seed Admin User

Creates the initial administrator account for system access.

```bash
node seedAdmin.js
```

**Output:**
```
✅ MongoDB connected
✅ Initial admin user created successfully!
📧 Email: admin@prodify.com
🔒 Password: admin123
👤 Name: System Administrator

⚠️  IMPORTANT: Please change the admin password after first login for security reasons.
💡 You can set custom admin credentials by adding these environment variables:
   - INITIAL_ADMIN_EMAIL
   - INITIAL_ADMIN_PASSWORD
   - INITIAL_ADMIN_NAME
```

**Default Credentials:**
- **Email:** `admin@prodify.com`
- **Password:** `admin123`

> ⚠️ **Security Warning:** Change the admin password immediately after first login!

---

### Seed Customers

Populates the database with sample customer data including contact information and status.

```bash
node seedCustomers.js
```

**Creates 8 sample customers:**
1. John Smith - Active customer (New York)
2. Sarah Johnson - Active customer (Los Angeles)
3. Michael Brown - Inactive customer (Chicago)
4. Emily Davis - Active customer (Houston)
5. David Wilson - Prospect customer (Phoenix)
6. Jessica Martinez - Active customer (Philadelphia)
7. Robert Taylor - Inactive customer (San Antonio)
8. Jennifer Garcia - Active customer (San Diego)

**Output:**
```
✅ MongoDB connected for seeding
✅ Customers seeded successfully
```

---

### Seed Products

Populates the database with sample product data.

```bash
node seedProducts.js
```

**Creates products with:**
- Product names and descriptions
- Pricing information
- Categories
- Stock quantities

**Output:**
```
✅ MongoDB connected for seeding
✅ Products seeded successfully
```

---

### Seed Orders

Populates the database with sample order data. **Prerequisites:** Customers and Products must be seeded first.

```bash
node seedOrders.js
```

**Creates 10 sample orders with:**
- Customer associations
- Order items with products and quantities
- Total amounts
- Various statuses (pending, processing, shipped, delivered, cancelled)
- Order dates
- Shipping addresses

**Order Statuses:**
- Pending
- Processing
- Shipped
- Delivered
- Cancelled

**Output:**
```
MongoDB connected for seeding
Orders seeded successfully
```

> 📋 **Prerequisite:** Run `seedCustomers.js` and `seedProducts.js` before this script!

---

### Seed Tenders

Populates the database with sample government and corporate tender opportunities.

```bash
node seedTenders.js
```

**Creates 5 sample tenders:**
1. Supply of IT Equipment for Government Offices (₹5 Crore)
2. Construction of Rural Road Infrastructure (₹7.5 Crore)
3. Office Stationery and Consumables Supply (₹1.5 Crore)
4. Consultancy Services for Digital Transformation (₹2.5 Crore)
5. Server Maintenance and Support Services (₹1.2 Crore)

**Each tender includes:**
- Title and detailed description
- Organization name
- Category and tender ID
- Estimated value
- Application and opening deadlines
- Status (Active/Closed)
- Location
- Contact information
- Required documents
- Eligibility criteria
- Terms and conditions

**Output:**
```
Connected to MongoDB
Cleared existing tenders
Successfully inserted 5 sample tenders
1. Supply of IT Equipment for Government Offices - Ministry of Electronics - Active
2. Construction of Rural Road Infrastructure - Ministry of Rural Development - Active
...
Database connection closed
```

---

### Quick Seed All Script

For convenience, you can run all seed scripts in sequence:

```bash
# Option 1: Run individually in order
node seedAdmin.js && \
node seedCustomers.js && \
node seedProducts.js && \
node seedOrders.js && \
node seedTenders.js

# Option 2: Create a combined seed script
```

---

## 🚀 Running the Server

### Development Mode

Start the server with nodemon for automatic restarts on changes:

```bash
npm run dev
```

**Output:**
```
MongoDB successfully connected
Server listening on port 5000
```

### Production Mode

Build/start the server for production:

```bash
npm start
```

**Output:**
```
MongoDB successfully connected
Server listening on port 5000
```

### Verify Server is Running

```bash
curl http://localhost:5000
```

**Response:**
```json
{
  "status": "API is running",
  "service": "CRM Backend"
}
```

---

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password with token | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/updateprofile` | Update profile | Yes |
| PUT | `/api/auth/updatepassword` | Update password | Yes |

### Admin (`/api/admin`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/users` | Get all users | Admin |
| GET | `/api/admin/users/:id` | Get user by ID | Admin |
| PUT | `/api/admin/users/:id` | Update user | Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Admin |
| PUT | `/api/admin/users/:id/role` | Update user role | Admin |

### Customers (`/api/customers`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/customers` | List all customers | Yes |
| GET | `/api/customers/:id` | Get customer by ID | Yes |
| POST | `/api/customers` | Create new customer | Yes |
| PUT | `/api/customers/:id` | Update customer | Yes |
| DELETE | `/api/customers/:id` | Delete customer | Yes |
| GET | `/api/customers/search/:query` | Search customers | Yes |

### Products (`/api/products`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | List all products | Yes |
| GET | `/api/products/:id` | Get product by ID | Yes |
| POST | `/api/products` | Create new product | Yes |
| PUT | `/api/products/:id` | Update product | Yes |
| DELETE | `/api/products/:id` | Delete product | Yes |
| GET | `/api/products/category/:category` | Filter by category | Yes |

### Orders (`/api/orders`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/orders` | List all orders | Yes |
| GET | `/api/orders/:id` | Get order by ID | Yes |
| POST | `/api/orders` | Create new order | Yes |
| PUT | `/api/orders/:id` | Update order | Yes |
| PUT | `/api/orders/:id/status` | Update order status | Yes |
| DELETE | `/api/orders/:id` | Delete order | Yes |
| GET | `/api/orders/customer/:customerId` | Get customer orders | Yes |

### Inventory (`/api/inventory`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/inventory` | List all inventory | Yes |
| GET | `/api/inventory/:id` | Get inventory item | Yes |
| POST | `/api/inventory` | Add inventory item | Yes |
| PUT | `/api/inventory/:id` | Update inventory | Yes |
| PUT | `/api/inventory/:id/stock` | Update stock level | Yes |
| DELETE | `/api/inventory/:id` | Delete inventory item | Yes |

### Tenders (`/api/tenders`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tenders` | List all tenders | Yes |
| GET | `/api/tenders/:id` | Get tender by ID | Yes |
| POST | `/api/tenders` | Create new tender | Yes |
| PUT | `/api/tenders/:id` | Update tender | Yes |
| DELETE | `/api/tenders/:id` | Delete tender | Yes |
| GET | `/api/tenders/status/:status` | Filter by status | Yes |
| GET | `/api/tenders/category/:category` | Filter by category | Yes |

### Analytics (`/api/analytics`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/analytics/dashboard` | Dashboard data | Yes |
| GET | `/api/analytics/sales` | Sales analytics | Yes |
| GET | `/api/analytics/revenue` | Revenue data | Yes |
| GET | `/api/analytics/customers` | Customer analytics | Yes |
| GET | `/api/analytics/orders` | Order analytics | Yes |

### Messages (`/api/messages`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/messages` | List all messages | Yes |
| POST | `/api/messages` | Send new message | Yes |
| GET | `/api/messages/:id` | Get message by ID | Yes |
| DELETE | `/api/messages/:id` | Delete message | Yes |

### Notes (`/api/notes`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notes` | List all notes | Yes |
| POST | `/api/notes` | Create new note | Yes |
| PUT | `/api/notes/:id` | Update note | Yes |
| DELETE | `/api/notes/:id` | Delete note | Yes |

### Notifications (`/api/notifications`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notifications` | List all notifications | Yes |
| POST | `/api/notifications` | Create notification | Yes |
| PUT | `/api/notifications/:id/read` | Mark as read | Yes |
| DELETE | `/api/notifications/:id` | Delete notification | Yes |

---

## 🔐 Authentication

### Obtaining a Token

Login to receive a JWT token:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@prodify.com", "password": "admin123"}'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "System Administrator",
    "email": "admin@prodify.com",
    "role": "admin"
  }
}
```

### Using the Token

Include the JWT token in the Authorization header for authenticated requests:

```http
Authorization: Bearer <your_jwt_token>
```

**Example:**
```bash
curl -X GET http://localhost:5000/api/customers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Token Expiration

JWT tokens expire after 7 days by default. You can configure this with the `JWT_EXPIRE` environment variable.

---

## 📁 Project Structure

```
backend/
├── models/                     # Mongoose data models
│   ├── Customer.js            # Customer schema and model
│   ├── Inventory.js           # Inventory schema and model
│   ├── Message.js             # Message schema and model
│   ├── Note.js                # Note schema and model
│   ├── Notification.js        # Notification schema and model
│   ├── Order.js               # Order schema and model
│   ├── Product.js             # Product schema and model
│   ├── Tender.js              # Tender schema and model
│   └── User.js                # User schema and model
├── routes/                     # API route handlers
│   ├── admin.js               # Admin-specific routes
│   ├── analytics.js           # Analytics and reporting routes
│   ├── auth.js                # Authentication routes
│   ├── customers.js           # Customer management routes
│   ├── inventory.js           # Inventory routes
│   ├── messages.js            # Messaging routes
│   ├── notes.js               # Notes routes
│   ├── notifications.js       # Notification routes
│   ├── orders.js              # Order processing routes
│   ├── products.js            # Product management routes
│   └── tenders.js             # Tender management routes
├── middleware/                 # Custom middleware
│   ├── adminAuth.js           # Admin authentication middleware
│   └── auth.js                # JWT authentication middleware
├── seedAdmin.js               # Admin user seeding script
├── seedCustomers.js           # Customer data seeding script
├── seedOrders.js              # Order data seeding script
├── seedTenders.js             # Tender data seeding script
├── server.js                  # Main server entry point
├── package.json               # Backend dependencies and scripts
└── .env                       # Environment variables (create this)
```

---

## 🧪 Testing

Run backend tests:

```bash
npm test
```

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

For support:
- Create an issue in the repository
- Email: support@prodify.com

---

**Built with ❤️ by the Prodify Development Team**

