const session = require('express-session');
const Keycloak = require('keycloak-connect');

const memoryStore = new session.MemoryStore();

const keycloakConfig = {
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

const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

const keycloakMiddleware = (app) => {
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
  }));

  app.use(keycloak.middleware({
    logout: '/logout',
    admin: '/admin'
  }));
};

module.exports = {
  keycloak,
  keycloakMiddleware,
  memoryStore
};

