import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiBox, FiTag,
  FiDollarSign, FiLayers, FiPackage, FiTruck, FiInfo,
  FiShoppingBag, FiMaximize, FiCheck, FiX, FiImage, FiBriefcase
} from 'react-icons/fi';

function Products() {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [categories, setCategories] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discountPrice: '',
    quantity: '',
    category: '',
    subcategory: '',
    sku: '',
    barcode: '',
    brand: '',
    color: '',
    size: '',
    material: '',
    weightValue: '',
    weightUnit: 'kg',
    length: '',
    width: '',
    height: '',
    dimensionUnit: 'cm',
    status: 'active',
    tags: '',
    vendorName: '',
    vendorEmail: '',
    vendorPhone: '',
    photo: null,
    existingPhoto: ''
  });

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, selectedCategory, selectedStatus]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10
      });

      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedStatus) params.append('status', selectedStatus);
      if (searchTerm) params.append('search', searchTerm);

      const response = await axios.get(`/api/products?${params}`);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setTotalProducts(response.data.totalProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/products/meta/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        setCurrentPage(1);
        fetchProducts();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        if (key === 'photo' && formData[key]) {
          formDataToSend.append('photo', formData[key]);
        } else if (formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('Product updated successfully');
      } else {
        await axios.post('/api/products', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('Product created successfully');
      }

      resetForm();
      await fetchProducts();
      await fetchCategories();

      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.response?.data?.msg || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setFormData({
      title: product.title || '',
      description: product.description || '',
      price: product.price || '',
      discountPrice: product.discountPrice || '',
      quantity: product.quantity || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      sku: product.sku || '',
      barcode: product.barcode || '',
      brand: product.brand || '',
      color: product.color || '',
      size: product.size || '',
      material: product.material || '',
      weightValue: product.weight?.value || '',
      weightUnit: product.weight?.unit || 'kg',
      length: product.dimensions?.length || '',
      width: product.dimensions?.width || '',
      height: product.dimensions?.height || '',
      dimensionUnit: product.dimensions?.unit || 'cm',
      status: product.status || 'active',
      tags: product.tags?.join(', ') || '',
      vendorName: product.vendor?.name || '',
      vendorEmail: product.vendor?.email || '',
      vendorPhone: product.vendor?.phone || '',
      photo: null,
      existingPhoto: product.photo || ''
    });
    setShowCreateForm(true);
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/products/${productToDelete}`);
      setSuccess('Product deleted successfully');
      setShowDeleteConfirm(false);
      setProductToDelete(null);
      await fetchProducts();
      await fetchCategories();
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.response?.data?.msg || 'Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      discountPrice: '',
      quantity: '',
      category: '',
      subcategory: '',
      sku: '',
      barcode: '',
      brand: '',
      color: '',
      size: '',
      material: '',
      weightValue: '',
      weightUnit: 'kg',
      length: '',
      width: '',
      height: '',
      dimensionUnit: 'cm',
      status: 'active',
      tags: '',
      vendorName: '',
      vendorEmail: '',
      vendorPhone: '',
      photo: null,
      existingPhoto: ''
    });
    setEditingProduct(null);
    setShowCreateForm(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const containerStyle = {
    padding: '30px',
    maxWidth: '1400px',
    margin: '0 auto',
    minHeight: '90vh'
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    border: '1px solid #f1f5f9',
    marginBottom: '30px'
  };

  const buttonStyle = {
    backgroundColor: '#3cb2a8',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s'
  };

  const secondaryButtonStyle = {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#475569',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.025em'
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      < div style={{
        ...cardStyle,
        background: 'linear-gradient(135deg, #3cb2a8 0%, #2a8a81 100%)',
        color: 'white',
        border: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }} >
        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: '700' }}>Product Catalog</h1>
          <p style={{ margin: '0', opacity: '0.9', fontSize: '16px' }}>Manage and track your products inventory</p>
        </div>
        <button
          style={{ ...buttonStyle, backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid white' }}
          onClick={() => {
            if (showCreateForm) resetForm();
            else setShowCreateForm(true);
          }}
        >
          {showCreateForm ? <FiX size={18} /> : <FiPlus size={18} />}
          {showCreateForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div >

      {/* Messages */}
      {
        error && (
          <div style={{
            ...cardStyle,
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <FiInfo size={20} />
            <strong>Error:</strong> {error}
          </div>
        )
      }

      {
        success && (
          <div style={{
            ...cardStyle,
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#22c55e',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <FiCheck size={20} />
            <strong>Success:</strong> {success}
          </div>
        )
      }

      {/* Create/Edit Product Form */}
      {
        showCreateForm && (
          <div style={cardStyle}>
            <h3 style={sectionTitleStyle}>
              <div style={{ backgroundColor: 'rgba(60, 178, 168, 0.1)', color: '#3cb2a8', padding: '10px', borderRadius: '10px' }}>
                {editingProduct ? <FiEdit2 /> : <FiPlus />}
              </div>
              {editingProduct ? 'Update Product Information' : 'Register New Product'}
            </h3>

            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div style={{ marginBottom: '40px' }}>
                <h4 style={{ color: '#64748b', fontSize: '14px', fontWeight: '700', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                  <FiPackage style={{ marginRight: '8px' }} /> CORE DETAILS
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                  <div>
                    <label style={labelStyle}>Product Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="e.g. Premium Wireless Headphones"
                      required
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Category *</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="Select or enter category"
                      list="categories"
                      required
                    />
                    <datalist id="categories">
                      {categories.map((cat, index) => (
                        <option key={index} value={cat} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label style={labelStyle}>SKU Code</label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="Stock Keeping Unit"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Brand Name</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="Manufacturer/Brand"
                    />
                  </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <label style={labelStyle}>Product Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                    placeholder="Detailed information about the product..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Pricing & Logic */}
              <div style={{ marginBottom: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px' }}>
                <div>
                  <h4 style={{ color: '#64748b', fontSize: '14px', fontWeight: '700', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                    <FiDollarSign style={{ marginRight: '8px' }} /> PRICING & STOCK
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={labelStyle}>Base Price *</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>Rs.</span>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          style={{ ...inputStyle, paddingLeft: '45px' }}
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>In-Stock Quantity *</label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        style={inputStyle}
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <label style={labelStyle}>Inventory Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      style={inputStyle}
                    >
                      <option value="active">Available (Active)</option>
                      <option value="inactive">Draft (Inactive)</option>
                      <option value="out_of_stock">Out of Stock</option>
                      <option value="discontinued">Discontinued</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h4 style={{ color: '#64748b', fontSize: '14px', fontWeight: '700', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                    <FiImage style={{ marginRight: '8px' }} /> ASSETS & TAGS
                  </h4>
                  <div>
                    <label style={labelStyle}>Product Photo</label>
                    <div
                      onClick={() => fileInputRef.current.click()}
                      style={{
                        border: '2px dashed #e2e8f0',
                        borderRadius: '12px',
                        padding: '20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: '#f8fafc'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3cb2a8'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                    >
                      <FiImage size={24} style={{ color: '#94a3b8', marginBottom: '8px' }} />
                      <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                        {formData.photo ? formData.photo.name : 'Click to upload image'}
                      </p>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        accept="image/*"
                      />
                    </div>
                    {formData.existingPhoto && (
                      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <img
                          src={formData.existingPhoto.startsWith('http') ? formData.existingPhoto : `http://localhost:5001${formData.existingPhoto}`}
                          alt="Current"
                          style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                        />
                        <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#ef4444' }}>
                          <input
                            type="checkbox"
                            checked={!formData.existingPhoto}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              existingPhoto: e.target.checked ? '' : prev.existingPhoto
                            }))}
                          />
                          Remove Current
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Vendor & Attributes Section */}
              <div style={{ marginBottom: '40px' }}>
                <h4 style={{ color: '#64748b', fontSize: '14px', fontWeight: '700', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                  <FiBriefcase style={{ marginRight: '8px' }} /> VENDOR & ATTRIBUTES
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                  <div>
                    <label style={labelStyle}>Vendor Name</label>
                    <input
                      type="text"
                      name="vendorName"
                      value={formData.vendorName}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="Full Company Name"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Attributes</label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="Tags (comma separated)"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Material / Quality</label>
                    <input
                      type="text"
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="e.g. Leather, Plastic"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '30px' }}>
                <button
                  type="button"
                  style={secondaryButtonStyle}
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={buttonStyle}
                >
                  <FiCheck /> {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        )
      }

      {/* List Section */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px' }}>
              Product List
              <span style={{ fontSize: '14px', backgroundColor: 'rgba(60, 178, 168, 0.1)', color: '#3cb2a8', padding: '4px 12px', borderRadius: '20px' }}>
                {totalProducts} Items
              </span>
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ ...inputStyle, paddingLeft: '40px', width: '240px' }}
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ ...inputStyle, width: '160px' }}
            >
              <option value="">Categories</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Area */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3cb2a8', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
            <p style={{ color: '#64748b' }}>Loading products catalog...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', border: '2px dashed #e2e8f0', borderRadius: '16px' }}>
            <FiBox size={48} style={{ color: '#cbd5e1', marginBottom: '16px' }} />
            <h3 style={{ color: '#64748b', margin: '0' }}>No products found</h3>
            <p style={{ color: '#94a3b8', margin: '8px 0 0 0' }}>{searchTerm ? 'No results for your current filters' : 'Start by adding your first product'}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
              <thead>
                <tr style={{ textAlign: 'left' }}>
                  <th style={{ padding: '12px 20px', color: '#64748b', fontSize: '13px', fontWeight: '700' }}>ITEM</th>
                  <th style={{ padding: '12px 20px', color: '#64748b', fontSize: '13px', fontWeight: '700' }}>SKU</th>
                  <th style={{ padding: '12px 20px', color: '#64748b', fontSize: '13px', fontWeight: '700' }}>CATEGORY</th>
                  <th style={{ padding: '12px 20px', color: '#64748b', fontSize: '13px', fontWeight: '700' }}>STOCK</th>
                  <th style={{ padding: '12px 20px', color: '#64748b', fontSize: '13px', fontWeight: '700' }}>PRICE</th>
                  <th style={{ padding: '12px 20px', color: '#64748b', fontSize: '13px', fontWeight: '700' }}>STATUS</th>
                  <th style={{ padding: '12px 20px', color: '#64748b', fontSize: '13px', fontWeight: '700' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} style={{ backgroundColor: '#ffffff', transition: 'transform 0.2s' }}>
                    <td style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', borderLeft: '1px solid #f1f5f9', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        {product.photo ? (
                          <img
                            src={product.photo.startsWith('http') ? product.photo : `http://localhost:5001${product.photo}`}
                            alt={product.title}
                            style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                          />
                        ) : (
                          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                            <FiImage size={24} />
                          </div>
                        )}
                        <span style={{ fontWeight: '600', color: '#1e293b' }}>{product.title}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#64748b', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>{product.sku || 'N/A'}</td>
                    <td style={{ padding: '16px 20px', color: '#64748b', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>{product.category}</td>
                    <td style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{
                        fontWeight: '700',
                        color: product.quantity <= 10 ? '#ef4444' : product.quantity <= 50 ? '#f59e0b' : '#22c55e',
                        backgroundColor: product.quantity <= 10 ? '#fef2f2' : product.quantity <= 50 ? '#fffbeb' : '#f0fdf4',
                        padding: '4px 10px',
                        borderRadius: '8px'
                      }}>
                        {product.quantity}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: '700', color: '#1e293b', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
                      Rs. {product.price?.toLocaleString()}
                    </td>
                    <td style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        backgroundColor:
                          product.status === 'active' ? '#f0fdf4' :
                            product.status === 'out_of_stock' ? '#fef2f2' : '#f8fafc',
                        color:
                          product.status === 'active' ? '#22c55e' :
                            product.status === 'out_of_stock' ? '#ef4444' : '#64748b'
                      }}>
                        {product.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEdit(product)}
                          style={{ padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: '#f1f5f9', color: '#3b82f6', cursor: 'pointer' }}
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product._id)}
                          style={{ padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: '#fef2f2', color: '#ef4444', cursor: 'pointer' }}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '40px' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{ ...secondaryButtonStyle, padding: '8px' }}
            >
              <FiChevronLeft size={20} />
            </button>
            <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{ ...secondaryButtonStyle, padding: '8px' }}
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Overlay */}
      {
        showDeleteConfirm && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}>
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              maxWidth: '440px',
              width: '90%',
              textAlign: 'center'
            }}>
              <div style={{
                width: '64px', height: '64px', backgroundColor: '#fee2e2', color: '#ef4444',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <FiTrash2 size={32} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: '0 0 12px 0' }}>Confirm Deletion</h3>
              <p style={{ color: '#64748b', marginBottom: '32px', lineHeight: '1.6' }}>
                Are you sure you want to remove this product from the catalog? This operation cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  style={{ ...secondaryButtonStyle, flex: 1, justifyContent: 'center', padding: '14px' }}
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  style={{ ...buttonStyle, flex: 1, justifyContent: 'center', backgroundColor: '#ef4444', padding: '14px' }}
                  onClick={handleDelete}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Styles for Animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div >
  );
}

export default Products;
