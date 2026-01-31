import React, { useState } from 'react';
import { FiPackage, FiAlertTriangle, FiArrowUp, FiArrowDown, FiRefreshCw } from 'react-icons/fi';

function Inventory() {
    const [searchTerm, setSearchTerm] = useState('');

    const inventoryItems = [
        { id: 1, name: 'Saffron Incense Sticks', sku: 'SIS-001', category: 'Incense', stock: 124, price: '$12.00', status: 'In Stock' },
        { id: 2, name: 'Sandalwood Cones', sku: 'SWC-042', category: 'Cones', stock: 12, price: '$15.00', status: 'Low Stock' },
        { id: 3, name: 'Natural Dhoop Batti', sku: 'NDB-089', category: 'Dhoop', stock: 0, price: '$10.00', status: 'Out of Stock' },
        { id: 4, name: 'Jasmine Agar Sticks', sku: 'JAS-112', category: 'Agarbatti', stock: 450, price: '$8.00', status: 'In Stock' },
        { id: 5, name: 'Rose Petal Cones', sku: 'RPC-205', category: 'Cones', stock: 85, price: '$14.00', status: 'In Stock' },
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

    const alertStyle = {
        backgroundColor: '#fffbeb',
        border: '1px solid #fef3c7',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '30px',
        color: '#92400e'
    };

    const statCardStyle = {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
        flex: 1,
        minWidth: '200px'
    };

    const badgeStyle = (stock) => {
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
        <div style={containerStyle}>
            <div style={{
                ...cardStyle,
                background: 'linear-gradient(135deg, #3cb2a8 0%, #2a8a81 100%)',
                color: 'white'
            }}>
                <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>Inventory Management</h1>
                <p style={{ margin: '0', opacity: '0.9' }}>Monitor stock levels and manage order fulfillment</p>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
                <div style={statCardStyle}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Total Items</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>1,284</div>
                </div>
                <div style={statCardStyle}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Low Stock Items</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>12</div>
                </div>
                <div style={statCardStyle}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Out of Stock</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#c62828' }}>5</div>
                </div>
                <div style={statCardStyle}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Inventory Value</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>$45,820</div>
                </div>
            </div>

            <div style={alertStyle}>
                <FiAlertTriangle size={24} />
                <div>
                    <div style={{ fontWeight: 'bold' }}>Stock Warning</div>
                    <div style={{ fontSize: '14px' }}>There are 12 items currently running low on stock. Consider restocking soon.</div>
                </div>
            </div>

            <div style={{ ...cardStyle, padding: '10px' }}>
                <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>Stock List</h3>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid #3cb2a8',
                        background: 'none',
                        color: '#3cb2a8',
                        cursor: 'pointer'
                    }}>
                        <FiRefreshCw /> Refresh Sync
                    </button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #f0f0f0', color: '#666', fontSize: '14px' }}>
                            <th style={{ padding: '15px' }}>Product</th>
                            <th style={{ padding: '15px' }}>SKU</th>
                            <th style={{ padding: '15px' }}>Category</th>
                            <th style={{ padding: '15px' }}>Price</th>
                            <th style={{ padding: '15px' }}>Stock Level</th>
                            <th style={{ padding: '15px' }}>Status</th>
                            <th style={{ padding: '15px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventoryItems.map(item => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <td style={{ padding: '15px', fontWeight: '500' }}>{item.name}</td>
                                <td style={{ padding: '15px', color: '#666', fontSize: '13px' }}>{item.sku}</td>
                                <td style={{ padding: '15px', color: '#666' }}>{item.category}</td>
                                <td style={{ padding: '15px' }}>{item.price}</td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ height: '8px', width: '100px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${Math.min(100, (item.stock / 500) * 100)}%`,
                                                background: item.stock < 50 ? '#f59e0b' : '#3cb2a8'
                                            }} />
                                        </div>
                                        <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{item.stock}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <span style={badgeStyle(item.stock)}>{item.status}</span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button style={{ color: '#3cb2a8', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '500' }}>Adjust</button>
                                        <button style={{ color: '#666', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '500' }}>History</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Inventory;
