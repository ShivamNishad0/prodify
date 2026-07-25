# Prodify CRM - The Complete Guide Book

Welcome to the comprehensive guide for **Prodify CRM**. This document serves as the central source of truth for the project, detailing the core vision, mission, modules, and step-by-step instructions on how to set up and run the system.

---

## 🌟 Vision & Mission

### Vision
To build a seamless, robust, and hyper-scalable Customer Relationship Management (CRM) ecosystem that empowers businesses to manage their customers, products, inventory, and sales effortlessly from a single pane of glass, secured by enterprise-grade identity management.

### Mission
1. **Centralize Data:** Eliminate data silos by bringing customers, inventory, and analytics under one unified system.
2. **Enterprise Security:** Utilize Keycloak for state-of-the-art authentication (SSO, TOTP) and granular role-based access controls.
3. **High Performance:** Deliver a lightning-fast React frontend backed by a robust Node.js and PostgreSQL architecture.
4. **Actionable Insights:** Provide real-time analytics to help businesses make data-driven decisions.

---

## 🧩 System Modules

Prodify CRM is divided into several interconnected modules that work together like gears in a machine:

### 1. Identity & Access Management (Keycloak)
- **Role-Based Access Control (RBAC):** Restricts access based on roles (`admin`, `manager`, `employee`, `tl`).
- **Two-Factor Authentication (TOTP):** Enforces Authenticator App registration for enhanced security.
- **Single Sign-On (SSO):** Centralized login system.

### 2. User & Team Management
- Tracks internal employees, managers, and admins.
- Manages profiles, contact information, and hierarchy.

### 3. Customer Management
- Full lifecycle management of customers.
- Tracking of contact history, statuses, and associated documents.

### 4. Product & Inventory Management
- **Catalog:** Management of product details, pricing, and categories.
- **Inventory Tracking:** Real-time stock levels, low-stock alerts, and warehouse tracking.

### 5. Order Processing System
- Creation and fulfillment of customer orders.
- Order status tracking (Pending, Shipped, Delivered, Canceled).

### 6. Analytics & Reporting
- Sales dashboards, revenue charts, and performance metrics.
- Exportable reporting for business audits.

### 7. Communication & Notifications
- Internal messaging system between team members.
- Real-time notifications for system events (e.g., new orders, low stock).

### 8. HRMS (Human Resource Management System) - *Microservice*
- Independent Spring Boot microservice running on port 8181.
- Manages staff, attendance, and HR-related documents.

---

## 🚀 How to Run the Project

Prodify CRM consists of three main components: The **PostgreSQL Database**, the **Keycloak Auth Server**, the **Node.js Backend**, and the **React Frontend**.

### Prerequisites
- Node.js (v18 or v20 recommended)
- PostgreSQL Server (running on port 5432)
- Java (Required for running Keycloak locally)

### Step 1: Database Setup
1. Ensure your PostgreSQL server is running.
2. Create two databases:
   - `prodify_crm` (For the Node.js backend)
   - `keycloak_db` (For the Keycloak Auth server)
   ```bash
   createdb -U postgres prodify_crm
   createdb -U postgres keycloak_db
   ```

### Step 2: Start Keycloak
Keycloak handles all the authentication. It must be running for the backend and frontend to work properly.

1. Open a new terminal window.
2. Navigate to the `scripts` directory (or use the root script).
3. Run the Keycloak start script:
   ```bash
   bash scripts/run-keycloak.sh
   ```
4. Wait for Keycloak to finish booting (Listening on `http://localhost:8080`).

### Step 3: Start the Backend (Node.js)
The backend serves the API and connects to the `prodify_crm` database.

1. Open a second terminal window.
2. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
3. Make sure your `.env` file is properly configured with your PostgreSQL credentials and Keycloak settings.
4. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
5. Seed the initial admin user (Optional, but recommended for first setup):
   ```bash
   node seedAdmin.js
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```
7. The backend will start on `http://localhost:5000`.

### Step 4: Start the Frontend (React)
The frontend provides the user interface for the CRM.

1. Open a third terminal window.
2. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
3. Ensure `.env` is configured (pointing to `http://localhost:5000` for the API and `http://localhost:8080` for Keycloak).
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the Vite development server:
   ```bash
   npm run dev
   ```
6. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:3000` or `http://localhost:5173`).

### Step 5: Start the HRMS Microservice (Optional)
The HRMS system runs as a standalone Spring Boot microservice connected to the `backupdb1` database.
1. Open a fourth terminal window.
2. Run the provided script to start it:
   ```bash
   ./scripts/run-hrms.sh
   ```
3. The HRMS API will be available on `http://localhost:8181`.

---

## 🛠 Useful Commands

- **Check TOTP Status (Backend Script):**
  ```bash
  cd backend
  node check-totp-db.js
  ```
- **Export Keycloak Data:**
  ```bash
  ./keycloak-26.6.3/bin/kc.sh export --dir ./keycloak-export
  ```

---
*Document Version: 1.0.0*
*Last Updated: 2026-07-25*
