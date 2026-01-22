const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { keycloak, getAdminKeycloak } = require('../config/keycloak');

const router = express.Router();

// Middleware to check if user is authenticated via Keycloak
const keycloakAuth = keycloak.protect();

// Keycloak login endpoint - redirects to Keycloak login page
router.get('/login', keycloak.protect(), (req, res) => {
  // This will redirect to Keycloak login
  res.json({ message: 'Redirecting to Keycloak login...' });
});

// Keycloak callback endpoint
router.get('/callback', async (req, res) => {
  try {
    const grant = req.kauth.grant;
    if (!grant || !grant.access_token) {
      throw new Error('No access token in grant');
    }
    
    const accessToken = grant.access_token.token;
    const refreshToken = grant.refresh_token ? grant.refresh_token.token : null;
    
    // Calculate token expiration
    const expiresAt = grant.access_token.expires_at ? 
      new Date(grant.access_token.expires_at * 1000) : 
      new Date(Date.now() + 3600000); // Default 1 hour
    
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
    
    // Return all auth info for frontend
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        authProvider: 'keycloak',
        isWebsiteUser: true
      },
      keycloak: {
        accessToken,
        refreshToken,
        expiresAt: expiresAt.toISOString(),
        tokenType: grant.access_token.token_type || 'Bearer'
      }
    });
    
  } catch (err) {
    console.error('Keycloak callback error:', err);
    res.status(500).json({ 
      msg: 'Authentication failed', 
      error: err.message 
    });
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
    
    res.json({ 
      user, 
      isKeycloakUser: user.authProvider === 'keycloak',
      authProvider: user.authProvider
    });
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
});

// Refresh Keycloak token
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ msg: 'Refresh token is required' });
    }

    // Get Keycloak configuration
    const keycloakConfig = {
      clientId: process.env.KEYCLOAK_CLIENT_ID || 'crm-backend',
      bearerOnly: false,
      serverUrl: process.env.KEYCLOAK_URL || 'http://localhost:8080',
      realm: process.env.KEYCLOAK_REALM || 'prodify',
      credentials: {
        secret: process.env.KEYCLOAK_CLIENT_SECRET || 'your-client-secret'
      }
    };

    // Create a temporary Keycloak instance for token refresh
    const tempKeycloak = new Keycloak({}, keycloakConfig);
    
    try {
      // Attempt to refresh the token
      const grant = await tempKeycloak.getGrantFromRefreshToken(
        req, 
        keycloakConfig
      );
      
      if (grant && grant.access_token) {
        const newAccessToken = grant.access_token.token;
        const newRefreshToken = grant.refresh_token ? grant.refresh_token.token : refreshToken;
        
        // Decode the new token
        const decoded = jwt.decode(newAccessToken);
        
        res.json({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          expiresIn: grant.access_token.expires_in || 3600,
          tokenType: 'Bearer',
          decoded: {
            sub: decoded.sub,
            email: decoded.email,
            name: decoded.name
          }
        });
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError.message);
      
      // If refresh fails, try to re-authenticate
      const authHeader = req.header('Authorization');
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.id).select('-password');
        
        if (user && user.authProvider === 'keycloak') {
          // Return a flag to trigger re-authentication
          return res.status(401).json({ 
            msg: 'Token refresh failed, re-authentication required',
            reauthenticate: true 
          });
        }
      }
      
      res.status(401).json({ msg: 'Token refresh failed' });
    }
  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(500).json({ msg: 'Server error during token refresh' });
  }
});

// Get Keycloak user info (for admin to see linked users)
router.get('/users', keycloakAuth, async (req, res) => {
  try {
    const keycloakUsers = await User.find({ authProvider: 'keycloak' })
      .select('name email keycloakId isWebsiteUser role createdAt');
    res.json(keycloakUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get Keycloak session info
router.get('/session', keycloakAuth, (req, res) => {
  try {
    const grant = req.kauth.grant;
    if (grant) {
      res.json({
        accessTokenExpires: grant.access_token?.expires_at ? 
          new Date(grant.access_token.expires_at * 1000).toISOString() : null,
        refreshTokenExpires: grant.refresh_token?.expires_at ? 
          new Date(grant.refresh_token.expires_at * 1000).toISOString() : null,
        tokenType: grant.access_token?.token_type || 'Bearer'
      });
    } else {
      res.json({ message: 'No active Keycloak session' });
    }
  } catch (err) {
    console.error('Session info error:', err);
    res.status(500).json({ msg: 'Error getting session info' });
  }
});

// Logout from Keycloak
router.get('/logout', keycloak.protect('admin'), async (req, res) => {
  try {
    const grant = req.kauth.grant;
    if (grant) {
      // Delete the grant (revokes the token)
      grant.access_token.delete();
      if (grant.refresh_token) {
        grant.refresh_token.delete();
      }
    }
    
    // Also clear the local session
    req.session.destroy();
    
    res.json({ msg: 'Logged out successfully from Keycloak' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ msg: 'Error during logout' });
  }
});

// Admin endpoint to get Keycloak realm info
router.get('/realm-info', async (req, res) => {
  try {
    const adminKeycloak = getAdminKeycloak();
    
    if (!adminKeycloak) {
      return res.json({
        realm: process.env.KEYCLOAK_REALM || 'prodify',
        serverUrl: process.env.KEYCLOAK_URL || 'http://localhost:8080',
        note: 'Admin client not configured - configure KEYCLOAK_ADMIN_CLIENT_ID and KEYCLOAK_ADMIN_CLIENT_SECRET for full realm info'
      });
    }
    
    // Get realm public key
    const tokenResponse = await fetch(
      `${process.env.KEYCLOAK_URL || 'http://localhost:8080'}/realms/${process.env.KEYCLOAK_REALM || 'prodify'}/protocol/openid-connect/certs`
    );
    
    if (tokenResponse.ok) {
      const certs = await tokenResponse.json();
      res.json({
        realm: process.env.KEYCLOAK_REALM || 'prodify',
        serverUrl: process.env.KEYCLOAK_URL || 'http://localhost:8080',
        publicKey: certs.keys?.[0]?.x5c?.[0] || null,
        certs
      });
    } else {
      throw new Error('Failed to fetch realm certificates');
    }
  } catch (err) {
    console.error('Realm info error:', err);
    res.status(500).json({ 
      realm: process.env.KEYCLOAK_REALM || 'prodify',
      serverUrl: process.env.KEYCLOAK_URL || 'http://localhost:8080',
      error: err.message 
    });
  }
});

module.exports = router;

