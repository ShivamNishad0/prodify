'use client';

import React, { useState, useEffect, useRef } from 'react';
import apiClient from '@/core/api/client';
import { useAuth } from '@/providers/AuthProvider';
import {
    FiPlus, FiEdit2, FiTrash2, FiSearch, FiBox,
    FiDollarSign, FiPackage, FiInfo,
    FiCheck, FiX, FiImage, FiBriefcase, FiChevronLeft
} from 'react-icons/fi';

const ProductManagement = () => {
    const { user, token } = useAuth();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        quantity: '',
        category: '',
        sku: '',
        brand: '',
        status: 'active',
        tags: '',
        vendorName: '',
        photo: null as File | null,
        existingPhoto: ''
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [currentPage, selectedCategory, selectedStatus]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await apiClient.get('/products', {
                params: {
                    page: currentPage,
                    limit: 10,
                    category: selectedCategory,
                    status: selectedStatus,
                    search: searchTerm
                }
            });
            setProducts(response.data.products);
            setTotalPages(response.data.totalPages);
            setTotalProducts(response.data.totalProducts);
        } catch (err: any) {
            setError('Failed to load products. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await apiClient.get('/products/meta/categories');
            setCategories(response.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setFormData(prev => ({ ...prev, photo: file }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                const val = (formData as any)[key];
                if (key === 'photo' && val) {
                    formDataToSend.append('photo', val);
                } else if (val !== null && val !== '') {
                    formDataToSend.append(key, val);
                }
            });

            if (editingProduct) {
                await apiClient.put(`/products/${editingProduct}`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setSuccess('Product updated successfully');
            } else {
                await apiClient.post('/products', formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setSuccess('Product created successfully');
            }

            resetForm();
            fetchProducts();
            setTimeout(() => setSuccess(''), 5000);
        } catch (err: any) {
            setError(err.response?.data?.msg || 'Failed to save product');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            price: '',
            quantity: '',
            category: '',
            sku: '',
            brand: '',
            status: 'active',
            tags: '',
            vendorName: '',
            photo: null,
            existingPhoto: ''
        });
        setEditingProduct(null);
        setShowCreateForm(false);
    };

    return (
        <div className="p-[30px] max-w-[1400px] mx-auto min-h-[90vh]">
            <div className="bg-gradient-to-r from-brand-primary to-brand-primary-dark text-white p-6.25 rounded-2xl shadow-lg mb-7.5 flex justify-between items-center border-none">
                <div>
                    <h1 className="m-0 mb-2 text-[32px] font-bold">Product Catalog</h1>
                    <p className="m-0 opacity-90 text-base">Manage and track your products inventory</p>
                </div>
                <button
                    className="bg-white/20 border border-white px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 hover:bg-white/30 transition-all"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    {showCreateForm ? <FiX size={18} /> : <FiPlus size={18} />}
                    {showCreateForm ? 'Cancel' : 'Add New Product'}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-500 p-6.25 rounded-2xl flex items-center gap-3 mb-7.5">
                    <FiInfo size={20} />
                    <strong>Error:</strong> {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-500 p-6.25 rounded-2xl flex items-center gap-3 mb-7.5">
                    <FiCheck size={20} />
                    <strong>Success:</strong> {success}
                </div>
            )}

            {showCreateForm && (
                <div className="bg-white rounded-2xl p-6.25 shadow-sm border border-gray-100 mb-7.5">
                    <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2.5">
                        <div className="bg-brand-primary/10 text-brand-primary p-2.5 rounded-xl">
                            {editingProduct ? <FiEdit2 /> : <FiPlus />}
                        </div>
                        {editingProduct ? 'Update Product Information' : 'Register New Product'}
                    </h3>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Title *</label>
                                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-xl focus:border-brand-primary outline-none" placeholder="e.g. Wireless Mouse" required />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category *</label>
                                <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-xl focus:border-brand-primary outline-none" placeholder="Enter category" required />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Base Price *</label>
                                <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-xl focus:border-brand-primary outline-none" placeholder="0.00" required />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity *</label>
                                <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-xl focus:border-brand-primary outline-none" placeholder="0" required />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-7.5 border-t border-gray-100">
                            <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200">Cancel</button>
                            <button type="submit" className="px-6 py-2.5 rounded-xl bg-brand-primary text-white font-semibold flex items-center gap-2 hover:bg-brand-primary-dark">
                                <FiCheck /> {editingProduct ? 'Save Changes' : 'Create Product'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl p-6.25 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-7.5 flex-wrap gap-5">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 m-0">
                        Product List
                        <span className="text-xs bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full">{totalProducts} Items</span>
                    </h3>
                    <div className="flex gap-3">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder="Search catalog..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-3 py-2 border border-gray-200 rounded-xl outline-none focus:border-brand-primary w-60" />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-15 text-gray-500">Loading products...</div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
                        <FiBox size={48} className="text-gray-200 mb-4 mx-auto" />
                        <p className="text-gray-500">No products found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-separate border-spacing-y-2">
                            <thead>
                                <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <th className="px-5 py-3">Item</th>
                                    <th className="px-5 py-3">Category</th>
                                    <th className="px-5 py-3">Stock</th>
                                    <th className="px-5 py-3">Price</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id} className="bg-white hover:shadow-md transition-shadow">
                                        <td className="px-5 py-4 border-l border-y border-gray-50 rounded-l-xl font-semibold text-gray-800">{product.title}</td>
                                        <td className="px-5 py-4 border-y border-gray-50 text-gray-500">{product.category}</td>
                                        <td className="px-5 py-4 border-y border-gray-50">
                                            <span className={`font-bold px-2 py-1 rounded-lg ${product.quantity <= 10 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>{product.quantity}</span>
                                        </td>
                                        <td className="px-5 py-4 border-y border-gray-50 font-bold">₹{product.price?.toLocaleString()}</td>
                                        <td className="px-5 py-4 border-y border-gray-50">
                                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${product.status === 'active' ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-400'}`}>{product.status}</span>
                                        </td>
                                        <td className="px-5 py-4 border-r border-y border-gray-50 rounded-r-xl">
                                            <div className="flex gap-2">
                                                <button className="p-2 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 transition-colors"><FiEdit2 /></button>
                                                <button className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"><FiTrash2 /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductManagement;
