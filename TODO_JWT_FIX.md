# JWT Expiration Fix - TODO List

## Issues Identified:
1. "jwt expired" appearing twice in logs due to double token verification
2. JWT expiration hardcoded instead of using environment variable

## Fix Plan:

### Step 1: Update backend/routes/auth.js
- [x] Change hardcoded `expiresIn: '7d'` to `expiresIn: process.env.JWT_EXPIRE || '7d'`

### Step 2: Remove duplicate auth middleware from routes
- [x] backend/routes/products.js - Remove `auth` from routes that already have `adminAuth`
- [x] Check other routes for similar issues

### Step 3: Add better error logging
- [x] Update middleware to log more specific error information

### Step 4: Test the changes
- [ ] Verify the fix works as expected

