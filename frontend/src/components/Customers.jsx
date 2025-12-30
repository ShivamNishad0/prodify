import React, { useState, useEffect } from 'react';
import './Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Fetch customers and orders data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch customers with metrics (enhanced API)
      const customersResponse = await fetch('/api/customers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Fetch orders for summary statistics
      const ordersResponse = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!customersResponse.ok || !ordersResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const customersData = await customersResponse.json();
      const ordersData = await ordersResponse.json();

      setCustomers(customersData);
      setOrders(ordersData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get customer metrics from backend-provided data
  const getCustomerMetrics = (customer) => {
    if (customer.metrics) {
      return {
        totalAmount: customer.metrics.totalSpent,
        orderCount: customer.metrics.orderCount,
        lastOrderDate: customer.metrics.lastOrderDate ? new Date(customer.metrics.lastOrderDate) : null
      };
    }
    
    // Fallback: calculate metrics from orders (for backward compatibility)
    const customerOrders = orders.filter(order => 
      order.customer && order.customer._id === customer._id
    );
    
    const totalAmount = customerOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const orderCount = customerOrders.length;
    const lastOrder = customerOrders.length > 0 
      ? customerOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))[0]
      : null;
    
    return {
      totalAmount,
      orderCount,
      lastOrderDate: lastOrder ? new Date(lastOrder.orderDate) : null
    };
  };

  // Filter and sort customers
  const getFilteredAndSortedCustomers = () => {
    let filtered = customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'email':
          aVal = a.email.toLowerCase();
          bVal = b.email.toLowerCase();
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        case 'joinDate':
          aVal = new Date(a.createdAt);
          bVal = new Date(b.createdAt);
          break;
        case 'totalAmount':
          aVal = getCustomerMetrics(a).totalAmount;
          bVal = getCustomerMetrics(b).totalAmount;
          break;
        default:
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };

  const handleDelete = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/customers/${customerId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setCustomers(customers.filter(c => c._id !== customerId));
        } else {
          throw new Error('Failed to delete customer');
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      active: 'badge-active',
      inactive: 'badge-inactive',
      prospect: 'badge-prospect'
    };
    return `badge ${statusColors[status] || 'badge-active'}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="customers-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading customers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="customers-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchData} className="retry-button">Retry</button>
        </div>
      </div>
    );
  }

  const filteredCustomers = getFilteredAndSortedCustomers();

  return (
    <div className="customers-page">
      <div className="customers-header">
        <h1>Customers</h1>
        <button 
          className="add-customer-btn"
          onClick={() => setShowAddModal(true)}
        >
          + Add Customer
        </button>
      </div>

      <div className="customers-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="prospect">Prospect</option>
          </select>
        </div>
      </div>

      <div className="customers-summary">
        <div className="summary-card">
          <h3>Total Customers</h3>
          <p className="summary-number">{customers.length}</p>
        </div>
        <div className="summary-card">
          <h3>Active Customers</h3>
          <p className="summary-number">
            {customers.filter(c => c.status === 'active').length}
          </p>
        </div>
        <div className="summary-card">
          <h3>Total Revenue</h3>
          <p className="summary-number">
            {formatCurrency(orders.reduce((sum, order) => sum + order.totalAmount, 0))}
          </p>
        </div>
        <div className="summary-card">
          <h3>Total Orders</h3>
          <p className="summary-number">{orders.length}</p>
        </div>
      </div>

      <div className="customers-table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th 
                className="sortable"
                onClick={() => handleSort('name')}
              >
                Customer {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('email')}
              >
                Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Phone</th>
              <th>Address</th>
              <th 
                className="sortable"
                onClick={() => handleSort('status')}
              >
                Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('joinDate')}
              >
                Join Date {sortBy === 'joinDate' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('totalAmount')}
              >
                Total Spent {sortBy === 'totalAmount' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Orders</th>
              <th>Last Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="10" className="no-data">No customers found</td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => {
                const metrics = getCustomerMetrics(customer);
                return (
                  <tr key={customer._id}>
                    <td className="customer-name">
                      <strong>{customer.name}</strong>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.phone || 'N/A'}</td>
                    <td className="address-cell">
                      {customer.address ? (
                        <>
                          {customer.address.street && <div>{customer.address.street}</div>}
                          {customer.address.city && <div>{customer.address.city}, {customer.address.state} {customer.address.zipCode}</div>}
                          {customer.address.country && <div>{customer.address.country}</div>}
                        </>
                      ) : 'N/A'}
                    </td>
                    <td>
                      <span className={getStatusBadge(customer.status)}>
                        {customer.status}
                      </span>
                    </td>
                    <td>{formatDate(customer.createdAt)}</td>
                    <td className="amount-cell">
                      <strong>{formatCurrency(metrics.totalAmount)}</strong>
                    </td>
                    <td>
                      <span className="order-count">{metrics.orderCount}</span>
                    </td>
                    <td>
                      {metrics.lastOrderDate ? formatDate(metrics.lastOrderDate) : 'No orders'}
                    </td>
                    <td className="actions-cell">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(customer._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Customer</h2>
              <button onClick={() => setShowAddModal(false)} className="close-btn">&times;</button>
            </div>
            <div className="modal-body">
              <p>Add customer functionality would be implemented here</p>
              <p>This would include a form for customer details</p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowAddModal(false)} className="cancel-btn">Cancel</button>
              <button className="save-btn">Add Customer</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditModal && selectedCustomer && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Customer</h2>
              <button onClick={() => setShowEditModal(false)} className="close-btn">&times;</button>
            </div>
            <div className="modal-body">
              <p>Edit customer functionality would be implemented here</p>
              <p>Customer: {selectedCustomer.name}</p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowEditModal(false)} className="cancel-btn">Cancel</button>
              <button className="save-btn">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
