'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import Link from 'next/link';

const LoginForm = () => {
    const router = useRouter();
    const { login, loginWithKeycloak, isKeycloakAvailable } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
        if (error) setError('');
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData.email, formData.password);

        if (result.success) {
            router.push("/");
        } else {
            if (result.requiresKeycloak) {
                setError('This account uses Keycloak. Please login with Keycloak SSO.');
            } else {
                setError(result.error || 'Login failed');
            }
        }
        setLoading(false);
    };

    const handleKeycloakLogin = async () => {
        setLoading(true);
        setError('');

        const result = await loginWithKeycloak();

        if (result.success) {
            router.push("/");
        } else {
            setError(result.error || 'Keycloak login failed');
        }
        setLoading(false);
    };

    return (
        <div className="p-10 bg-black/20 min-h-screen flex justify-center items-center font-sans -m-2.5">
            <div className="bg-white w-full max-w-[1200px] min-h-[600px] flex rounded-[20px] shadow-[0_8px_32px_0_rgba(123,203,196,0.2)] overflow-hidden">

                {/* Left Column */}
                <div className="flex-1 bg-brand-primary p-10 flex flex-col justify-between color-white text-white">
                    <div className="text-[28px] font-black mb-10">prodify</div>

                    <div>
                        <h1 className="text-4xl font-bold mb-4">Modern Login Experience</h1>
                        <p className="text-lg opacity-90">Access your productivity tools instantly. Enter your credentials to continue.</p>
                    </div>

                    <p className="text-xs opacity-80">© 2025 prodify. All rights reserved.</p>
                </div>

                {/* Right Column */}
                <div className="w-[400px] p-10 flex flex-col justify-center text-left">
                    <h2 className="text-brand-primary text-2xl font-semibold mb-2.5">Welcome Back</h2>

                    <p className="mb-[30px] text-sm text-gray-600">
                        Sign in to your prodify account.
                    </p>

                    {error && (
                        <div className="bg-[#ffebee] text-[#c62828] p-3 rounded-lg mb-5 text-sm border border-[#ffcdd2]">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 my-2 mb-5 border border-gray-300 rounded-lg text-base outline-none focus:border-brand-primary transition-all"
                            placeholder="you@example.com"
                            required
                        />

                        <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 my-2 mb-5 border border-gray-300 rounded-lg text-base outline-none focus:border-brand-primary transition-all"
                            placeholder="Enter your password"
                            required
                        />

                        <Link
                            href="/forgot-password"
                            className="text-sm text-brand-primary hover:underline block mb-5"
                        >
                            Forgot Password?
                        </Link>

                        <button
                            type="submit"
                            className="w-full p-[15px] mt-5 text-lg font-bold text-white bg-brand-primary rounded-lg cursor-pointer hover:bg-brand-primary-dark transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Logging In...' : 'Log In'}
                        </button>

                        {isKeycloakAvailable && (
                            <button
                                type="button"
                                onClick={handleKeycloakLogin}
                                className="w-full p-[15px] mt-2.5 text-base font-semibold text-white bg-[#667eea] rounded-lg cursor-pointer hover:bg-[#5a6fd6] transition-colors flex items-center justify-center gap-2.5 disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : '🔐 Sign in with Keycloak SSO'}
                            </button>
                        )}

                        <p className="text-center mt-5 text-sm text-gray-600">
                            Don't have an account? <Link href="/signup" className="text-brand-primary hover:underline">Sign Up</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
