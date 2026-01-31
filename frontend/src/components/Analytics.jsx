import React from 'react';
import RevenueChart from './charts/RevenueChart';
import OrderStatusChart from './charts/OrderStatusChart';
import SalesByCategoryChart from './charts/SalesByCategoryChart';
import CustomerChart from './charts/CustomerChart';
import { FiTrendingUp, FiShoppingBag, FiUsers, FiDollarSign, FiCalendar, FiFilter } from 'react-icons/fi';

function Analytics() {
    // --- Mock Data for Charts ---
    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Projected Revenue',
                data: [45000, 48000, 52000, 55000, 58000, 62000, 65000, 68000, 72000, 75000, 78000, 82000],
                borderColor: '#3cb2a8',
                backgroundColor: 'rgba(60, 178, 168, 0.1)',
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
                    'rgba(60, 178, 168, 0.8)',
                    'rgba(13, 109, 253, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(100, 116, 139, 0.8)'
                ],
                borderRadius: 8,
            }
        ]
    };

    const customerData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'New Customers',
                data: [150, 230, 180, 290, 350, 420],
                borderColor: '#3cb2a8',
                backgroundColor: 'transparent',
                borderWidth: 3,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#3cb2a8',
                pointBorderWidth: 2,
                pointRadius: 5,
                tension: 0.3
            }
        ]
    };

    const containerStyle = {
        padding: '30px',
        maxWidth: '1400px',
        margin: '0 auto',
        minHeight: '90vh'
    };

    const dashboardGrid = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '30px',
        marginTop: '30px'
    };

    const cardStyle = {
        background: 'white',
        borderRadius: '16px',
        padding: '25px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        border: '1px solid #f1f5f9',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    };

    const statsGrid = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '24px',
        marginBottom: '30px'
    };

    const statCardStyle = (color) => ({
        ...cardStyle,
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    });

    const iconBoxStyle = (bgColor, color) => ({
        width: '60px',
        height: '60px',
        borderRadius: '14px',
        backgroundColor: bgColor,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        flexShrink: 0
    });

    return (
        <div style={containerStyle}>
            {/* Header */}
            <div style={{
                ...cardStyle,
                marginBottom: '30px',
                background: 'linear-gradient(135deg, #3cb2a8 0%, #2a8a81 100%)',
                color: 'white',
                border: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: '700' }}>Analytics Dashboard</h1>
                    <p style={{ margin: '0', opacity: '0.9', fontSize: '16px' }}>Comprehensive insights into your business performance</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid white', color: 'white', padding: '10px 20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                        <FiCalendar /> Last 30 Days
                    </button>
                    <button style={{ backgroundColor: 'white', border: 'none', color: '#2a8a81', padding: '10px 20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
                        <FiFilter /> Filters
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div style={statsGrid}>
                <div style={statCardStyle('#3cb2a8')}>
                    <div style={iconBoxStyle('rgba(60, 178, 168, 0.1)', '#3cb2a8')}>
                        <FiDollarSign />
                    </div>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>Total Revenue</span>
                        <h2 style={{ margin: '4px 0', fontSize: '28px', color: '#1e293b', fontWeight: '700' }}>$124,592</h2>
                        <span style={{ color: '#10b981', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                            <FiTrendingUp /> +12.5%
                        </span>
                    </div>
                </div>
                <div style={statCardStyle('#0d6dfd')}>
                    <div style={iconBoxStyle('rgba(13, 109, 253, 0.1)', '#0d6dfd')}>
                        <FiShoppingBag />
                    </div>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>Active Orders</span>
                        <h2 style={{ margin: '4px 0', fontSize: '28px', color: '#1e293b', fontWeight: '700' }}>452</h2>
                        <span style={{ color: '#10b981', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                            <FiTrendingUp /> +8.2%
                        </span>
                    </div>
                </div>
                <div style={statCardStyle('#f59e0b')}>
                    <div style={iconBoxStyle('rgba(245, 158, 11, 0.1)', '#f59e0b')}>
                        <FiUsers />
                    </div>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>New Customers</span>
                        <h2 style={{ margin: '4px 0', fontSize: '28px', color: '#1e293b', fontWeight: '700' }}>1,284</h2>
                        <span style={{ color: '#10b981', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                            <FiTrendingUp /> +5.4%
                        </span>
                    </div>
                </div>
                <div style={statCardStyle('#ef4444')}>
                    <div style={iconBoxStyle('rgba(239, 68, 68, 0.1)', '#ef4444')}>
                        <FiTrendingUp />
                    </div>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>Conversion Rate</span>
                        <h2 style={{ margin: '4px 0', fontSize: '28px', color: '#1e293b', fontWeight: '700' }}>3.2%</h2>
                        <span style={{ color: '#ef4444', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                            <FiTrendingUp style={{ transform: 'rotate(180deg)' }} /> -0.4%
                        </span>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div style={dashboardGrid}>
                <div style={cardStyle}>
                    <RevenueChart data={revenueData} />
                </div>
                <div style={cardStyle}>
                    <OrderStatusChart data={orderStatusData} />
                </div>
                <div style={cardStyle}>
                    <SalesByCategoryChart data={salesByCategoryData} />
                </div>
                <div style={cardStyle}>
                    <CustomerChart data={customerData} />
                </div>
            </div>
        </div>
    );
}

export default Analytics;




