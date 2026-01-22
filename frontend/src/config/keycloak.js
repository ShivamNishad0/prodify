import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'prodify',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'crm-backend'
};

// Check if Keycloak is configured
const isKeycloakConfigured = () => {
  return !!(
    import.meta.env.VITE_KEYCLOAK_URL &&
    import.meta.env.VITE_KEYCLOAK_REALM &&
    import.meta.env.VITE_KEYCLOAK_CLIENT_ID
  );
};

const keycloak = isKeycloakConfigured() ? new Keycloak(keycloakConfig) : null;

export { keycloak, keycloakConfig, isKeycloakConfigured };
export default keycloak;

