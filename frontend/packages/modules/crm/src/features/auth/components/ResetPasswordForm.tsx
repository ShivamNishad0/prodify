'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/core/api/client';
import { FiLock, FiCheckCircle, FiAlertCircle, FiShield, FiArrowRight } from 'react-icons/fi';

const ResetPasswordForm = ({ token }: { token: string }) => {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [validating, setValidating] = useState(true);
    const [isValidToken, setIsValidToken] = useState(true);

    useEffect(() => {
        if (token) {
            validateToken();
        } else {
            setIsValidToken(false);
            setValidating(false);
        }
    }, [token]);

    const validateToken = async () => {
        try {
            // Just check if token is valid by attempting a verification call or similar
            // The API might use the same POST endpoint with a flag, or have a specific GET handler
            // Based on original code, it was doing a POST with 'temp' password
            await apiClient.post(`/auth/reset-password/${token}`, { password: 'verification_only' });
        } catch (err: any) {
            if (err.response?.status === 400 && err.response?.data?.msg?.includes('Invalid or expired')) {
                setIsValidToken(false);
            }
        } finally {
            setValidating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            await apiClient.post(`/auth/reset-password/${token}`, { password });
            setMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.msg || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (validating) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-5">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-brand-primary rounded-full animate-spin"></div>
                <p className="mt-5 text-gray-400 font-bold uppercase tracking-widest text-xs">Authenticating link...</p>
            </div>
        );
    }

    if (!isValidToken) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5 font-sans">
                <div className="bg-white w-full max-w-[500px] p-12 rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-3xl mb-8">⚠️</div>
                    <h2 className="text-gray-800 text-2xl font-bold mb-3">Expired Link</h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-10">This password reset link is invalid or has expired. Please request a new one.</p>

                    <Link href="/forgot-password" className="w-full py-4 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary-dark/20 hover:bg-brand-primary-dark transition-all mb-6 flex items-center justify-center gap-2">
                        Request New Link <FiArrowRight />
                    </Link>

                    <Link href="/login" className="text-gray-400 font-bold uppercase tracking-widest text-[11px] hover:text-gray-600 transition-colors">Back to Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5 font-sans">
            <div className="bg-white w-full max-w-[500px] p-12 rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center">
                <Link href="/" className="text-3xl font-black text-brand-primary tracking-tighter mb-8">prodify</Link>

                <h2 className="text-gray-800 text-2xl font-bold mb-3 text-center">Set New Password</h2>
                <p className="text-gray-400 text-center text-sm leading-relaxed mb-10">Your identity has been verified. Choose a strong new password below.</p>

                {message && (
                    <div className="w-full bg-green-50 border border-green-100 text-green-700 p-4 rounded-xl mb-8 flex items-center gap-3 font-medium text-sm">
                        <FiCheckCircle className="flex-shrink-0" /> {message}
                    </div>
                )}

                {error && (
                    <div className="w-full bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl mb-8 flex items-center gap-3 font-medium text-sm">
                        <FiAlertCircle className="flex-shrink-0" /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-6">
                        <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest pl-1">New Password</label>
                        <div className="relative">
                            <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-xl outline-none focus:border-brand-primary focus:bg-white transition-all text-sm"
                                placeholder="••••••••"
                                required
                                disabled={loading}
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div className="mb-10">
                        <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest pl-1">Confirm Password</label>
                        <div className="relative">
                            <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-xl outline-none focus:border-brand-primary focus:bg-white transition-all text-sm"
                                placeholder="••••••••"
                                required
                                disabled={loading}
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary-dark/20 hover:bg-brand-primary-dark hover:-translate-y-0.5 transition-all disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPasswordForm;
