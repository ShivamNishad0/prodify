# CRM Authentication Implementation Plan

## Project Overview

This plan outlines the implementation of a dual authentication system:
- **Admin Users** → JWT-based login (admin-created accounts only)
- **Website Users** → Keycloak-based signup/login

## Current State Analysis

### Backend (Port 5001)
- ✅ Express.js server with MongoDB
- ✅ JWT authentication implemented
- ✅ Admin creation via seedAdmin.js
- ✅ Public registration disabled in auth.js

### Frontend - Admin Panel (Port 5173)
- ✅ React app with routing
- ✅ AuthContext for state management
- ✅ ProtectedRoute component

### Website - User Portal (Port 5174)
- ⚠️ Basic React app started
- ❌ No authentication system
- ❌ No Keycloak integration

## Implementation Plan

### Phase 1: Backend Modifications

#### 1.1 Install Keycloak Dependencies
```bash
cd backend && npm install keycloak-connect keycloak-admin-client
```

#### 1.2 Create Keycloak Configuration
- File: `backend/config/keycloak.js` (NEW)
- Keycloak connection config
- Session management

#### 1.3 Update User Model
- File: `backend/models/User.js` (MODIFIED)
- Add `keycloakId` field for website users
- Add `authProvider` field ('local' or 'keycloak')
- Add `isWebsiteUser` boolean flag

#### 1.4 Create Keycloak Auth Routes
- File: `backend/routes/keycloakAuth.js` (NEW)
- Keycloak login endpoint
- Keycloak callback handler
- User provisioning from Keycloak

#### 1.5 Update Admin Routes
- File: `backend/routes/admin.js` (MODIFIED)
- Add user management endpoints
- Create admin users
- List all users

#### 1.6 Update Server.js
- File: `backend/server.js` (MODIFIED)
- Add Keycloak middleware
- Mount Keycloak routes

### Phase 2: Frontend - Admin Panel Modifications

#### 2.1 Update AuthContext
- File: `frontend/src/contexts/AuthContext.jsx` (MODIFIED)
- Add role checking logic
- Add redirect URL handling
- Store user type in localStorage

#### 2.2 Update Login Component
- File: `frontend/src/components/Login.jsx` (MODIFIED)
- On successful login, check user role
- Redirect admin to `/` (dashboard)

#### 2.3 Update ProtectedRoute
- File: `frontend/src/components/ProtectedRoute.jsx` (MODIFIED)
- Check user role before granting access

#### 2.4 Update Admin Panel
- File: `frontend/src/components/AdminPanel.jsx` (MODIFIED)
- Add "Create User" form for admin
- User management interface

### Phase 3: Website - User Portal Modifications

#### 3.1 Install Keycloak JS Adapter
```bash
cd website && npm install keycloak-js
```

#### 3.2 Create Keycloak Configuration
- File: `website/src/config/keycloak.js` (NEW)
- Keycloak server configuration

#### 3.3 Create Website Auth Context
- File: `website/src/contexts/WebsiteAuthContext.jsx` (NEW)
- Keycloak initialization
- Login/logout methods
- User state management

#### 3.4 Update Website App.jsx
- File: `website/src/App.jsx` (MODIFIED)
- Add routing for auth pages
- Protected routes for website

#### 3.5 Create Login/Signup Pages for Website
- File: `website/src/components/Login.jsx` (NEW)
- File: `website/src/components/Signup.jsx` (NEW)
- Keycloak integration buttons

#### 3.6 Create Protected Route for Website
- File: `website/src/components/ProtectedRoute.jsx` (NEW)
- Check authentication

### Phase 4: Keycloak Docker Setup

#### 4.1 Docker Compose
- File: `docker-compose.keycloak.yml` (NEW)
- Keycloak server configuration
- PostgreSQL for Keycloak data

## Environment Variables Required

### Backend (.env)
```env
# Existing
MONGODB_URI=mongodb://localhost:27017/crm
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=7d

# New - Keycloak
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=prodify
KEYCLOAK_CLIENT_ID=crm-backend
KEYCLOAK_CLIENT_SECRET=your-client-secret
KEYCLOAK_ADMIN_USERNAME=admin
KEYCLOAK_ADMIN_PASSWORD=admin

# Frontend URLs
FRONTEND_URL=http://localhost:5173
WEBSITE_URL=http://localhost:5174
```

### Website (.env)
```env
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=prodify
VITE_KEYCLOAK_CLIENT_ID=crm-website
```

## Keycloak Setup Instructions

### 1. Create Realm
- Name: `prodify`
- Enable the realm

### 2. Create Clients
1. **CRM Backend** (confidential)
   - Client ID: `crm-backend`
   - Access Type: `confidential`
   - Service Accounts Enabled: `ON`

2. **CRM Website** (public)
   - Client ID: `crm-website`
   - Access Type: `public`
   - Valid Redirect URIs: `http://localhost:5174/*`

### 3. Create Roles
- `admin` - Full system access
- `manager` - Limited admin access
- `employee` - Basic access

## Success Criteria

- ✅ Admin can only login (no signup)
- ✅ Admin created via admin panel only
- ✅ Users can signup/login via Keycloak
- ✅ Admin redirected to admin panel after login
- ✅ Users redirected to website after signup/login
- ✅ Both systems work independently

## Notes

- Keycloak must be running before starting the application
- All environment variables must be set
- MongoDB must be accessible

