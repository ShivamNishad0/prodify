import React, { useState } from 'react';
import { FiSearch, FiFilter, FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const customers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 8901', status: 'Active', location: 'New York, USA', totalOrders: 12, spent: '$1,240' },
    { id: 2, name: 'Jane Smith', email: 'jane@microsoft.com', phone: '+1 987 654 3210', status: 'Active', location: 'London, UK', totalOrders: 8, spent: '$850' },
    { id: 3, name: 'Robert Brown', email: 'robert@amazon.com', phone: '+44 20 7946 0958', status: 'Inactive', location: 'Berlin, Germany', totalOrders: 3, spent: '$210' },
    { id: 4, name: 'Alice Wilson', email: 'alice@google.com', phone: '+1 555 123 4567', status: 'Active', location: 'San Francisco, USA', totalOrders: 15, spent: '$2,100' },
    { id: 5, name: 'Charlie Davis', email: 'charlie@netflix.com', phone: '+33 1 42 68 53 00', status: 'Active', location: 'Paris, France', totalOrders: 6, spent: '$540' },
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

  const tableHeaderStyle = {
    textAlign: 'left',
    padding: '15px',
    borderBottom: '2px solid #f0f0f0',
    color: '#666',
    fontWeight: '600',
    fontSize: '14px'
  };

  const tableRowStyle = {
    borderBottom: '1px solid #f0f0f0',
    transition: 'background 0.2s'
  };

  const badgeStyle = (status) => ({
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor: status === 'Active' ? '#e8f5e8' : '#f0f0f0',
    color: status === 'Active' ? '#2e7d32' : '#666'
  });

  const inputStyle = {
    padding: '10px 15px',
    paddingLeft: '40px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    width: '300px',
    fontSize: '14px',
    outline: 'none'
  };

  return (
    <div style={containerStyle}>
      <div style={{
        ...cardStyle,
        background: 'linear-gradient(135deg, #3cb2a8 0%, #2a8a81 100%)',
        color: 'white'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>Customer Management</h1>
        <p style={{ margin: '0', opacity: '0.9' }}>View and manage your customer database</p>
      </div>

      <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <FiSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
          <input
            style={inputStyle}
            placeholder="Search customers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['All', 'Active', 'Inactive'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                backgroundColor: activeFilter === filter ? '#3cb2a8' : 'white',
                color: activeFilter === filter ? 'white' : '#666',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div style={{ ...cardStyle, padding: '10px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Customer</th>
              <th style={tableHeaderStyle}>Contact Info</th>
              <th style={tableHeaderStyle}>Location</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Orders</th>
              <th style={tableHeaderStyle}>Total Spent</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id} style={tableRowStyle}>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f0f9f8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3cb2a8' }}>
                      <FiUser size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#333' }}>{customer.name}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>ID: #CUST-{customer.id}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#555' }}>
                      <FiMail size={14} /> {customer.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#555' }}>
                      <FiPhone size={14} /> {customer.phone}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#555' }}>
                    <FiMapPin size={14} /> {customer.location}
                  </div>
                </td>
                <td style={{ padding: '15px' }}>
                  <span style={badgeStyle(customer.status)}>{customer.status}</span>
                </td>
                <td style={{ padding: '15px', color: '#333', fontWeight: '500' }}>{customer.totalOrders}</td>
                <td style={{ padding: '15px', color: '#333', fontWeight: '600' }}>{customer.spent}</td>
                <td style={{ padding: '15px' }}>
                  <button style={{ background: 'none', border: 'none', color: '#3cb2a8', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;