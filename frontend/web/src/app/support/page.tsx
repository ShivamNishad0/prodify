'use client';

import SupportCenter from "@/features/support/components/SupportCenter";

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-slate-50/30">
            <div className="max-w-[1400px] mx-auto pt-12">
                <div className="px-4 text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        How can we <span className="text-brand-primary">help?</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Connect with our support team or share your ideas on how we can make Prodify better for you.
                    </p>
                </div>
                <SupportCenter />
            </div>
        </div>
    );
}
