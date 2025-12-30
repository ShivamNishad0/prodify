import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import Layout from './Layout';

function AdminPanel() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [createUserError, setCreateUserError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user',
    sendEmail: true
  });

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'user'
  });
  
  // Configure axios for authenticated requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    const filtered = users.filter(userItem =>
      userItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userItem.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userItem.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  // Handle create user form submission
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreatingUser(true);
    setCreateUserError('');
    setError('');

    try {
      const response = await axios.post('/api/admin/create-user', newUser);
      setSuccess(response.data.msg);
      setNewUser({ name: '', email: '', role: 'user', sendEmail: true });
      setShowCreateUser(false);
      await fetchUsers();
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error creating user:', err);
      setCreateUserError(err.response?.data?.msg || 'Failed to create user');
    } finally {
      setCreatingUser(false);
    }
  };

  // Handle edit user
  const handleEditUser = async (userId) => {
    try {
      await axios.put(`/api/admin/users/${userId}`, editForm);
      setSuccess('User updated successfully');
      setEditingUser(null);
      setEditForm({ name: '', email: '', role: 'user' });
      await fetchUsers();
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.msg || 'Failed to update user');
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    try {
      await axios.delete(`/api/admin/users/${userToDelete}`);
      setSuccess('User deleted successfully');
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      await fetchUsers();
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.msg || 'Failed to delete user');
    }
  };

  // Handle password reset
  const handlePasswordReset = async (userId) => {
    if (!window.confirm('Reset this user\'s password? They will receive an email with new credentials.')) {
      return;
    }

    try {
      await axios.post(`/api/admin/reset-user-password/${userId}`, { sendEmail: true });
      setSuccess('Password reset successfully. User will receive an email with new credentials.');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('Failed to reset password');
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      setError('Please select users to perform bulk actions');
      return;
    }

    if (action === 'delete') {
      if (!window.confirm(`Are you sure you want to delete ${selectedUsers.length} selected user(s)?`)) {
        return;
      }

      try {
        for (const userId of selectedUsers) {
          await axios.delete(`/api/admin/users/${userId}`);
        }
        setSuccess(`${selectedUsers.length} users deleted successfully`);
        setSelectedUsers([]);
        await fetchUsers();
        setTimeout(() => setSuccess(''), 5000);
      } catch (err) {
        console.error('Error deleting users:', err);
        setError('Failed to delete some users');
      }
    }
  };

  // Styles
  const containerStyle = {
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto'
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '25px',
    border: '1px solid #e0e0e0'
  };

  const buttonStyle = {
    backgroundColor: '#3cb2a8',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    marginRight: '10px',
    transition: 'all 0.3s ease'
  };

  const dangerButtonStyle = {
    backgroundColor: '#3bb426a5',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    marginRight: '5px',
    transition: 'all 0.3s ease'
  };

  const secondaryButtonStyle = {
    backgroundColor: '#0d6dfda9',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    marginRight: '5px',
    transition: 'all 0.3s ease'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    margin: '8px 0',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    boxSizing: 'border-box',
    fontSize: '14px',
    transition: 'border-color 0.3s ease'
  };

  const searchStyle = {
    ...inputStyle,
    maxWidth: '400px',
    marginBottom: '20px'
  };

  return (
    <div>
      <div style={containerStyle}>
        {/* Header */}
        <div style={{ ...cardStyle, marginBottom: '30px', background: 'linear-gradient(135deg, #3cb2a8 0%, #2a8a81 100%)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>Admin Panel</h1>
              <p style={{ margin: '0', opacity: '0.9' }}>User Management & System Administration</p>
            </div>
            <button 
              style={{...buttonStyle, backgroundColor: 'rgba(255,255,255,0.2)', border: '2px solid white'}}
              onClick={() => setShowCreateUser(!showCreateUser)}
            >
              {showCreateUser ? 'Cancel' : '+ Create New User'}
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div style={{
            ...cardStyle,
            backgroundColor: '#ffebee',
            border: '1px solid #ffcdd2',
            color: '#c62828',
            padding: '15px',
            marginBottom: '20px',
            borderRadius: '8px'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div style={{
            ...cardStyle,
            backgroundColor: '#e8f5e8',
            border: '1px solid #c8e6c9',
            color: '#2e7d32',
            padding: '15px',
            marginBottom: '20px',
            borderRadius: '8px'
          }}>
            <strong>Success:</strong> {success}
          </div>
        )}

        {/* Create User Form */}
        {showCreateUser && (
          <div style={cardStyle}>
            <h3 style={{ color: '#3cb2a8', marginBottom: '25px', fontSize: '24px' }}>Create New User</h3>
            
            {createUserError && (
              <div style={{
                backgroundColor: '#ffebee',
                color: '#c62828',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid #ffcdd2'
              }}>
                {createUserError}
              </div>
            )}

            <form onSubmit={handleCreateUser}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Full Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    style={inputStyle}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Email Address</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    style={inputStyle}
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    style={inputStyle}
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '30px' }}>
                  <input
                    type="checkbox"
                    id="sendEmail"
                    checked={newUser.sendEmail}
                    onChange={(e) => setNewUser({...newUser, sendEmail: e.target.checked})}
                    style={{ marginRight: '10px', transform: 'scale(1.2)' }}
                  />
                  <label htmlFor="sendEmail" style={{ fontWeight: '600', color: '#333' }}>
                    Send welcome email with login credentials
                  </label>
                </div>
              </div>
              
              <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
                <button 
                  type="submit" 
                  style={buttonStyle}
                  disabled={creatingUser}
                >
                  {creatingUser ? 'Creating User...' : 'Create User'}
                </button>
                <button 
                  type="button"
                  style={secondaryButtonStyle}
                  onClick={() => setShowCreateUser(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search and Filters */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#3cb2a8', margin: '0', fontSize: '24px' }}>
              All Users ({filteredUsers.length})
            </h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="🔍 Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={searchStyle}
              />
              <button
                style={secondaryButtonStyle}
                onClick={fetchUsers}
                title="Refresh Users List"
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div style={{
              backgroundColor: '#e3f2fd',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #bbdefb'
            }}>
              <strong>{selectedUsers.length} user(s) selected</strong>
              <button
                style={dangerButtonStyle}
                onClick={() => handleBulkAction('delete')}
                title="Delete Selected Users"
              >
                Delete Selected
              </button>
              <button
                style={secondaryButtonStyle}
                onClick={() => setSelectedUsers([])}
              >
                Clear Selection
              </button>
            </div>
          )}

          {/* Users Table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>⏳</div>
              <p>Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>👤</div>
              <p style={{ color: '#666' }}>
                {searchTerm ? 'No users match your search criteria.' : 'No users found.'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(filteredUsers.map(u => u._id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                        style={{ transform: 'scale(1.2)' }}
                      />
                    </th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Name</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Email</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Role</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Created</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((userItem) => (
                    <tr key={userItem._id} style={{ 
                      borderBottom: '1px solid #eee',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '15px' }}>
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(userItem._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, userItem._id]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== userItem._id));
                            }
                          }}
                          style={{ transform: 'scale(1.2)' }}
                        />
                      </td>
                      <td style={{ padding: '15px', fontWeight: '500' }}>
                        {editingUser === userItem._id ? (
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            style={{ ...inputStyle, margin: 0 }}
                          />
                        ) : (
                          userItem.name
                        )}
                      </td>
                      <td style={{ padding: '15px' }}>
                        {editingUser === userItem._id ? (
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                            style={{ ...inputStyle, margin: 0 }}
                          />
                        ) : (
                          <span style={{ color: '#666' }}>{userItem.email}</span>
                        )}
                      </td>
                      <td style={{ padding: '15px' }}>
                        {editingUser === userItem._id ? (
                          <select
                            value={editForm.role}
                            onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                            style={{ ...inputStyle, margin: 0 }}
                          >
                            <option value="employee">Employee</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            backgroundColor: userItem.role === 'admin' ? '#e3f2fd' : '#f3e5f5',
                            color: userItem.role === 'admin' ? '#1565c0' : '#6a1b9a'
                          }}>
                            {userItem.role === 'admin' ? 'Administrator' : userItem.role === 'manager' ? 'Manager' : 'Employee'}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '15px', color: '#666' }}>
                        {new Date(userItem.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td style={{ padding: '15px' }}>
                        {editingUser === userItem._id ? (
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button
                              style={{...dangerButtonStyle, backgroundColor: '#4caf50'}}
                              onClick={() => handleEditUser(userItem._id)}
                              title="Save Changes"
                            >
                              Save
                            </button>
                            <button
                              style={secondaryButtonStyle}
                              onClick={() => {
                                setEditingUser(null);
                                setEditForm({ name: '', email: '', role: 'user' });
                              }}
                              title="Cancel"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button
                              style={secondaryButtonStyle}
                              onClick={() => {
                                setEditingUser(userItem._id);
                                setEditForm({
                                  name: userItem.name,
                                  email: userItem.email,
                                  role: userItem.role
                                });
                              }}
                              title="Edit User"
                            >
                              Edit
                            </button>
                            <button
                              style={dangerButtonStyle}
                              onClick={() => handlePasswordReset(userItem._id)}
                              title="Reset Password"
                            >
                              Reset
                            </button>
                            {userItem._id !== user._id && (
                              <button
                                style={{...dangerButtonStyle, backgroundColor: '#c62828'}}
                                onClick={() => {
                                  setUserToDelete(userItem._id);
                                  setShowDeleteConfirm(true);
                                }}
                                title="Delete User"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
            <h3 style={{ color: '#e74c3c', marginBottom: '15px' }}>Confirm Delete</h3>
            <p style={{ marginBottom: '25px', color: '#666' }}>
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                style={dangerButtonStyle}
                onClick={handleDeleteUser}
              >
                Delete User
              </button>
              <button
                style={secondaryButtonStyle}
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setUserToDelete(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
