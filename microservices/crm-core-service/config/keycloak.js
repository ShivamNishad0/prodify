const session = require('express-session');
const Keycloak = require('keycloak-connect');

// Memory store for sessions
const memoryStore = new session.MemoryStore();

// Build Keycloak config with environment variables
const buildKeycloakConfig = () => {
  const config = {
    clientId: process.env.KEYCLOAK_CLIENT_ID || 'crm-backend',
    bearerOnly: false,
    serverUrl: process.env.KEYCLOAK_URL || 'http://localhost:8080',
    realm: process.env.KEYCLOAK_REALM || 'prodify',
    credentials: {
      secret: process.env.KEYCLOAK_CLIENT_SECRET || 'your-client-secret'
    },
    'confidential-port': 0,
    'policy-enforcer': {},
  };

  // Add realm public key for token verification (optional but recommended)
  if (process.env.KEYCLOAK_REALM_PUBLIC_KEY) {
    config['realm-public-key'] = process.env.KEYCLOAK_REALM_PUBLIC_KEY;
  }

  return config;
};

// Initialize Keycloak
const keycloakConfig = buildKeycloakConfig();
const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

// Middleware to configure Express with Keycloak
const keycloakMiddleware = (app) => {
  // Configure express-session
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Configure Keycloak middleware
  app.use(keycloak.middleware({
    logout: '/logout',
    admin: '/admin',
    protected: '/protected'
  }));
};

// Helper function to get admin Keycloak connection
const getAdminKeycloak = () => {
  if (process.env.KEYCLOAK_ADMIN_CLIENT_ID && process.env.KEYCLOAK_ADMIN_CLIENT_SECRET) {
    return new Keycloak({}, {
      clientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID || 'admin-cli',
      bearerOnly: false,
      serverUrl: process.env.KEYCLOAK_URL || 'http://localhost:8080',
      realm: 'master', // Admin realm
      credentials: {
        secret: process.env.KEYCLOAK_ADMIN_CLIENT_SECRET || ''
      }
    });
  }
  return null;
};

module.exports = {
  keycloak,
  keycloakMiddleware,
  memoryStore,
  getAdminKeycloak,
  keycloakConfig
};

