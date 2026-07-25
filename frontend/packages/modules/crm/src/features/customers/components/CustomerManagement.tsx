'use client';

import React, { useState } from 'react';
import { FiSearch, FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const CustomerManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const customers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+91 98765 43210', status: 'Active', location: 'Mumbai, India', totalOrders: 12, spent: '₹1,24,000' },
        { id: 2, name: 'Jane Smith', email: 'jane@microsoft.com', phone: '+91 87654 32109', status: 'Active', location: 'Delhi, India', totalOrders: 8, spent: '₹85,000' },
        { id: 3, name: 'Robert Brown', email: 'robert@amazon.com', phone: '+91 76543 21098', status: 'Inactive', location: 'Bangalore, India', totalOrders: 3, spent: '₹21,000' },
        { id: 4, name: 'Alice Wilson', email: 'alice@google.com', phone: '+91 65432 10987', status: 'Active', location: 'Pune, India', totalOrders: 15, spent: '₹2,10,000' },
        { id: 5, name: 'Charlie Davis', email: 'charlie@netflix.com', phone: '+91 54321 09876', status: 'Active', location: 'Hyderabad, India', totalOrders: 6, spent: '₹54,000' },
    ];

    return (
        <div className="p-7.5 max-w-[1400px] mx-auto min-h-[90vh]">
            <div className="bg-gradient-to-r from-brand-primary to-brand-primary-dark text-white p-6.25 rounded-[15px] shadow-lg mb-6.25">
                <h1 className="m-0 mb-2.5 text-[32px] font-bold">Customer Management</h1>
                <p className="m-0 opacity-90">View and manage your customer database</p>
            </div>

            <div className="bg-white rounded-[15px] p-6.25 shadow-md border border-gray-200 flex justify-between items-center gap-5 flex-wrap mb-6.25">
                <div className="relative">
                    <FiSearch className="absolute left-[15px] top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg w-80 text-sm outline-none focus:border-brand-primary transition-colors"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2.5">
                    {['All', 'Active', 'Inactive'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 rounded-lg border border-gray-200 font-semibold text-sm transition-all duration-200 ${activeFilter === filter ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-[15px] shadow-md border border-gray-200 p-2.5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-left border-b-2 border-gray-50 text-gray-400 text-sm">
                                <th className="p-[15px]">Customer</th>
                                <th className="p-[15px]">Contact Info</th>
                                <th className="p-[15px]">Location</th>
                                <th className="p-[15px]">Status</th>
                                <th className="p-[15px]">Orders</th>
                                <th className="p-[15px]">Total Spent</th>
                                <th className="p-[15px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(customer => (
                                <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-[15px]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-primary-light/10 flex items-center justify-center text-brand-primary">
                                                <FiUser size={20} />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-800">{customer.name}</div>
                                                <div className="text-[12px] text-gray-400">#CUST-{customer.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-[15px]">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-[13px] text-gray-600">
                                                <FiMail size={14} /> {customer.email}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[13px] text-gray-600">
                                                <FiPhone size={14} /> {customer.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-[15px]">
                                        <div className="flex items-center gap-1.5 text-[13px] text-gray-600">
                                            <FiMapPin size={14} /> {customer.location}
                                        </div>
                                    </td>
                                    <td className="p-[15px]">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${customer.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="p-[15px] text-gray-800 font-medium">{customer.totalOrders}</td>
                                    <td className="p-[15px] text-gray-800 font-bold">{customer.spent}</td>
                                    <td className="p-[15px]">
                                        <button className="bg-transparent border-none text-brand-primary cursor-pointer font-bold text-sm hover:underline">View Details</button>
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

export default CustomerManagement;
