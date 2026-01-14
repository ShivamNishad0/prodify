const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { keycloak } = require('../config/keycloak');

const router = express.Router();

// Middleware to check if user is authenticated via Keycloak
const keycloakAuth = keycloak.protect();

// Keycloak login endpoint - redirects to Keycloak login page
router.get('/login', keycloak.protect(), (req, res) => {
  // This will redirect to Keycloak login
});

// Keycloak callback endpoint
router.get('/callback', async (req, res) => {
  try {
    const grant = req.kauth.grant;
    const accessToken = grant.access_token.token;
    const refreshToken = grant.refresh_token ? grant.refresh_token.token : null;
    
    // Decode Keycloak token to get user info
    const decoded = jwt.decode(accessToken);
    
    const keycloakId = decoded.sub;
    const email = decoded.email;
    const name = decoded.name || decoded.preferred_username || email.split('@')[0];
    
    // Check if user exists
    let user = await User.findOne({ keycloakId });
    
    if (!user) {
      // Check if user with same email exists
      user = await User.findOne({ email });
      
      if (user) {
        // Link existing user to Keycloak
        user.keycloakId = keycloakId;
        user.authProvider = 'keycloak';
        user.isWebsiteUser = true;
        await user.save();
      } else {
        // Create new user from Keycloak
        user = new User({
          name,
          email,
          keycloakId,
          authProvider: 'keycloak',
          isWebsiteUser: true,
          role: 'employee' // Default role for website users
        });
        await user.save();
      }
    }
    
    // Generate our own JWT for API access
    const payload = {
      user: {
        id: user.id,
      },
    };
    
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
    
    // Redirect to website with token
    const frontendUrl = process.env.WEBSITE_URL || 'http://localhost:5174';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    
  } catch (err) {
    console.error('Keycloak callback error:', err);
    const frontendUrl = process.env.WEBSITE_URL || 'http://localhost:5174';
    res.redirect(`${frontendUrl}/login?error=auth_failed`);
  }
});

// Verify Keycloak user session
router.get('/verify', keycloakAuth, async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }
    
    res.json({ user, isKeycloakUser: user.authProvider === 'keycloak' });
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
});

// Logout from Keycloak
router.get('/logout', keycloak.protect('admin'), (req, res) => {
  req.kauth.grant.access_token.delete();
  res.json({ msg: 'Logged out successfully' });
});

// Get Keycloak user info (for admin to see linked users)
router.get('/users', keycloakAuth, async (req, res) => {
  try {
    const keycloakUsers = await User.find({ authProvider: 'keycloak' })
      .select('name email keycloakId isWebsiteUser createdAt');
    res.json(keycloakUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

