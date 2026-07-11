# 🚀 Prodify CRM

Prodify CRM is a premium, modern, full-stack Customer Relationship Management (CRM) system designed with a dual-authentication strategy. It features a Next.js-based Admin Dashboard for company staff and a Vite-based Website Portal for public clients, both backed by an Express.js API, PostgreSQL database (via Sequelize ORM), and a unified Single Sign-On (SSO) experience powered by Keycloak.

---

## 📋 Table of Contents
*   [Project Overview](#-project-overview)
*   [Features](#-features)
*   [Tech Stack](#-tech-stack)
*   [Architecture](#-architecture)
*   [Folder Structure](#-folder-structure)
*   [Installation](#-installation)
*   [Environment Variables](#-environment-variables)
*   [Keycloak Setup](#-keycloak-setup)
*   [Authentication Flow](#-authentication-flow)
*   [API Endpoints](#-api-endpoints)
*   [Screenshots Section](#-screenshots-section)
*   [Future Improvements](#-future-improvements)
*   [License](#-license)

---

## 🔍 Project Overview

Prodify CRM enables enterprises to manage customer relations, track product catalogs, coordinate orders, monitor real-time inventories, and leverage powerful analytics panels.

The system is split into three main modules:
1.  **Backend API**: High-performance Node/Express REST API using Sequelize ORM to coordinate with a local/cloud PostgreSQL cluster.
2.  **Next.js Admin Panel**: A premium Next.js dashboard built for company staff and administrators.
3.  **Vite Website Portal**: A fast client-facing interface allowing users to access services, orders, and products.

---

## ✨ Features

*   **🔐 Dual-Authentication System**:
    *   **Local Database Login**: Secure password authentication via bcrypt & JWT for local system administrators.
    *   **Single Sign-On (SSO)**: Federated OAuth2/OIDC login powered by Keycloak for staff and website users.
*   **👥 Customer & Tender Tracking**: Full CRUD management of client profiles, lifecycle stages, and tender bids.
*   **📦 Product & Inventory Coordination**: Category-wise stock lists with automatic threshold alerts and transaction logs.
*   **🛒 Order Lifecycle Management**: Smooth order creation, progress tracking, and analytics reporting.
*   **📊 Premium Interactive Analytics**: Real-time sales trends, category performance, and client metrics visualized through Chart.js.
*   **💬 Internal Collaboration Tools**: Internal messaging systems, team task lists, notifications, and activity notes.

---

## 🛠 Tech Stack

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: PostgreSQL
*   **ORM**: Sequelize
*   **Authentication**: JSON Web Tokens (JWT), bcryptjs, and `keycloak-connect`

### Admin Panel (Frontend)
*   **Framework**: Next.js 16 (Turbopack) & React 19
*   **Styling**: Vanilla CSS, Tailwind CSS
*   **Icons & Motion**: Lucide React, Framer Motion
*   **State & HTTP**: React Context API, Axios, and `keycloak-js`

### Website Portal (Vite Client)
*   **Framework**: Vite & React 19
*   **Routing**: React Router DOM
*   **State & HTTP**: Axios, `keycloak-js`

---

## 🏗 Architecture

```mermaid
graph TD
    A[Vite User Website - Port 5173] -->|API Calls / JSON| C[Express Backend - Port 5001]
    B[Next.js Admin Panel - Port 3000] -->|API Calls / JSON| C
    A -->|SSO Handshake| D[Keycloak SSO - Port 8080]
    B -->|SSO Handshake| D
    C -->|JWT Verification| D
    C -->|Relational Queries| E[(PostgreSQL Database)]
```

---

## 📁 Folder Structure

```
prodify-crm/
├── backend/                       # Express.js REST API
├── frontend/                      # Next.js Admin Panel Dashboard
├── website/                       # Vite Client Website Portal
├── keycloak-26.6.3/               # Keycloak container context & configs
├── docs/                          # Project documentation (PLAN, SETUP, TODO)
├── scripts/                       # Shell scripts (e.g., run-keycloak.sh)
├── asset/                         # Image assets for documentation
├── docker-compose.yml             # Main Docker Compose for the whole stack
├── .gitignore                     # Root gitignore
└── README.md                      # This file
```

---

## 🚀 Installation & Quick Start

The easiest way to run the entire project is using **Docker**.

### 1. Run via Docker Compose (Recommended)
Make sure you have Docker installed, then run:
```bash
docker-compose up --build
```
This will automatically build and start the Frontend (Port 3000), Backend (Port 5000), Postgres Database (Port 5432), and Keycloak (Port 8080).

### 2. Manual Installation
If you prefer running the servers manually, please check our detailed setup guides:
* [Setup Guide](docs/SETUP.md)
* [Implementation Plan](docs/PLAN.md)
* [Todo List](docs/TODO.md)

*(Note: If running manually, you can start Keycloak using `./scripts/run-keycloak.sh`)*

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5001
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# PostgreSQL Configuration
PGDATABASE=prodify_crm
PGUSER=postgres_user
PGPASSWORD=postgres_password
PGHOST=localhost
PGPORT=5432

# Keycloak Integration
KEYCLOAK_URL=http://127.0.0.1:8080
KEYCLOAK_REALM=prodify
KEYCLOAK_CLIENT_ID=crm-backend
KEYCLOAK_CLIENT_SECRET=your_confidential_client_secret
KEYCLOAK_ADMIN_USERNAME=admin
KEYCLOAK_ADMIN_PASSWORD=admin
```

### Next.js Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=prodify
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=crm-backend
```

### Vite Website Portal (`website/.env`)
```env
VITE_API_URL=http://localhost:5001/api
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=prodify
VITE_KEYCLOAK_CLIENT_ID=crm-website
```

---

## ⚙️ Keycloak Setup

1.  Create a realm named `prodify`.
2.  Configure two clients:
    *   `crm-backend`: Set as a **Public Client** (using Standard Authorization code flow with PKCE). Add valid Redirect URIs to `http://localhost:3000/*`.
    *   `crm-website`: Set as a **Public Client** with valid Redirect URIs pointing to `http://localhost:5173/*`.
3.  Add roles: `admin`, `manager`, `employee`.
4.  Optionally run the auto-creation script to populate a default test user:
    ```bash
    cd backend && node createTestUser.js
    ```

---

## 🔄 Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    Client Browser->>Keycloak: Click SSO Login (Redirect to SSO Portal)
    Keycloak->>Client Browser: Input User/Password
    Client Browser->>Keycloak: Submit Credentials
    Keycloak->>Client Browser: Issue Auth Code
    Client Browser->>Next.js Frontend: Return Auth Code via Callback URI
    Next.js Frontend->>Keycloak: Swap Auth Code for Access Token
    Next.js Frontend->>Backend API: Exchange Keycloak Access Token via POST /keycloak/callback
    Backend API->>Backend API: Verify token, extract claims & upsert user in Postgres
    Backend API->>Next.js Frontend: Issue App JWT Token + User Session Info
    Next.js Frontend->>Client Browser: Access Granted (Dashboard Home)
```

---

## 📡 API Endpoints

### Authentication
*   `POST /api/auth/register` - Create a new local user (Admin only).
*   `POST /api/auth/login` - Local JWT credential login.
*   `GET /api/auth/verify` - Check current auth session.
*   `POST /api/keycloak/callback` - Callback for exchanging Keycloak tokens for local DB sessions.

### Customers
*   `GET /api/customers` - Fetch all customer listings.
*   `POST /api/customers` - Create a new customer entry.
*   `PUT /api/customers/:id` - Update existing customer details.
*   `DELETE /api/customers/:id` - Remove customer listing.

### Messaging & Notes
*   `GET /api/messages` - Retrieve message lists.
*   `POST /api/notes` - Add team collaboration notes.

---

## 📸 Screenshots Section

### Welcome Screen
![Welcome Screen](asset/img/Welcome_Page.png)

### Sign In Dashboard
![Sign In Dashboard](asset/img/Signin_Page.png)

### Admin Central Dashboard
![Admin Central Dashboard](asset/img/Home_Page.png)

---

## 🔮 Future Improvements

*   **Real-time Synchronization**: Integrate WebSockets for real-time chat updates and team metrics.
*   **Advanced Analytics Engine**: Deploy predictive data models to forecast sales trends based on customer activity logs.
*   **Keycloak Client Roles Mapping**: Automate granular role-mapping so changes in Keycloak roles immediately sync permissions in Next.js panels.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.