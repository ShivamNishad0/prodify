import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

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
    backgroundColor: '#c62828',
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

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#333',
    fontSize: '14px'
  };

  const sectionTitleStyle = {
    color: '#3cb2a8',
    marginBottom: '20px',
    fontSize: '18px',
    fontWeight: '600',
    borderBottom: '2px solid #3cb2a8',
    paddingBottom: '10px'
  };

  return (
    <div>
      <div style={containerStyle}>
        {/* Header */}
        <div style={{ 
          ...cardStyle, 
          marginBottom: '30px', 
          background: 'linear-gradient(135deg, #3cb2a8 0%, #2a8a81 100%)', 
          color: 'white' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>Products</h1>
              <p style={{ margin: '0', opacity: '0.9' }}>Manage your product catalog</p>
            </div>
            <button 
              style={{...buttonStyle, backgroundColor: 'rgba(255,255,255,0.2)', border: '2px solid white'}}
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? 'Cancel' : '+ Add New Product'}
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

        {/* Create/Edit Product Form */}
        {showCreateForm && (
          <div style={cardStyle}>
            <h3 style={sectionTitleStyle}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>

            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ color: '#555', marginBottom: '15px' }}>📦 Basic Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>Product Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="Enter product title"
                      required
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>SKU</label>
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
                    <label style={labelStyle}>Barcode</label>
                    <input
                      type="text"
                      name="barcode"
                      value={formData.barcode}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="Product barcode"
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
                      placeholder="Product category"
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
                    <label style={labelStyle}>Subcategory</label>
                    <input
                      type="text"
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="Sub category"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Brand</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="Brand name"
                    />
                  </div>
                </div>

                <div style={{ marginTop: '15px' }}>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                    placeholder="Product description"
                    rows={4}
                  />
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ color: '#555', marginBottom: '15px' }}>💰 Pricing & Inventory</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>Price *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Discount Price</label>
                    <input
                      type="number"
                      name="discountPrice"
                      value={formData.discountPrice}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      style={inputStyle}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="out_of_stock">Out of Stock</option>
                      <option value="discontinued">Discontinued</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Attributes */}
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ color: '#555', marginBottom: '15px' }}>🎨 Attributes</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>Color</label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="e.g., Red"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Size</label>
                    <input
                      type="text"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="e.g., M, L, XL"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Material</label>
                    <input
                      type="text"
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="e.g., Cotton, Leather"
                    />
                  </div>
                </div>
              </div>

              {/* Weight & Dimensions */}
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ color: '#555', marginBottom: '15px' }}>📏 Weight & Dimensions</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>Weight</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="number"
                        name="weightValue"
                        value={formData.weightValue}
                        onChange={handleInputChange}
                        style={{ ...inputStyle, margin: 0 }}
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                      <select
                        name="weightUnit"
                        value={formData.weightUnit}
                        onChange={handleInputChange}
                        style={{ ...inputStyle, margin: 0, width: '80px' }}
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="lb">lb</option>
                        <option value="oz">oz</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Length</label>
                    <input
                      type="number"
                      name="length"
                      value={formData.length}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Width</label>
                    <input
                      type="number"
                      name="width"
                      value={formData.width}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Height</label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Vendor Information */}
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ color: '#555', marginBottom: '15px' }}>🏪 Vendor Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>Vendor Name</label>
                    <input
                      type="text"
                      name="vendorName"
                      value={formData.vendorName}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="Vendor name"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Vendor Email</label>
                    <input
                      type="email"
                      name="vendorEmail"
                      value={formData.vendorEmail}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="vendor@example.com"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Vendor Phone</label>
                    <input
                      type="text"
                      name="vendorPhone"
                      value={formData.vendorPhone}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>
              </div>

              {/* Tags & Photo */}
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ color: '#555', marginBottom: '15px' }}>🏷️ Tags & Photo</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>Tags (comma separated)</label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="e.g., summer, sale, new"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Product Photo</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      style={inputStyle}
                      accept="image/*"
                    />
                    {formData.existingPhoto && (
                      <div style={{ marginTop: '10px' }}>
                        <img 
                          src={formData.existingPhoto.startsWith('http') ? formData.existingPhoto : `http://localhost:5001${formData.existingPhoto}`}
                          alt="Current product"
                          style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '8px' }}
                        />
                        <label style={{ marginLeft: '15px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={!formData.existingPhoto}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              existingPhoto: e.target.checked ? '' : prev.existingPhoto
                            }))}
                            style={{ marginRight: '5px' }}
                          />
                          Remove current photo
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                <button 
                  type="submit" 
                  style={buttonStyle}
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button 
                  type="button"
                  style={secondaryButtonStyle}
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
            <h3 style={{ color: '#3cb2a8', margin: '0', fontSize: '24px' }}>
              All Products ({totalProducts})
            </h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="🔍 Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ ...inputStyle, maxWidth: '250px', margin: 0 }}
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ ...inputStyle, maxWidth: '150px', margin: 0 }}
              >
                <option value="">All Categories</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{ ...inputStyle, maxWidth: '150px', margin: 0 }}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
              <button
                style={secondaryButtonStyle}
                onClick={fetchProducts}
                title="Refresh Products"
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          {/* Products Table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>⏳</div>
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>📦</div>
              <p style={{ color: '#666' }}>
                {searchTerm || selectedCategory || selectedStatus 
                  ? 'No products match your search criteria.' 
                  : 'No products found. Add your first product!'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Photo</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Title</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>SKU</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Category</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Price</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Qty</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} style={{ 
                      borderBottom: '1px solid #eee',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '15px' }}>
                        {product.photo ? (
                          <img 
                            src={product.photo.startsWith('http') ? product.photo : `http://localhost:5001${product.photo}`}
                            alt={product.title}
                            style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ 
                            width: '50px', 
                            height: '50px', 
                            borderRadius: '8px', 
                            backgroundColor: '#e0e0e0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            📷
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '15px', fontWeight: '500' }}>{product.title}</td>
                      <td style={{ padding: '15px', color: '#666' }}>{product.sku || '-'}</td>
                      <td style={{ padding: '15px', color: '#666' }}>{product.category}</td>
                      <td style={{ padding: '15px', fontWeight: '600' }}>
                        ${product.price?.toFixed(2)}
                        {product.discountPrice > 0 && (
                          <span style={{ 
                            color: '#c62828', 
                            fontSize: '12px', 
                            marginLeft: '5px',
                            textDecoration: 'line-through'
                          }}>
                            ${product.discountPrice?.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '15px' }}>
                        <span style={{ 
                          fontWeight: '600',
                          color: product.quantity <= 10 ? '#c62828' : product.quantity <= 50 ? '#f57c00' : '#2e7d32'
                        }}>
                          {product.quantity}
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: 
                            product.status === 'active' ? '#e8f5e8' : 
                            product.status === 'out_of_stock' ? '#ffebee' : '#f3e5f5',
                          color: 
                            product.status === 'active' ? '#2e7d32' : 
                            product.status === 'out_of_stock' ? '#c62828' : '#6a1b9a'
                        }}>
                          {product.status === 'out_of_stock' ? 'Out of Stock' : 
                           product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button
                            style={secondaryButtonStyle}
                            onClick={() => handleEdit(product)}
                            title="Edit Product"
                          >
                            Edit
                          </button>
                          <button
                            style={dangerButtonStyle}
                            onClick={() => handleDeleteClick(product._id)}
                            title="Delete Product"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', gap: '10px' }}>
              <button
                style={{ ...buttonStyle, opacity: currentPage === 1 ? 0.5 : 1 }}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 20px',
                fontWeight: '600'
              }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                style={{ ...buttonStyle, opacity: currentPage === totalPages ? 0.5 : 1 }}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
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
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                style={dangerButtonStyle}
                onClick={handleDelete}
              >
                Delete Product
              </button>
              <button
                style={secondaryButtonStyle}
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setProductToDelete(null);
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

export default Products;

