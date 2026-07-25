'use client';


import React from 'react';
import { FiCheck, FiInfo, FiLayers, FiCpu, FiServer, FiGlobe } from 'react-icons/fi';

const AboutSystem = () => {
    return (
        <div className="p-7.5 max-w-[1200px] mx-auto min-h-[90vh]">
            <div className="bg-gradient-to-r from-brand-primary to-brand-primary-dark text-white p-12 rounded-2xl shadow-lg mb-7.5 border-none text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6"><FiInfo size={32} /></div>
                <h1 className="m-0 mb-3 text-4xl font-bold tracking-tight">Prodify CRM</h1>
                <p className="m-0 opacity-80 text-lg max-w-2xl mx-auto">Empowering businesses through intelligent relationship management and data-driven insights</p>
            </div>

            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 mb-7.5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary-light/10 rounded-full -mr-32 -mt-32 opacity-30" />
                <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-3"><span className="w-8 h-1 bg-brand-primary rounded-full" /> Our Mission</h2>
                <p className="text-gray-500 text-lg leading-relaxed relative z-10">
                    Welcome to Prodify CRM. This comprehensive platform is designed to help businesses manage their customer interactions,
                    track sales, and analyze performance effectively. Our goal is to provide a seamless experience that drives growth
                    and operational efficiency for modern enterprises.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7.5 mb-7.5">
                {[
                    { title: 'Core Features', icon: <FiLayers />, color: 'bg-brand-primary-light/20 text-brand-primary', items: ['Customer Profiles', 'Inventory Control', 'Order Tracking', 'Sales Analytics', 'Business Reports'] },
                    { title: 'Architecture', icon: <FiCpu />, color: 'bg-blue-50 text-blue-600', text: 'Built with a modern organization-level architecture using Next.js 15, TypeScript, and high-performance API patterns.' },
                    { title: 'Information', icon: <FiInfo />, color: 'bg-amber-50 text-amber-600', text: 'Current Version: v2.0.0 (Next.js Migration)\nStatus: Stable Production Build\nLicense: Enterprise' },
                ].map((card, i) => (
                    <div key={i} className="bg-white p-7.5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${card.color}`}>{card.icon}</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">{card.title}</h3>
                        {card.items ? (
                            <ul className="text-gray-500 text-sm space-y-2 mt-auto">
                                {card.items.map(item => <li key={item} className="flex items-center gap-2 justify-center"><FiCheck className="text-brand-primary" /> {item}</li>)}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line mt-auto">{card.text}</p>
                        )}
                    </div>
                ))}
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-primary font-bold">25</div>
                    <div>
                        <div className="text-sm font-bold text-gray-800 uppercase tracking-widest leading-tight">Global Infrastructure</div>
                        <div className="text-xs text-gray-400 font-bold uppercase tracking-tighter mt-1 flex items-center gap-1.5"><FiGlobe /> Nodes Active Globally</div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <span className="px-5 py-2 bg-white rounded-lg text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-gray-200">System v2.0.0</span>
                    <span className="px-5 py-2 bg-brand-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-brand-primary-dark/20">Uptime 99.9%</span>
                </div>
            </div>
        </div>
    );
};

export default AboutSystem;
