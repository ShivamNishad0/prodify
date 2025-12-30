# CRM Frontend

A modern, responsive React 19 frontend for a comprehensive Customer Relationship Management (CRM) system. Built with React, Vite, and modern CSS for a seamless user experience.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Components](#-components)
- [Styling](#-styling)
- [Building for Production](#-building-for-production)

---

## ✨ Features

### Core Features
- **🔐 Secure Authentication** - Login, registration, password reset with JWT
- **📊 Interactive Dashboard** - Real-time analytics with beautiful charts
- **👥 Customer Management** - Complete customer CRUD with search and filters
- **📦 Product Management** - Product catalog with categories and pricing
- **🛒 Order Management** - Order tracking with status updates
- **📈 Inventory Management** - Stock tracking and management
- **🎯 Tender Management** - Government and corporate tender tracking
- **📝 Notes System** - Internal note-taking and collaboration
- **🔔 Notifications** - Real-time notification center
- **💬 Messaging** - Customer communication tracking

### UI/UX Features
- **📱 Responsive Design** - Works on desktop, tablet, and mobile
- **🌙 Modern UI** - Clean, professional interface
- **📊 Data Visualization** - Interactive charts and graphs
- **🔍 Search & Filter** - Quick access to data
- **⚡ Fast Loading** - Built with Vite for optimal performance

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | Modern React with hooks and functional components |
| **React Router DOM** | Client-side routing and navigation |
| **Vite** | Fast build tool and development server |
| **Chart.js** | Interactive charts and data visualization |
| **React ChartJS 2** | React wrapper for Chart.js |
| **Axios** | HTTP client for API requests |
| **date-fns** | Date formatting and manipulation |
| **Lucide React** | Beautiful, consistent icons |
| **React Icons** | Additional icon library |
| **ESLint** | Code linting and quality assurance |

---

## 📦 Installation

### Prerequisites

- Node.js v16 or higher
- npm v7 or higher
- A running CRM backend server

### Steps

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `frontend` directory (optional for development):

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Prodify CRM
```

### Connecting to Backend

The frontend connects to the backend API at `http://localhost:5000` by default. Ensure the backend server is running before starting the frontend.

**API Configuration:**

The API base URL is configured in the Axios instance or API service files. Update if your backend runs on a different port.

---

## 🚀 Running the Application

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

**Output:**
```
VITE v5.x.x  ready in 300 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use `--host` to expose
  ➜  press h + enter to show help
```

The application will be available at `http://localhost:5173`

### Production Build

Build the application for production:

```bash
npm run build
```

**Output:**
```
vite v5.x.x building for production...
✓ built in 2.5s
```

The built files will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check for code quality issues:

```bash
npm run lint
```

---

## 📁 Project Structure

```
frontend/
├── public/                      # Static public assets
│   └── vite.svg                # Vite logo
├── src/
│   ├── assets/                 # Application assets
│   │   └── react.svg           # React logo
│   ├── components/             # React components
│   │   ├── *.jsx               # Page components
│   │   │   ├── About.jsx       # About page
│   │   │   ├── AdminPanel.jsx  # Admin management
│   │   │   ├── Analytics.jsx   # Analytics dashboard
│   │   │   ├── Customers.jsx   # Customer management
│   │   │   ├── Footer.jsx      # Footer component
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Homepage.jsx    # Dashboard home
│   │   │   ├── Inventory.jsx   # Inventory management
│   │   │   ├── Layout.jsx      # Main layout wrapper
│   │   │   ├── Login.jsx       # Login page
│   │   │   ├── Messages.jsx    # Messaging system
│   │   │   ├── Navbar.jsx      # Navigation bar
│   │   │   ├── Notes.jsx       # Notes system
│   │   │   ├── Notifications.jsx
│   │   │   ├── Orders.jsx      # Order management
│   │   │   ├── Products.jsx    # Product catalog
│   │   │   ├── Profile.jsx     # User profile
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Reports.jsx     # Reports page
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── Rightsidebar.jsx
│   │   │   ├── Settings.jsx    # Settings page
│   │   │   ├── Sidebar.jsx     # Sidebar navigation
│   │   │   ├── Signup.jsx      # Registration page
│   │   │   ├── Support.jsx     # Support page
│   │   │   ├── Tenders.jsx     # Tender management
│   │   │   └── Welcome.jsx     # Welcome page
│   │   ├── charts/             # Chart components
│   │   │   ├── CustomerChart.jsx       # Customer growth chart
│   │   │   ├── OrderStatusChart.jsx    # Order status pie chart
│   │   │   ├── RevenueChart.jsx        # Revenue line chart
│   │   │   └── SalesByCategoryChart.jsx # Category sales chart
│   │   └── *.css               # Component-specific styles
│   │       └── Customers.css   # Customers page styles
│   ├── contexts/               # React contexts
│   │   └── AuthContext.jsx     # Authentication context
│   ├── utils/                  # Utility functions
│   │   └── dataHelpers.js      # Data helper functions
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # Application entry point
│   ├── index.css               # Global styles
│   └── colors.js               # Color theme configuration
├── index.html                  # HTML entry point
├── package.json                # Frontend dependencies
├── vite.config.js              # Vite configuration
└── eslint.config.js            # ESLint configuration
```

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run lint:fix` | Auto-fix ESLint issues |

---

## 🧩 Components

### Page Components

| Component | Route | Description |
|-----------|-------|-------------|
| `Welcome` | `/welcome` | Landing/welcome page |
| `Login` | `/login` | User login page |
| `Signup` | `/signup` | User registration page |
| `ForgotPassword` | `/forgot-password` | Password recovery request |
| `ResetPassword` | `/reset-password/:token` | Password reset form |
| `Homepage` | `/home` | Main dashboard |
| `Layout` | `/` | Main layout wrapper |
| `Sidebar` | - | Navigation sidebar |
| `Navbar` | - | Top navigation bar |
| `Customers` | `/customers` | Customer management |
| `Products` | `/products` | Product catalog |
| `Orders` | `/orders` | Order management |
| `Inventory` | `/inventory` | Inventory tracking |
| `Tenders` | `/tenders` | Tender management |
| `Analytics` | `/analytics` | Analytics dashboard |
| `Notes` | `/notes` | Notes system |
| `Messages` | `/messages` | Messaging center |
| `Notifications` | `/notifications` | Notification center |
| `Reports` | `/reports` | Reports and exports |
| `AdminPanel` | `/admin` | Admin management |
| `Settings` | `/settings` | User settings |
| `Profile` | `/profile` | User profile |
| `Support` | `/support` | Help and support |

### Chart Components

| Component | Description |
|-----------|-------------|
| `RevenueChart` | Line chart showing revenue trends |
| `CustomerChart` | Bar chart for customer growth |
| `OrderStatusChart` | Pie chart for order status distribution |
| `SalesByCategoryChart` | Doughnut chart for category sales |

---

## 🎨 Styling

### Global Styles

The application uses a centralized color theme defined in `src/colors.js`:

```javascript
// colors.js
export const colors = {
  primary: '#...',
  secondary: '#...',
  accent: '#...',
  // ... more colors
};
```

### CSS Structure

- `index.css` - Global styles and reset
- `App.css` - App-level styles
- `components/*.css` - Component-specific styles

### Responsive Design

The application is fully responsive and works on:
- Desktop (1024px and above)
- Tablet (768px - 1023px)
- Mobile (below 768px)

---

## 🔐 Authentication

The frontend uses JWT-based authentication managed through the `AuthContext`:

```jsx
// Example: Protected Route
import { useAuth } from './contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" />;
  
  return children;
}
```

### Auth Flow

1. User navigates to `/login` or `/signup`
2. After successful authentication, JWT token is stored
3. Token is included in API requests via Authorization header
4. Protected routes check for valid authentication

---

## 📊 Charts Integration

The application uses Chart.js for data visualization:

```jsx
// Example: Revenue Chart
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
  },
};
```

---

## 🏗 Building for Production

### 1. Build the Application

```bash
npm run build
```

This creates a production-ready build in the `dist` folder.

### 2. Deploy

Deploy the `dist` folder to your preferred static hosting service:

- **Vercel:** `vercel deploy`
- **Netlify:** Drag and drop `dist` folder
- **AWS S3:** Upload `dist` contents to S3 bucket
- **GitHub Pages:** Push `dist` to gh-pages branch

### 3. Configure API URL

Ensure the production API URL is correctly configured in your build.

---

## 🔧 Troubleshooting

### Port Already in Use

If port 5173 is already in use:

```bash
npm run dev -- --port 3000
```

### Module Not Found Errors

Try reinstalling dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

Run linting to identify issues:

```bash
npm run lint
```

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

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
- Check the main README for additional resources

---

**Built with ❤️ by the Prodify Development Team**

