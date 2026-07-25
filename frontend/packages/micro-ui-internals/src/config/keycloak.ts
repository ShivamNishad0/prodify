import Keycloak from 'keycloak-js';

export const keycloakConfig = {
    url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8080',
    realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'prodify',
    clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'crm-backend',
};

export const isKeycloakConfigured = () => {
    return !!(
        process.env.NEXT_PUBLIC_KEYCLOAK_URL &&
        process.env.NEXT_PUBLIC_KEYCLOAK_REALM &&
        process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
    );
};

const keycloak = typeof window !== 'undefined' && isKeycloakConfigured()
    ? new Keycloak(keycloakConfig)
    : null;

export default keycloak;
