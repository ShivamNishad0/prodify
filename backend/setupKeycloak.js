const dotenv = require('dotenv');

dotenv.config();

const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8080';
const ADMIN_USER = process.env.KEYCLOAK_ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin';

async function setup() {
  try {
    console.log('Authenticating with Keycloak master realm...');
    const tokenResponse = await fetch(`${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        username: ADMIN_USER,
        password: ADMIN_PASS,
        grant_type: 'password',
        client_id: 'admin-cli'
      })
    });

    if (!tokenResponse.ok) {
      throw new Error(`Failed to authenticate: ${tokenResponse.statusText}`);
    }

    const { access_token } = await tokenResponse.json();
    console.log('Successfully authenticated as admin.');

    // 1. Create realm 'prodify'
    console.log("Checking if realm 'prodify' exists...");
    const realmCheck = await fetch(`${KEYCLOAK_URL}/admin/realms/prodify`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    if (realmCheck.status === 404) {
      console.log("Creating realm 'prodify'...");
      const createRealmResponse = await fetch(`${KEYCLOAK_URL}/admin/realms`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          realm: 'prodify',
          enabled: true,
          displayName: 'Prodify CRM',
          registrationAllowed: true, // Allow user registration for website portal
          resetPasswordAllowed: true
        })
      });

      if (!createRealmResponse.ok) {
        const errorText = await createRealmResponse.text();
        throw new Error(`Failed to create realm: ${errorText}`);
      }
      console.log("Realm 'prodify' created successfully.");
    } else {
      console.log("Realm 'prodify' already exists.");
    }

    // 2. Create crm-backend client
    console.log("Creating 'crm-backend' client...");
    const crmBackendClient = {
      clientId: 'crm-backend',
      enabled: true,
      publicClient: false,
      secret: process.env.KEYCLOAK_CLIENT_SECRET || 'your-keycloak-client-secret',
      redirectUris: ['http://localhost:5001/*', 'http://localhost:5000/*', 'http://localhost:3000/*'],
      webOrigins: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
      directAccessGrantsEnabled: true,
      serviceAccountsEnabled: true // Required for backend admin CLI operations
    };

    const createBackendResponse = await fetch(`${KEYCLOAK_URL}/admin/realms/prodify/clients`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(crmBackendClient)
    });

    if (createBackendResponse.status === 409) {
      console.log("'crm-backend' client already exists.");
    } else if (!createBackendResponse.ok) {
      const err = await createBackendResponse.text();
      console.warn("Could not create 'crm-backend' client:", err);
    } else {
      console.log("'crm-backend' client created successfully.");
    }

    // 3. Create crm-website client
    console.log("Creating 'crm-website' client...");
    const crmWebsiteClient = {
      clientId: 'crm-website',
      enabled: true,
      publicClient: true,
      redirectUris: ['http://localhost:5174/*', 'http://localhost:3000/*'],
      webOrigins: ['http://localhost:5174', 'http://localhost:3000'],
      directAccessGrantsEnabled: true
    };

    const createWebsiteResponse = await fetch(`${KEYCLOAK_URL}/admin/realms/prodify/clients`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(crmWebsiteClient)
    });

    if (createWebsiteResponse.status === 409) {
      console.log("'crm-website' client already exists.");
    } else if (!createWebsiteResponse.ok) {
      const err = await createWebsiteResponse.text();
      console.warn("Could not create 'crm-website' client:", err);
    } else {
      console.log("'crm-website' client created successfully.");
    }

    // 4. Create roles: admin, manager, employee
    const roles = ['admin', 'manager', 'employee'];
    for (const role of roles) {
      console.log(`Creating role '${role}'...`);
      const createRoleResponse = await fetch(`${KEYCLOAK_URL}/admin/realms/prodify/roles`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: role,
          description: `${role} role for Prodify CRM`
        })
      });

      if (createRoleResponse.status === 409) {
        console.log(`Role '${role}' already exists.`);
      } else if (!createRoleResponse.ok) {
        const err = await createRoleResponse.text();
        console.warn(`Could not create role '${role}':`, err);
      } else {
        console.log(`Role '${role}' created successfully.`);
      }
    }

    console.log('Keycloak realm bootstrapping completed successfully.');
  } catch (error) {
    console.error('Keycloak setup error:', error.message);
  }
}

setup();
