'use client';

import React from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';

export default function ProdifySelectionPage() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
                {/* Background Network Graphic Simulation */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                    <div className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] rounded-full border border-teal-100/50"></div>
                    <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] rounded-full border border-teal-200/50"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[900px] h-[900px] rounded-full border border-teal-100/30"></div>
                    
                    {/* Glowing Nodes */}
                    <div className="absolute top-[20%] left-[15%] w-2 h-2 bg-teal-300 rounded-full shadow-[0_0_10px_rgba(94,234,212,0.8)]"></div>
                    <div className="absolute top-[35%] right-[25%] w-3 h-3 bg-teal-400 rounded-full shadow-[0_0_15px_rgba(45,212,191,0.6)]"></div>
                    <div className="absolute bottom-[25%] left-[30%] w-1.5 h-1.5 bg-teal-300 rounded-full shadow-[0_0_8px_rgba(94,234,212,0.5)]"></div>
                    <div className="absolute bottom-[40%] right-[15%] w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.7)]"></div>
                </div>

                <div className="relative z-10 text-center mb-16 max-w-4xl mx-auto flex flex-col items-center">
                    {/* Pill Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-200 bg-white shadow-sm mb-8">
                        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                        <span className="text-xs font-bold text-teal-600 tracking-widest uppercase">Select Your Workspace</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl lg:text-[5rem] font-black text-gray-900 mb-6 tracking-tighter leading-[1.1]">
                        The ultimate platform <br className="hidden md:block"/> for modern teams
                    </h1>
                    
                    <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
                        Streamline your workflow, manage resources, and grow your business with our intuitive, unified platform.
                    </p>
                </div>
                
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl w-full px-4">
                    {/* CRM Card */}
                    <Link href="/prodify/crm" className="group block">
                        <div className="h-full bg-white rounded-[2rem] p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col relative overflow-hidden">
                            {/* Accent Blob */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-50 rounded-full blur-3xl group-hover:bg-teal-100 transition-colors duration-500"></div>

                            <div className="w-16 h-16 bg-teal-50 text-teal-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                            </div>
                            
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">CRM System</h2>
                            <p className="text-gray-500 mb-10 leading-relaxed font-medium flex-grow text-lg">Manage customer relationships, orchestrate sales pipelines, and optimize business operations.</p>
                            
                            <div className="mt-auto">
                                <span className="inline-flex items-center justify-center bg-[#6FDCD1] text-white font-bold px-6 py-3 rounded-full shadow-[0_4px_14px_0_rgba(111,220,209,0.39)] hover:shadow-[0_6px_20px_rgba(111,220,209,0.23)] hover:bg-[#5EBEB4] transition-all duration-300 w-full md:w-auto">
                                    Get Started
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* HRMS Card */}
                    <Link href="/prodify/hrms/head-office" className="group block">
                        <div className="h-full bg-white rounded-[2rem] p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col relative overflow-hidden">
                            {/* Accent Blob */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl group-hover:bg-emerald-100 transition-colors duration-500"></div>

                            <div className="w-16 h-16 bg-white border border-gray-200 text-gray-700 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">HRMS Portal</h2>
                            <p className="text-gray-500 mb-10 leading-relaxed font-medium flex-grow text-lg">Access comprehensive human resources tools including payroll, attendance, and employee management.</p>
                            
                            <div className="mt-auto">
                                <span className="inline-flex items-center justify-center bg-white border border-gray-200 text-gray-700 font-bold px-6 py-3 rounded-full hover:bg-gray-50 hover:shadow-sm transition-all duration-300 w-full md:w-auto">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Open Portal
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </ProtectedRoute>
    );
}
