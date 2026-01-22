import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import keycloak, { isKeycloakConfigured } from '../config/keycloak';

const AuthContext = createContext();

// Configure axios defaults
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [authMethod, setAuthMethod] = useState('local'); // 'local' or 'keycloak'

  // Configure axios interceptor for token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Check if user is authenticated on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get('/auth/verify');
          setUser(response.data.user);
          setAuthMethod(response.data.authProvider === 'keycloak' ? 'keycloak' : 'local');
        } catch (error) {
          console.error('Token verification failed:', error);
          // Try to refresh Keycloak token if applicable
          if (authMethod === 'keycloak' && keycloak) {
            try {
              const refreshed = await keycloak.updateToken(30);
              if (refreshed) {
                // Re-verify with new token
                const newToken = keycloak.token;
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                localStorage.setItem('token', newToken);
                const response = await axios.get('/auth/verify');
                setUser(response.data.user);
                setToken(newToken);
                return;
              }
            } catch (refreshError) {
              console.error('Keycloak token refresh failed:', refreshError);
            }
          }
          // If refresh failed, clear auth state
          setToken(null);
          setUser(null);
          setAuthMethod('local');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token, authMethod]);

  // Local login
  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;

      setToken(newToken);
      setUser(userData);
      setAuthMethod('local');

      // Store user type for redirect logic
      localStorage.setItem('userType', 'admin');

      return { success: true, user: userData };
    } catch (error) {
      const errorMsg = error.response?.data?.msg || 'Login failed';
      const requiresKeycloak = error.response?.data?.requiresKeycloak || false;
      return {
        success: false,
        error: errorMsg,
        requiresKeycloak
      };
    }
  };

  // Keycloak login for admin panel
  const loginWithKeycloak = useCallback(async () => {
    if (!keycloak || !isKeycloakConfigured()) {
      return { success: false, error: 'Keycloak is not configured' };
    }

    try {
      setLoading(true);

      // Authenticate with Keycloak
      const authenticated = await keycloak.init({
        onLoad: 'login-required',
        redirectUri: `${window.location.origin}/admin/auth/callback`,
        pkceMethod: 'S256',
        flow: 'standard'
      });

      if (authenticated) {
        const keycloakToken = keycloak.token;

        // Exchange Keycloak token for our JWT via backend
        // For admin panel, we can use a direct endpoint or the callback
        const response = await axios.post('/keycloak/callback', {}, {
          headers: {
            'Authorization': `Bearer ${keycloakToken}`
          }
        });

        if (response.data.token) {
          const newToken = response.data.token;
          setToken(newToken);
          setUser(response.data.user);
          setAuthMethod('keycloak');
          localStorage.setItem('token', newToken);
          localStorage.setItem('userType', 'admin');

          return { success: true, user: response.data.user };
        }
      }

      return { success: false, error: 'Keycloak authentication failed' };
    } catch (error) {
      console.error('Keycloak login error:', error);
      return { success: false, error: error.message || 'Keycloak login failed' };
    } finally {
      setLoading(false);
    }
  }, []);

  // Register function
  const register = async (name, email, password) => {
    try {
      const response = await axios.post('/auth/register', { name, email, password });
      const { token: newToken, user: userData } = response.data;

      setToken(newToken);
      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || 'Registration failed'
      };
    }
  };

  // Logout function
  const logout = useCallback(async () => {
    try {
      if (authMethod === 'keycloak' && keycloak) {
        // Logout from Keycloak
        await keycloak.logout({
          redirectUri: window.location.origin
        });
      }
    } catch (err) {
      console.error('Keycloak logout error:', err);
    }

    // Always clear local state
    setToken(null);
    setUser(null);
    setAuthMethod('local');
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
  }, [authMethod]);

  // Get token (with refresh if needed)
  const getToken = useCallback(async () => {
    if (authMethod === 'keycloak' && keycloak) {
      try {
        const refreshed = await keycloak.updateToken(30);
        if (refreshed) {
          // Update local token if Keycloak token was refreshed
          // This might be needed for some operations
          return keycloak.token;
        }
        return keycloak.token;
      } catch (err) {
        console.error('Token refresh error:', err);
        // If refresh fails, try to re-authenticate
        await loginWithKeycloak();
        return null;
      }
    }
    return token;
  }, [authMethod, token, loginWithKeycloak]);

  // Check if user is an admin
  const isAdmin = user?.role === 'admin';

  // Check if user is an employee or manager
  const isStaff = ['admin', 'manager', 'employee'].includes(user?.role);

  // Check if Keycloak is available
  const isKeycloakAvailable = isKeycloakConfigured();

  const value = {
    user,
    token,
    loading,
    login,
    loginWithKeycloak,
    register,
    logout,
    getToken,
    isAuthenticated: !!user && !!token,
    isAdmin,
    isStaff,
    userType: 'admin',
    authMethod,
    isKeycloakAvailable,
    isKeycloakUser: authMethod === 'keycloak'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;

