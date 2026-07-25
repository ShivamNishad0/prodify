'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import apiClient from '@/core/api/client';
import { FiMail, FiArrowLeft, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await apiClient.post('/auth/forgot-password', { email });
            setMessage(response.data.msg);
            setEmail('');
        } catch (err: any) {
            setError(err.response?.data?.msg || 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5 font-sans">
            <div className="bg-white w-full max-w-[500px] p-10 sm:p-12 rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center">
                <Link href="/" className="text-3xl font-black text-brand-primary tracking-tighter mb-8">prodify</Link>

                <h2 className="text-gray-800 text-2xl font-bold mb-3 text-center">Reset Password</h2>
                <p className="text-gray-400 text-center text-sm leading-relaxed mb-10 max-w-[320px]">
                    Enter your email address and we'll send you a secure link to reset your credentials.
                </p>

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
                        <label htmlFor="email" className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest pl-1">Email Address</label>
                        <div className="relative">
                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-xl outline-none focus:border-brand-primary focus:bg-white transition-all text-sm"
                                placeholder="you@example.com"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-4 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary-dark/20 hover:bg-brand-primary-dark hover:-translate-y-0.5 transition-all mb-6 disabled:opacity-50 disabled:cursor-not-allowed`}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Send Reset Link'}
                    </button>
                </form>

                <Link
                    href="/login"
                    className="flex items-center gap-2 text-brand-primary text-sm font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
                >
                    <FiArrowLeft /> Back to Login
                </Link>
            </div>
        </div>
    );
}

export default ForgotPasswordForm;
