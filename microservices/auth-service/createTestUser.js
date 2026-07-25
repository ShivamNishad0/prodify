const dotenv = require('dotenv');

dotenv.config();

const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8080';
const ADMIN_USER = process.env.KEYCLOAK_ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin';

async function createUser() {
  try {
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

    const response = await fetch(`${KEYCLOAK_URL}/admin/realms/prodify/users`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'testuser',
        email: 'testuser@prodify.com',
        enabled: true,
        emailVerified: true,
        firstName: 'Test',
        lastName: 'User',
        credentials: [
          {
            type: 'password',
            value: 'testpassword',
            temporary: false
          }
        ]
      })
    });

    if (response.status === 201) {
      console.log('Test user created successfully!');
      console.log('Username: testuser');
      console.log('Password: testpassword');
    } else if (response.status === 409) {
      console.log('Test user already exists.');
    } else {
      const err = await response.text();
      console.error('Failed to create user:', err);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createUser();
