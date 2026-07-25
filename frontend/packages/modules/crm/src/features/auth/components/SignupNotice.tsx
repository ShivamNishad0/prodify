'use client';

import React from 'react';
import Link from 'next/link';

const SignupNotice = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5 font-sans">
            <div className="bg-white w-full max-w-[1000px] min-h-[500px] rounded-3xl shadow-2xl flex overflow-hidden border border-gray-100">
                {/* Left Column */}
                <div className="hidden lg:flex flex-1 bg-brand-primary p-12 flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 backdrop-blur-3xl"></div>
                    <div className="text-3xl font-black tracking-tighter">prodify</div>

                    <div className="relative z-10">
                        <h1 className="text-5xl font-bold mb-6 leading-tight">Secure Account Creation</h1>
                        <p className="text-brand-primary-light text-xl leading-relaxed opacity-90">Account creation is restricted to administrators only to ensure the highest level of security and access control for our enterprise environment.</p>
                    </div>

                    <div className="text-xs font-bold opacity-50 uppercase tracking-widest">© 2025 prodify. Enterprise CRM Solution.</div>
                </div>

                {/* Right Column */}
                <div className="w-full lg:w-[450px] p-12 flex flex-col justify-center">
                    <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-sm">⚠️</div>

                    <h2 className="text-brand-primary text-3xl font-bold mb-4">Admin-Only Access</h2>

                    <p className="text-gray-400 text-sm leading-relaxed mb-10">
                        Public registration has been disabled. Only system administrators can provision new user accounts through the central management portal.
                    </p>

                    <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl mb-10">
                        <div className="font-bold text-amber-800 mb-2 flex items-center gap-2">Need an account?</div>
                        <p className="text-amber-700/80 text-sm leading-relaxed">Please contact your organization's system administrator or IT department to request a new account.</p>
                    </div>

                    <Link
                        href="/login"
                        className="w-full py-4 bg-brand-primary text-white text-center font-bold rounded-xl shadow-lg shadow-brand-primary-dark/30 hover:bg-brand-primary-dark hover:-translate-y-0.5 transition-all text-lg"
                    >
                        Return to Login
                    </Link>

                    <p className="text-center mt-8 text-sm font-bold text-gray-300 uppercase tracking-widest">
                        Already have access? <Link href="/login" className="text-brand-primary hover:underline decoration-2 underline-offset-4 ml-2">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignupNotice;
