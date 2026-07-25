'use client';

import React from 'react';
import RevenueChart from '@/shared/components/charts/RevenueChart';
import OrderStatusChart from '@/shared/components/charts/OrderStatusChart';
import SalesByCategoryChart from '@/shared/components/charts/SalesByCategoryChart';
import CustomerChart from '@/shared/components/charts/CustomerChart';
import { FiTrendingUp, FiShoppingBag, FiUsers, FiDollarSign, FiCalendar, FiFilter } from 'react-icons/fi';

const AnalyticsDashboard = () => {
    // --- Mock Data for Charts ---
    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Projected Revenue',
                data: [45000, 48000, 52000, 55000, 58000, 62000, 65000, 68000, 72000, 75000, 78000, 82000],
                borderColor: 'var(--brand-primary)',
                backgroundColor: 'var(--brand-primary-light)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Actual Revenue',
                data: [38000, 42000, 40000, 48000, 52000, 50000, 58000, 62000, 61000, 70000, 74000, 79000],
                borderColor: '#0d6dfd',
                backgroundColor: 'rgba(13, 109, 253, 0.1)',
                fill: true,
                tension: 0.4,
            }
        ]
    };

    const orderStatusData = {
        labels: ['Completed', 'Pending', 'Processing', 'Cancelled', 'On Hold'],
        datasets: [
            {
                data: [65, 15, 10, 5, 5],
                backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#64748b'],
                borderWidth: 0,
            }
        ]
    };

    const salesByCategoryData = {
        labels: ['Electronics', 'Home & Kitchen', 'Beauty', 'Fashion', 'Others'],
        datasets: [
            {
                label: 'Sales (INR)',
                data: [45000, 25000, 15000, 10000, 5000],
                backgroundColor: [
                    'var(--brand-primary)',
                    'rgba(13, 109, 253, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(100, 116, 139, 0.8)'
                ],
            }
        ]
    };

    const customerData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'New Customers',
                data: [150, 230, 180, 290, 350, 420],
                borderColor: 'var(--brand-primary)',
                backgroundColor: 'transparent',
                borderWidth: 3,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: 'var(--brand-primary)',
                pointBorderWidth: 2,
                pointRadius: 5,
                tension: 0.3
            }
        ]
    };

    return (
        <div className="p-[30px] max-w-[1400px] mx-auto min-h-[90vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-primary to-brand-primary-dark text-white p-6.25 rounded-2xl shadow-lg mb-7.5 flex justify-between items-center border-none">
                <div>
                    <h1 className="m-0 mb-2 text-[32px] font-bold text-white">Analytics Dashboard</h1>
                    <p className="m-0 opacity-90 text-base">Comprehensive insights into your business performance</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white/20 border border-white text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold hover:bg-white/30 transition-all">
                        <FiCalendar /> Last 30 Days
                    </button>
                    <button className="bg-white border-none text-brand-primary-dark px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold hover:bg-gray-50 transition-all">
                        <FiFilter /> Filters
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-7.5">
                {[
                    { label: "Total Revenue", value: "₹1,24,592", change: "+12.5%", icon: <FiDollarSign />, color: "text-brand-primary", bg: "bg-brand-primary/10" },
                    { label: "Active Orders", value: "452", change: "+8.2%", icon: <FiShoppingBag />, color: "text-[#0d6dfd]", bg: "bg-[#0d6dfd]/10" },
                    { label: "New Customers", value: "1,284", change: "+5.4%", icon: <FiUsers />, color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/10" },
                    { label: "Conversion Rate", value: "3.2%", change: "-0.4%", icon: <FiTrendingUp />, color: "text-[#ef4444]", bg: "bg-[#ef4444]/10", down: true },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6.25 shadow-sm border border-gray-100 flex items-center gap-5 hover:-translate-y-1 transition-transform">
                        <div className={`w-15 h-15 rounded-[14px] ${stat.bg} ${stat.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                            {stat.icon}
                        </div>
                        <div>
                            <span className="text-gray-400 text-sm font-semibold">{stat.label}</span>
                            <h2 className="m-[4px_0] text-[28px] text-gray-800 font-bold">{stat.value}</h2>
                            <span className={`text-xs font-bold flex items-center gap-1 ${stat.down ? "text-[#ef4444]" : "text-[#10b981]"}`}>
                                <FiTrendingUp className={stat.down ? "rotate-180" : ""} /> {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
                <div className="bg-white rounded-2xl p-6.25 shadow-sm border border-gray-100 h-[450px]">
                    <RevenueChart data={revenueData} title="Revenue Trend" />
                </div>
                <div className="bg-white rounded-2xl p-6.25 shadow-sm border border-gray-100 h-[450px]">
                    <OrderStatusChart data={orderStatusData} />
                </div>
                <div className="bg-white rounded-2xl p-6.25 shadow-sm border border-gray-100 h-[450px]">
                    <SalesByCategoryChart data={salesByCategoryData} />
                </div>
                <div className="bg-white rounded-2xl p-6.25 shadow-sm border border-gray-100 h-[450px]">
                    <CustomerChart data={customerData} />
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
