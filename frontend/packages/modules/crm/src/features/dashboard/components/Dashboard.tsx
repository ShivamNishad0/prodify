'use client';

import React, { useState } from "react";
import Footer from "@/shared/components/Footer";
import RevenueChart from "@/shared/components/charts/RevenueChart";
import CustomerChart from "@/shared/components/charts/CustomerChart";
import SalesByCategoryChart from "@/shared/components/charts/SalesByCategoryChart";
import OrderStatusChart from "@/shared/components/charts/OrderStatusChart";
import {
    generateRevenueData,
    generateCustomerData,
    generateOrderStatusData,
    generateSalesByCategoryData,
} from "@/core/utils/dataHelpers";

const Dashboard = () => {
    const [timeRange, setTimeRange] = useState("This Month");

    const revenueData = generateRevenueData();
    const customerData = generateCustomerData();
    const orderStatusData = generateOrderStatusData();
    const categoryData = generateSalesByCategoryData();

    const KPI_DATA = [
        { id: "total-cust", label: "Total Customer", value: 1247 },
        { id: "active-cust", label: "Active Customer", value: 892 },
        { id: "new-cust", label: "New Customer", value: 156 },
        { id: "rev-month", label: "Revenue This Month", value: 45780, isCurrency: true },
    ];

    return (
        <div className="p-5 min-h-screen font-sans">
            <h2 className="text-2xl font-semibold mb-5 text-gray-800">
                Business Overview
            </h2>

            {/* Filters */}
            <div className="flex gap-2.5 mb-5">
                {["Today", "This Week", "This Month"].map((range) => (
                    <button
                        key={range}
                        className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 ${timeRange === range
                            ? "bg-brand-primary text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        onClick={() => setTimeRange(range)}
                    >
                        {range}
                    </button>
                ))}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7.5">
                {KPI_DATA.map((item) => (
                    <div key={item.id} className="h-[120px] bg-white rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(60,178,168,0.59)] flex flex-col justify-center items-center text-center">
                        <p className="text-2xl font-bold m-0">
                            {item.isCurrency ? `₹ ${item.value.toLocaleString()}` : item.value.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 m-0">
                            {item.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-5 h-[450px]">
                    <RevenueChart data={revenueData} title="Revenue Analysis" />
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-5 h-[450px]">
                    <OrderStatusChart data={orderStatusData} />
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-5 h-[450px]">
                    <CustomerChart data={customerData} />
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-5 h-[450px]">
                    <SalesByCategoryChart data={categoryData} />
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Dashboard;
