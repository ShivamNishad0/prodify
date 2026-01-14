
import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'prodify',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'crm-website'
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;

