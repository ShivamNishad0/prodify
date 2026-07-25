const dotenv = require('dotenv');

dotenv.config();

const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://127.0.0.1:8080';
const ADMIN_USER = process.env.KEYCLOAK_ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin';

async function run() {
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
      throw new Error(`Auth failed: ${tokenResponse.statusText}`);
    }

    const { access_token } = await tokenResponse.json();

    // Find the crm-backend client
    console.log("Finding client 'crm-backend'...");
    const listResponse = await fetch(`${KEYCLOAK_URL}/admin/realms/prodify/clients?clientId=crm-backend`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const clients = await listResponse.json();
    if (clients.length > 0) {
      const clientUuid = clients[0].id;
      console.log(`Found client 'crm-backend' with ID: ${clientUuid}. Deleting it to recreate as public...`);
      
      const deleteResponse = await fetch(`${KEYCLOAK_URL}/admin/realms/prodify/clients/${clientUuid}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });

      if (!deleteResponse.ok) {
        throw new Error(`Failed to delete client: ${await deleteResponse.text()}`);
      }
      console.log("Client deleted.");
    }

    // Recreate as public client
    console.log("Recreating 'crm-backend' client as public client...");
    const crmBackendClient = {
      clientId: 'crm-backend',
      enabled: true,
      publicClient: true,
      redirectUris: ['http://localhost:5001/*', 'http://localhost:5000/*', 'http://localhost:3000/*'],
      webOrigins: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
      directAccessGrantsEnabled: true
    };

    const createResponse = await fetch(`${KEYCLOAK_URL}/admin/realms/prodify/clients`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(crmBackendClient)
    });

    if (!createResponse.ok) {
      throw new Error(`Failed to create public client: ${await createResponse.text()}`);
    }

    console.log("'crm-backend' client successfully recreated as public client!");
  } catch (error) {
    console.error('Error:', error.message);
  }
}

run();
