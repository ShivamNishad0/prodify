import React from 'react';
import { FiFileText, FiDownload, FiPieChart, FiTrendingUp, FiBox, FiUsers, FiCalendar } from 'react-icons/fi';

function Reports() {
    const containerStyle = {
        padding: '30px',
        maxWidth: '1400px',
        margin: '0 auto',
        minHeight: '90vh'
    };

    const cardStyle = {
        background: 'white',
        borderRadius: '15px',
        padding: '25px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #e0e0e0',
        marginBottom: '25px'
    };

    const reportTypes = [
        { title: 'Sales Report', description: 'Detailed breakdown of sales performance and revenue.', icon: <FiTrendingUp />, color: '#3cb2a8' },
        { title: 'Inventory Analytics', description: 'Stock levels, turnover rates, and valuation.', icon: <FiBox />, color: '#0d6dfd' },
        { title: 'Customer Insights', description: 'Demographics, behavior, and lifetime value.', icon: <FiUsers />, color: '#f59e0b' },
        { title: 'Tax & Compliance', description: 'GST reports and financial compliance data.', icon: <FiFileText />, color: '#ef4444' },
    ];

    const recentReports = [
        { name: 'Monthly_Sales_Jan_2024.pdf', date: '2024-02-01', size: '2.4 MB', type: 'PDF' },
        { name: 'Inventory_Audit_Q4.xlsx', date: '2024-01-15', size: '1.1 MB', type: 'Excel' },
        { name: 'Customer_Retention_List.csv', date: '2024-01-10', size: '840 KB', type: 'CSV' },
    ];

    return (
        <div style={containerStyle}>
            <div style={{
                ...cardStyle,
                background: 'linear-gradient(135deg, #3cb2a8 0%, #2a8a81 100%)',
                color: 'white'
            }}>
                <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>Reports & Analytics</h1>
                <p style={{ margin: '0', opacity: '0.9' }}>Generate and export business intelligence reports</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {reportTypes.map((report, index) => (
                    <div key={index} style={{ ...cardStyle, marginBottom: 0, display: 'flex', flexDirection: 'column', gap: '15px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', right: '-10px', top: '-10px', fontSize: '80px', opacity: '0.05', color: report.color }}>
                            {report.icon}
                        </div>
                        <div style={{ width: '45px', height: '45px', borderRadius: '10px', backgroundColor: `${report.color}15`, color: report.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                            {report.icon}
                        </div>
                        <div>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{report.title}</h3>
                            <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.5' }}>{report.description}</p>
                        </div>
                        <button style={{
                            marginTop: '10px',
                            padding: '10px',
                            borderRadius: '8px',
                            border: `1px solid ${report.color}`,
                            backgroundColor: 'white',
                            color: report.color,
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}>
                            Generate Report
                        </button>
                    </div>
                ))}
            </div>

            <div style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>Recent Reports</h3>
                    <button style={{ color: '#3cb2a8', border: 'none', background: 'none', fontWeight: '600', cursor: 'pointer' }}>View All History</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {recentReports.map((report, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '15px',
                            borderRadius: '10px',
                            border: '1px solid #f0f0f0',
                            transition: 'background 0.2s'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                    <FiFileText />
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{report.name}</div>
                                    <div style={{ fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FiCalendar size={12} /> {report.date}</span>
                                        <span>• {report.size}</span>
                                    </div>
                                </div>
                            </div>
                            <button style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                border: '1px solid #e2e8f0',
                                backgroundColor: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#64748b',
                                cursor: 'pointer'
                            }}>
                                <FiDownload size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Reports;
