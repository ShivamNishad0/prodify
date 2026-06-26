'use client';

import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import apiClient from '../core/api/client';
import keycloak, { isKeycloakConfigured } from '../core/config/keycloak';

interface User {
    id: string;
    _id?: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    phone?: string;
    address?: string;
    city?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string; requiresKeycloak?: boolean; user?: User }>;
    loginWithKeycloak: () => Promise<{ success: boolean; error?: string; user?: User }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    getToken: () => Promise<string | null>;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isStaff: boolean;
    userType: string;
    authMethod: 'local' | 'keycloak';
    isKeycloakAvailable: boolean;
    isKeycloakUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let keycloakInitPromise: Promise<boolean> | null = null;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    const [authMethod, setAuthMethod] = useState<'local' | 'keycloak'>('local');

    // Handle token changes and persist to localStorage
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    // Check authentication status on mount
    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const response = await apiClient.get('/auth/verify');
                    setUser(response.data.user);
                    setAuthMethod(response.data.authProvider === 'keycloak' ? 'keycloak' : 'local');
                } catch (error) {
                    console.error('Token verification failed:', error);

                    if (authMethod === 'keycloak' && keycloak && typeof keycloak.updateToken === 'function') {
                        try {
                            const refreshed = await keycloak.updateToken(30);
                            if (refreshed) {
                                const newToken = keycloak.token!;
                                setToken(newToken);
                                const response = await apiClient.get('/auth/verify', {
                                    headers: { Authorization: `Bearer ${newToken}` }
                                });
                                setUser(response.data.user);
                                return;
                            }
                        } catch (refreshError) {
                            console.error('Keycloak token refresh failed:', refreshError);
                        }
                    }

                    setToken(null);
                    setUser(null);
                    setAuthMethod('local');
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, [token, authMethod]);

    const login = async (email: string, password: string) => {
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            const { token: newToken, user: userData } = response.data;

            setToken(newToken);
            setUser(userData);
            setAuthMethod('local');
            localStorage.setItem('userType', 'admin');

            return { success: true, user: userData };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.msg || 'Login failed',
                requiresKeycloak: error.response?.data?.requiresKeycloak || false
            };
        }
    };

    const loginWithKeycloak = useCallback(async () => {
        if (!keycloak || !isKeycloakConfigured()) {
            return { success: false, error: 'Keycloak is not configured' };
        }

        try {
            setLoading(true);
            if (!keycloakInitPromise) {
                keycloakInitPromise = keycloak.init({
                    onLoad: 'login-required',
                    redirectUri: `${window.location.origin}/admin/auth/callback`,
                    pkceMethod: 'S256',
                    flow: 'standard'
                });
            }
            const authenticated = await keycloakInitPromise;

            if (authenticated) {
                const keycloakToken = keycloak.token;
                const response = await apiClient.post('/keycloak/callback', {}, {
                    headers: { 'Authorization': `Bearer ${keycloakToken}` }
                });

                if (response.data.token) {
                    const newToken = response.data.token;
                    setToken(newToken);
                    setUser(response.data.user);
                    setAuthMethod('keycloak');
                    localStorage.setItem('userType', 'admin');
                    return { success: true, user: response.data.user };
                }
            }
            return { success: false, error: 'Keycloak authentication failed' };
        } catch (error: any) {
            console.error('Keycloak login error:', error);
            return { success: false, error: error.message || 'Keycloak login failed' };
        } finally {
            setLoading(false);
        }
    }, []);

    const register = async (name: string, email: string, password: string) => {
        try {
            const response = await apiClient.post('/auth/register', { name, email, password });
            const { token: newToken, user: userData } = response.data;
            setToken(newToken);
            setUser(userData);
            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.msg || 'Registration failed'
            };
        }
    };

    const logout = useCallback(async () => {
        try {
            if (authMethod === 'keycloak' && keycloak && typeof keycloak.logout === 'function') {
                await keycloak.logout({ redirectUri: window.location.origin });
            }
        } catch (err) {
            console.error('Keycloak logout error:', err);
        }

        setToken(null);
        setUser(null);
        setAuthMethod('local');
        localStorage.removeItem('userType');
    }, [authMethod]);

    const getToken = useCallback(async () => {
        if (authMethod === 'keycloak' && keycloak && typeof keycloak.updateToken === 'function') {
            try {
                const refreshed = await keycloak.updateToken(30);
                return keycloak.token || null;
            } catch (err) {
                console.error('Token refresh error:', err);
                await loginWithKeycloak();
                return null;
            }
        }
        return token;
    }, [authMethod, token, loginWithKeycloak]);

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
        isAdmin: user?.role === 'admin',
        isStaff: ['admin', 'manager', 'employee'].includes(user?.role || ''),
        userType: 'admin',
        authMethod,
        isKeycloakAvailable: isKeycloakConfigured(),
        isKeycloakUser: authMethod === 'keycloak'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
