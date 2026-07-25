'use client';

import React, { useState } from 'react';
import { FiPackage, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

const Inventory = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const inventoryItems = [
        { id: 1, name: 'Saffron Incense Sticks', sku: 'SIS-001', category: 'Incense', stock: 124, price: '₹1,000', status: 'In Stock' },
        { id: 2, name: 'Sandalwood Cones', sku: 'SWC-042', category: 'Cones', stock: 12, price: '₹1,250', status: 'Low Stock' },
        { id: 3, name: 'Natural Dhoop Batti', sku: 'NDB-089', category: 'Dhoop', stock: 0, price: '₹850', status: 'Out of Stock' },
        { id: 4, name: 'Jasmine Agar Sticks', sku: 'JAS-112', category: 'Agarbatti', stock: 450, price: '₹650', status: 'In Stock' },
        { id: 5, name: 'Rose Petal Cones', sku: 'RPC-205', category: 'Cones', stock: 85, price: '₹1,150', status: 'In Stock' },
    ];

    const badgeStyle = (stock: number) => {
        let color = '#2e7d32';
        let bg = '#e8f5e8';
        if (stock === 0) { color = '#c62828'; bg = '#ffebee'; }
        else if (stock < 50) { color = '#f59e0b'; bg = '#fffbeb'; }

        return {
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            backgroundColor: bg,
            color: color
        };
    };

    return (
        <div className="p-7.5 max-w-[1400px] mx-auto min-h-[90vh]">
            <div className="bg-gradient-to-r from-brand-primary to-brand-primary-dark text-white p-6.25 rounded-[15px] shadow-lg mb-6.25 border border-gray-200">
                <h1 className="m-0 mb-2.5 text-[32px] font-bold">Inventory Management</h1>
                <p className="m-0 opacity-90">Monitor stock levels and manage order fulfillment</p>
            </div>

            <div className="flex gap-5 mb-7.5 flex-wrap">
                {[
                    { label: "Total Items", value: "1,284" },
                    { label: "Low Stock Items", value: "12", color: "text-[#f59e0b]" },
                    { label: "Out of Stock", value: "5", color: "text-[#c62828]" },
                    { label: "Inventory Value", value: "₹45,820" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 flex-1 min-w-[200px] shadow-sm">
                        <div className="text-sm text-gray-500 mb-2">{stat.label}</div>
                        <div className={`text-2xl font-bold ${stat.color || 'text-gray-800'}`}>{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-xl p-5 flex items-center gap-[15px] mb-[30px] text-[#92400e]">
                <FiAlertTriangle size={24} />
                <div>
                    <div className="font-bold">Stock Warning</div>
                    <div className="text-sm">There are 12 items currently running low on stock. Consider restocking soon.</div>
                </div>
            </div>

            <div className="bg-white rounded-[15px] shadow-md border border-gray-200 p-2.5 mb-6.25">
                <div className="p-[15px] flex justify-between items-center">
                    <h3 className="m-0 text-lg font-semibold text-gray-800">Stock List</h3>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-brand-primary bg-transparent text-brand-primary cursor-pointer hover:bg-brand-primary/5 transition-colors">
                        <FiRefreshCw /> Refresh Sync
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-left border-b-2 border-gray-50 text-gray-500 text-sm">
                                <th className="p-[15px]">Product</th>
                                <th className="p-[15px]">SKU</th>
                                <th className="p-[15px]">Category</th>
                                <th className="p-[15px]">Price</th>
                                <th className="p-[15px]">Stock Level</th>
                                <th className="p-[15px]">Status</th>
                                <th className="p-[15px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventoryItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-[15px] font-medium text-gray-800">{item.name}</td>
                                    <td className="p-[15px] text-gray-500 text-[13px]">{item.sku}</td>
                                    <td className="p-[15px] text-gray-500">{item.category}</td>
                                    <td className="p-[15px] text-gray-800 font-medium">{item.price}</td>
                                    <td className="p-[15px]">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-[100px] bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-300 ${item.stock < 50 ? 'bg-[#f59e0b]' : 'bg-brand-primary'}`}
                                                    style={{ width: `${Math.min(100, (item.stock / 500) * 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-[13px] font-bold text-gray-700">{item.stock}</span>
                                        </div>
                                    </td>
                                    <td className="p-[15px]">
                                        <span style={badgeStyle(item.stock)}>{item.status}</span>
                                    </td>
                                    <td className="p-[15px]">
                                        <div className="flex gap-2.5">
                                            <button className="text-brand-primary border-none bg-transparent cursor-pointer font-medium hover:underline">Adjust</button>
                                            <button className="text-gray-500 border-none bg-transparent cursor-pointer font-medium hover:underline">History</button>
                                        </div>
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

export default Inventory;
