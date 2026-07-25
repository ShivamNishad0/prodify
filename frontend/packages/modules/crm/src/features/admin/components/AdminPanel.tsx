'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import apiClient from '@/core/api/client';
import { FiUserPlus, FiSearch, FiRefreshCcw, FiTrash2, FiKey, FiEdit, FiCheck, FiX, FiAlertTriangle } from 'react-icons/fi';

const AdminPanel = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showCreateUser, setShowCreateUser] = useState(false);
    const [creatingUser, setCreatingUser] = useState(false);
    const [createUserError, setCreateUserError] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'employee',
        sendEmail: true
    });

    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        role: 'employee'
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await apiClient.get('/admin/users');
            setUsers(response.data);
            setFilteredUsers(response.data);
        } catch (err: any) {
            console.error('Error fetching users:', err);
            setError('Failed to load users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(u =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreatingUser(true);
        setCreateUserError('');
        setError('');

        try {
            const response = await apiClient.post('/admin/create-user', newUser);
            setSuccess(response.data.msg);
            setNewUser({ name: '', email: '', role: 'employee', sendEmail: true });
            setShowCreateUser(false);
            await fetchUsers();
            setTimeout(() => setSuccess(''), 5000);
        } catch (err: any) {
            setCreateUserError(err.response?.data?.msg || 'Failed to create user');
        } finally {
            setCreatingUser(false);
        }
    };

    const handleEditUser = async (userId: string) => {
        try {
            await apiClient.put(`/admin/users/${userId}`, editForm);
            setSuccess('User updated successfully');
            setEditingUser(null);
            await fetchUsers();
            setTimeout(() => setSuccess(''), 5000);
        } catch (err: any) {
            setError(err.response?.data?.msg || 'Failed to update user');
        }
    };

    const handleDeleteUser = async () => {
        try {
            await apiClient.delete(`/admin/users/${userToDelete}`);
            setSuccess('User deleted successfully');
            setShowDeleteConfirm(false);
            setUserToDelete(null);
            await fetchUsers();
            setTimeout(() => setSuccess(''), 5000);
        } catch (err: any) {
            setError(err.response?.data?.msg || 'Failed to delete user');
        }
    };

    const handlePasswordReset = async (userId: string) => {
        if (!window.confirm('Reset this user\'s password? They will receive an email with new credentials.')) {
            return;
        }

        try {
            await apiClient.post(`/admin/reset-user-password/${userId}`, { sendEmail: true });
            setSuccess('Password reset successfully. User will receive an email with new credentials.');
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError('Failed to reset password');
        }
    };

    return (
        <div className="p-5 max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-primary to-brand-primary-dark text-white p-6.25 rounded-2xl shadow-lg mb-7.5 flex flex-col sm:flex-row justify-between items-center border-none">
                <div>
                    <h1 className="m-0 mb-1.5 text-3xl font-bold">Admin Panel</h1>
                    <p className="m-0 opacity-90 text-sm">User Management & System Administration</p>
                </div>
                <button
                    className={`mt-4 sm:mt-0 flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 font-bold transition-all ${showCreateUser ? 'bg-white text-brand-primary-dark border-white' : 'bg-white/20 text-white border-white hover:bg-white/30'
                        }`}
                    onClick={() => setShowCreateUser(!showCreateUser)}
                >
                    {showCreateUser ? <FiX /> : <FiUserPlus />} {showCreateUser ? 'Cancel' : 'Create User'}
                </button>
            </div>

            {/* Messages */}
            {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-5 font-medium"><strong>Error:</strong> {error}</div>}
            {success && <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-5 font-medium"><strong>Success:</strong> {success}</div>}

            {/* Create User Form */}
            {showCreateUser && (
                <div className="bg-white rounded-[15px] p-7.5 shadow-md border border-gray-100 mb-7.5 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="text-brand-primary mb-6.25 text-2xl font-bold">Create New User</h3>
                    <form onSubmit={handleCreateUser}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6.25">
                            <div>
                                <label className="block mb-2 font-bold text-gray-700">Full Name</label>
                                <input
                                    className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-brand-primary outline-none"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2 font-bold text-gray-700">Email Address</label>
                                <input
                                    className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-brand-primary outline-none"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    placeholder="user@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2 font-bold text-gray-700">Role</label>
                                <select
                                    className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-brand-primary outline-none bg-white"
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                >
                                    <option value="employee">Employee</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>
                            <div className="flex items-center sm:pt-9">
                                <input
                                    type="checkbox"
                                    id="sendEmail"
                                    checked={newUser.sendEmail}
                                    onChange={(e) => setNewUser({ ...newUser, sendEmail: e.target.checked })}
                                    className="mr-3 w-5 h-5 accent-brand-primary"
                                />
                                <label htmlFor="sendEmail" className="font-semibold text-gray-700 text-sm">
                                    Send welcome email
                                </label>
                            </div>
                        </div>
                        <div className="mt-7.5 flex gap-2.5">
                            <button type="submit" className="px-6 py-3 bg-brand-primary text-white font-bold rounded-lg shadow-lg shadow-brand-primary-dark/20 hover:bg-brand-primary-dark transition-all disabled:opacity-50" disabled={creatingUser}>
                                {creatingUser ? 'Creating...' : 'Create User'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-[15px] p-6.25 shadow-md border border-gray-100 overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6.25 gap-4">
                    <h3 className="text-brand-primary m-0 text-xl font-bold">All Users ({filteredUsers.length})</h3>
                    <div className="flex gap-2.5 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-80">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:border-brand-primary transition-all text-sm"
                            />
                        </div>
                        <button onClick={fetchUsers} className="p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-500 hover:text-brand-primary transition-colors">
                            <FiRefreshCcw />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto -mx-6.25 sm:mx-0">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold tracking-widest text-left">
                                <th className="p-4 border-b border-gray-100">Name</th>
                                <th className="p-4 border-b border-gray-100">Email</th>
                                <th className="p-4 border-b border-gray-100">Role</th>
                                <th className="p-4 border-b border-gray-100">Created</th>
                                <th className="p-4 border-b border-gray-100">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map((u) => (
                                <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 font-bold text-gray-800">
                                        {editingUser === u._id ? (
                                            <input className="w-full p-1.5 border border-brand-primary rounded outline-none text-sm" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                                        ) : u.name}
                                    </td>
                                    <td className="p-4 text-gray-500 text-sm">
                                        {editingUser === u._id ? (
                                            <input className="w-full p-1.5 border border-brand-primary rounded outline-none text-sm" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                                        ) : u.email}
                                    </td>
                                    <td className="p-4">
                                        {editingUser === u._id ? (
                                            <select className="w-full p-1.5 border border-brand-primary bg-white rounded outline-none text-sm" value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}>
                                                <option value="employee">Employee</option>
                                                <option value="manager">Manager</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        ) : (
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide ${u.role === 'admin' ? 'bg-brand-primary-light/20 text-brand-primary-dark' : 'bg-blue-50 text-blue-700'
                                                }`}>
                                                {u.role}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-gray-400 text-[11px] font-bold">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            {editingUser === u._id ? (
                                                <>
                                                    <button onClick={() => handleEditUser(u._id)} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-sm"><FiCheck /></button>
                                                    <button onClick={() => setEditingUser(null)} className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 shadow-sm"><FiX /></button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => { setEditingUser(u._id); setEditForm({ name: u.name, email: u.email, role: u.role }); }} className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-blue-500 hover:border-blue-200 transition-all"><FiEdit /></button>
                                                    <button onClick={() => handlePasswordReset(u._id)} className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-amber-500 hover:border-amber-200 transition-all"><FiKey /></button>
                                                    {u._id !== user?.id && <button onClick={() => { setUserToDelete(u._id); setShowDeleteConfirm(true); }} className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-200 transition-all"><FiTrash2 /></button>}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] flex items-center justify-center p-5">
                    <div className="bg-white p-7.5 rounded-2xl shadow-2xl max-w-[400px] w-full text-center border border-gray-100 animate-in zoom-in-95 duration-200">
                        <div className="text-5xl mb-4 flex justify-center text-red-100"><FiAlertTriangle size={64} className="text-red-400" /></div>
                        <h3 className="text-red-500 text-xl font-bold mb-2.5">Confirm Delete</h3>
                        <p className="mb-7.5 text-gray-500 text-sm leading-relaxed">Are you sure you want to delete this user? This action cannot be undone.</p>
                        <div className="flex gap-2.5 justify-center">
                            <button onClick={handleDeleteUser} className="px-6 py-2.5 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all shadow-lg shadow-red-500/20">Delete User</button>
                            <button onClick={() => { setShowDeleteConfirm(false); setUserToDelete(null); }} className="px-6 py-2.5 bg-gray-100 text-gray-500 font-bold rounded-lg hover:bg-gray-200 transition-all border border-gray-200">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
