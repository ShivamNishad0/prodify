'use client';

import React, { useState } from 'react';
import { FiShoppingBag, FiTruck, FiCheckCircle, FiXCircle, FiClock, FiEye } from 'react-icons/fi';

const OrderManagement = () => {
    const [activeTab, setActiveTab] = useState('All');

    const orders = [
        { id: 'ORD-7721', customer: 'John Doe', date: '2024-03-15', status: 'Delivered', items: 3, total: '₹4,500', payment: 'Paid' },
        { id: 'ORD-7722', customer: 'Jane Smith', date: '2024-03-14', status: 'Processing', items: 1, total: '₹1,250', payment: 'Paid' },
        { id: 'ORD-7723', customer: 'Robert Brown', date: '2024-03-14', status: 'Shipped', items: 5, total: '₹12,000', payment: 'Paid' },
        { id: 'ORD-7724', customer: 'Alice Wilson', date: '2024-03-13', status: 'Pending', items: 2, total: '₹3,200', payment: 'Unpaid' },
        { id: 'ORD-7725', customer: 'Charlie Davis', date: '2024-03-12', status: 'Cancelled', items: 1, total: '₹1,500', payment: 'Refunded' },
    ];

    const statusColors: any = {
        'Delivered': { bg: 'bg-green-50', text: 'text-green-700', icon: <FiCheckCircle /> },
        'Processing': { bg: 'bg-blue-50', text: 'text-blue-700', icon: <FiClock /> },
        'Shipped': { bg: 'bg-amber-50', text: 'text-amber-700', icon: <FiTruck /> },
        'Pending': { bg: 'bg-gray-50', text: 'text-gray-700', icon: <FiClock /> },
        'Cancelled': { bg: 'bg-red-50', text: 'text-red-700', icon: <FiXCircle /> },
    };

    return (
        <div className="p-7.5 max-w-[1400px] mx-auto min-h-[90vh]">
            <div className="bg-gradient-to-r from-brand-primary to-brand-primary-dark text-white p-6.25 rounded-[15px] shadow-lg mb-6.25">
                <h1 className="m-0 mb-2.5 text-[32px] font-bold">Orders</h1>
                <p className="m-0 opacity-90">Manage and track customer orders</p>
            </div>

            <div className="flex gap-4 mb-6.25 overflow-x-auto pb-2">
                {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 rounded-full font-semibold whitespace-nowrap transition-all duration-200 shadow-sm ${activeTab === tab ? 'bg-brand-primary text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-[15px] shadow-md border border-gray-200 p-2.5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-left border-b-2 border-gray-50 text-gray-400 text-sm">
                                <th className="p-[15px]">Order ID</th>
                                <th className="p-[15px]">Customer</th>
                                <th className="p-[15px]">Date</th>
                                <th className="p-[15px]">Status</th>
                                <th className="p-[15px]">Items</th>
                                <th className="p-[15px]">Total</th>
                                <th className="p-[15px]">Payment</th>
                                <th className="p-[15px]">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-[15px] font-bold text-brand-primary">{order.id}</td>
                                    <td className="p-[15px] font-medium text-gray-800">{order.customer}</td>
                                    <td className="p-[15px] text-gray-500">{order.date}</td>
                                    <td className="p-[15px]">
                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold w-fit ${statusColors[order.status].bg} ${statusColors[order.status].text}`}>
                                            {statusColors[order.status].icon}
                                            {order.status}
                                        </div>
                                    </td>
                                    <td className="p-[15px] text-gray-500">{order.items} Items</td>
                                    <td className="p-[15px] font-bold text-gray-800">{order.total}</td>
                                    <td className="p-[15px]">
                                        <span className={`text-xs font-bold flex items-center gap-1 ${order.payment === 'Paid' ? 'text-green-700' : 'text-red-700'}`}>
                                            <span className="w-2 h-2 rounded-full bg-current" />
                                            {order.payment}
                                        </span>
                                    </td>
                                    <td className="p-[15px]">
                                        <button className="bg-transparent border border-gray-200 rounded-md p-1.5 text-gray-400 hover:text-brand-primary hover:border-brand-primary transition-colors">
                                            <FiEye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderManagement;
