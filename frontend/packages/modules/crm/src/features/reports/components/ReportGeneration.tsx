'use client';

import React from 'react';
import { FiFileText, FiDownload, FiTrendingUp, FiBox, FiUsers, FiCalendar } from 'react-icons/fi';

const ReportGeneration = () => {
    const reportTypes = [
        { title: 'Sales Report', description: 'Detailed breakdown of sales performance and revenue.', icon: <FiTrendingUp />, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
        { title: 'Inventory Analytics', description: 'Stock levels, turnover rates, and valuation.', icon: <FiBox />, color: 'text-blue-500', bg: 'bg-blue-50' },
        { title: 'Customer Insights', description: 'Demographics, behavior, and lifetime value.', icon: <FiUsers />, color: 'text-amber-500', bg: 'bg-amber-50' },
        { title: 'Tax & Compliance', description: 'GST reports and financial compliance data.', icon: <FiFileText />, color: 'text-red-500', bg: 'bg-red-50' },
    ];

    const recentReports = [
        { name: 'Monthly_Sales_Jan_2024.pdf', date: '2024-02-01', size: '2.4 MB', type: 'PDF' },
        { name: 'Inventory_Audit_Q4.xlsx', date: '2024-01-15', size: '1.1 MB', type: 'Excel' },
        { name: 'Customer_Retention_List.csv', date: '2024-01-10', size: '840 KB', type: 'CSV' },
    ];

    return (
        <div className="p-7.5 max-w-[1400px] mx-auto min-h-[90vh]">
            <div className="bg-gradient-to-r from-brand-primary to-brand-primary-dark text-white p-6.25 rounded-[15px] shadow-lg mb-6.25">
                <h1 className="m-0 mb-2.5 text-[32px] font-bold">Reports & Analytics</h1>
                <p className="m-0 opacity-90">Generate and export business intelligence reports</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-7.5">
                {reportTypes.map((report, index) => (
                    <div key={index} className="bg-white rounded-[15px] p-6.25 shadow-md border border-gray-200 flex flex-col gap-[15px] relative overflow-hidden group hover:shadow-lg transition-shadow">
                        <div className={`absolute -right-2.5 -top-2.5 text-[80px] opacity-5 ${report.color}`}>
                            {report.icon}
                        </div>
                        <div className={`w-[45px] h-[45px] rounded-xl ${report.bg} ${report.color} flex items-center justify-center text-xl`}>
                            {report.icon}
                        </div>
                        <div>
                            <h3 className="m-0 mb-1.5 text-lg font-bold text-gray-800">{report.title}</h3>
                            <p className="m-0 text-sm text-gray-500 leading-relaxed">{report.description}</p>
                        </div>
                        <button className={`mt-2.5 p-2.5 rounded-lg border bg-white font-bold cursor-pointer flex items-center justify-center gap-2 transition-colors border-current ${report.color} hover:opacity-80`}>
                            Generate Report
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[15px] shadow-md border border-gray-200 p-6.25">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="m-0 text-xl font-bold text-gray-800">Recent Reports</h3>
                    <button className="text-brand-primary border-none bg-transparent font-bold cursor-pointer hover:underline">View All History</button>
                </div>
                <div className="flex flex-col gap-3">
                    {recentReports.map((report, index) => (
                        <div key={index} className="flex items-center justify-between p-[15px] rounded-xl border border-gray-100 group hover:border-brand-primary transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-[35px] h-[35px] rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-brand-primary transition-colors">
                                    <FiFileText />
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-gray-800">{report.name}</div>
                                    <div className="text-xs text-gray-400 flex items-center gap-2.5 mt-0.5">
                                        <span className="flex items-center gap-1"><FiCalendar size={12} /> {report.date}</span>
                                        <span>• {report.size}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 cursor-pointer hover:border-brand-primary hover:text-brand-primary transition-colors">
                                <FiDownload size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportGeneration;
