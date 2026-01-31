import React, { useState } from 'react';
import { FiShoppingBag, FiTruck, FiCheckCircle, FiXCircle, FiClock, FiEye } from 'react-icons/fi';

function Orders() {
    const [activeTab, setActiveTab] = useState('All');

    const orders = [
        { id: 'ORD-7721', customer: 'John Doe', date: '2024-03-15', status: 'Delivered', items: 3, total: '$45.00', payment: 'Paid' },
        { id: 'ORD-7722', customer: 'Jane Smith', date: '2024-03-14', status: 'Processing', items: 1, total: '$12.50', payment: 'Paid' },
        { id: 'ORD-7723', customer: 'Robert Brown', date: '2024-03-14', status: 'Shipped', items: 5, total: '$120.00', payment: 'Paid' },
        { id: 'ORD-7724', customer: 'Alice Wilson', date: '2024-03-13', status: 'Pending', items: 2, total: '$32.00', payment: 'Unpaid' },
        { id: 'ORD-7725', customer: 'Charlie Davis', date: '2024-03-12', status: 'Cancelled', items: 1, total: '$15.00', payment: 'Refunded' },
    ];

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

    const statusColors = {
        'Delivered': { bg: '#e8f5e8', text: '#2e7d32', icon: <FiCheckCircle /> },
        'Processing': { bg: '#eff6ff', text: '#1d4ed8', icon: <FiClock /> },
        'Shipped': { bg: '#fef3c7', text: '#92400e', icon: <FiTruck /> },
        'Pending': { bg: '#f3f4f6', text: '#374151', icon: <FiClock /> },
        'Cancelled': { bg: '#fef2f2', text: '#b91c1c', icon: <FiXCircle /> },
    };

    return (
        <div style={containerStyle}>
            <div style={{
                ...cardStyle,
                background: 'linear-gradient(135deg, #3cb2a8 0%, #2a8a81 100%)',
                color: 'white'
            }}>
                <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>Orders</h1>
                <p style={{ margin: '0', opacity: '0.9' }}>Manage and track customer orders</p>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '25px',
                            border: 'none',
                            backgroundColor: activeTab === tab ? '#3cb2a8' : 'white',
                            color: activeTab === tab ? 'white' : '#666',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div style={{ ...cardStyle, padding: '10px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #f0f0f0', color: '#666', fontSize: '14px' }}>
                            <th style={{ padding: '15px' }}>Order ID</th>
                            <th style={{ padding: '15px' }}>Customer</th>
                            <th style={{ padding: '15px' }}>Date</th>
                            <th style={{ padding: '15px' }}>Status</th>
                            <th style={{ padding: '15px' }}>Items</th>
                            <th style={{ padding: '15px' }}>Total</th>
                            <th style={{ padding: '15px' }}>Payment</th>
                            <th style={{ padding: '15px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <td style={{ padding: '15px', fontWeight: 'bold', color: '#3cb2a8' }}>{order.id}</td>
                                <td style={{ padding: '15px', fontWeight: '500' }}>{order.customer}</td>
                                <td style={{ padding: '15px', color: '#666' }}>{order.date}</td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        backgroundColor: statusColors[order.status].bg,
                                        color: statusColors[order.status].text,
                                        width: 'fit-content'
                                    }}>
                                        {statusColors[order.status].icon}
                                        {order.status}
                                    </div>
                                </td>
                                <td style={{ padding: '15px', color: '#666' }}>{order.items} Items</td>
                                <td style={{ padding: '15px', fontWeight: 'bold' }}>{order.total}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        fontSize: '12px',
                                        color: order.payment === 'Paid' ? '#2e7d32' : '#b91c1c',
                                        fontWeight: '600'
                                    }}>
                                        ● {order.payment}
                                    </span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <button style={{
                                        background: 'none',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '6px',
                                        padding: '6px',
                                        cursor: 'pointer',
                                        color: '#666'
                                    }}>
                                        <FiEye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Orders;
