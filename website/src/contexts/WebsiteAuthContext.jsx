
import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import keycloak from '../config/keycloak';

const WebsiteAuthContext = createContext();

export const WebsiteAuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Keycloak
  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const authenticated = await keycloak.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          pkceMethod: 'S256',
          checkLoginIframe: false,
          flow: 'standard'
        });

        setAuthenticated(authenticated);

        if (authenticated) {
          const userInfo = await keycloak.loadUserInfo();
          setUser({
            id: keycloak.subject,
            email: userInfo.email,
            name: userInfo.name || userInfo.preferred_username,
            username: userInfo.preferred_username,
            keycloakToken: keycloak.token
          });
        }
      } catch (err) {
        console.error('Keycloak initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initKeycloak();
  }, []);

  // Login function
  const login = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const authenticated = await keycloak.login({
        redirectUri: window.location.origin + '/auth/callback'
      });

      if (authenticated) {
        const userInfo = await keycloak.loadUserInfo();
        setUser({
          id: keycloak.subject,
          email: userInfo.email,
          name: userInfo.name || userInfo.preferred_username,
          username: userInfo.preferred_username,
          keycloakToken: keycloak.token
        });
        setAuthenticated(true);
      }
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  // Register function
  const register = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const authenticated = await keycloak.register({
        redirectUri: window.location.origin + '/auth/callback'
      });

      if (authenticated) {
        const userInfo = await keycloak.loadUserInfo();
        setUser({
          id: keycloak.subject,
          email: userInfo.email,
          name: userInfo.name || userInfo.preferred_username,
          username: userInfo.preferred_username,
          keycloakToken: keycloak.token
        });
        setAuthenticated(true);
      }
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await keycloak.logout({
        redirectUri: window.location.origin
      });
      setAuthenticated(false);
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, []);

  // Get token
  const getToken = useCallback(async () => {
    try {
      const refreshed = await keycloak.updateToken(30);
      if (refreshed) {
        setUser(prev => ({
          ...prev,
          keycloakToken: keycloak.token
        }));
      }
      return keycloak.token;
    } catch (err) {
      console.error('Token refresh error:', err);
      // If refresh fails, try to re-authenticate
      await login();
      return null;
    }
  }, [login]);

  // Process callback token from backend
  const processCallback = useCallback(async (token) => {
    try {
      localStorage.setItem('websiteToken', token);
      setAuthenticated(true);

      // Verify token with backend
      const response = await fetch('http://localhost:5001/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          ...data.user,
          keycloakToken: token
        });
      }

      return { success: true };
    } catch (err) {
      console.error('Callback processing error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  const value = {
    authenticated,
    user,
    loading,
    error,
    login,
    register,
    logout,
    getToken,
    processCallback,
    isWebsiteUser: true
  };

  return (
    <WebsiteAuthContext.Provider value={value}>
      {children}
    </WebsiteAuthContext.Provider>
  );
};

export const useWebsiteAuth = () => {
  return useContext(WebsiteAuthContext);
};

export default WebsiteAuthContext;

