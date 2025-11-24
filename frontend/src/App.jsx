import React, { useState, useEffect } from 'react';
import './index.css';

const API_URL = 'http://localhost:3000/api';

function App() {
  // Auth State
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // Data State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  // Filter State
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // UI State
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Admin State
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [additionalImages, setAdditionalImages] = useState([]);

  // Review State
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  // Initialize
  useEffect(() => {
    if (token) {
      fetchUser();
    }
    fetchProducts();
    fetchCategories();
  }, [token]);

  // Fetch user info
  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const userData = data.user || data;
        console.log('User data:', userData); // Debug
        setUser(userData);
      }
    } catch (error) {
      console.error('Fetch user error:', error);
    }
  };

  // Fetch products with filters
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter) params.append('categoryId', categoryFilter);
      if (priceMin) params.append('minPrice', priceMin);
      if (priceMax) params.append('maxPrice', priceMax);
      if (featuredOnly) params.append('isFeatured', 'true');
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      params.append('limit', '50');

      const res = await fetch(`${API_URL}/products?${params}`);
      const data = await res.json();
      setProducts(data.products || data || []);
    } catch (error) {
      console.error('Fetch products error:', error);
      showMessage('error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      setCategories(data || []);
    } catch (error) {
      console.error('Fetch categories error:', error);
    }
  };

  // Fetch reviews for a product
  const fetchReviews = async (productId) => {
    try {
      const res = await fetch(`${API_URL}/reviews/product/${productId}`);
      const data = await res.json();
      setReviews(data || []);
    } catch (error) {
      console.error('Fetch reviews error:', error);
    }
  };

  // Auth: Register
  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
          name: formData.get('name')
        })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('authToken', data.token);
        setToken(data.token);
        setUser(data.user);
        setShowAuth(false);
        showMessage('success', 'Registration successful!');
      } else {
        showMessage('error', data.error || 'Registration failed');
      }
    } catch (error) {
      showMessage('error', 'Registration failed');
    }
  };

  // Auth: Login
  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password')
        })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('authToken', data.token);
        setToken(data.token);
        setUser(data.user);
        setShowAuth(false);
        showMessage('success', 'Login successful!');
        if (data.user.is_admin || data.user.role === 'admin') {
          setShowAdmin(true);
        }
      } else {
        showMessage('error', data.error || 'Login failed');
      }
    } catch (error) {
      showMessage('error', 'Login failed');
    }
  };

  // Auth: Logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setShowAdmin(false);
    showMessage('success', 'Logged out successfully');
  };

  // Image Upload Handler for Additional Images
  const handleAdditionalImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImage(true);
    const newImages = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${API_URL}/upload/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const data = await response.json();
        if (response.ok) {
          newImages.push(data.imageUrl);
        }
      }

      if (newImages.length > 0) {
        setAdditionalImages([...additionalImages, ...newImages]);
        showMessage('success', `${newImages.length} image(s) uploaded!`);
      }
    } catch (error) {
      showMessage('error', 'Image upload failed');
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove additional image
  const handleRemoveAdditionalImage = (index) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
  };

  // Image Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_URL}/upload/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setUploadedImageUrl(data.imageUrl);
        showMessage('success', 'Image uploaded successfully!');
        // Auto-fill the image URL in the form
        const imageInput = document.querySelector('input[name="image_url"]');
        if (imageInput) {
          imageInput.value = `http://localhost:3000${data.imageUrl}`;
        }
      } else {
        showMessage('error', data.error || 'Upload failed');
      }
    } catch (error) {
      showMessage('error', 'Image upload failed');
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  // Product: Create/Update
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Validate image upload
    if (!uploadedImageUrl && !editingProduct) {
      showMessage('error', 'Please upload an image');
      return;
    }

    const productData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      original_price: formData.get('original_price') ? parseFloat(formData.get('original_price')) : null,
      category_id: formData.get('category_id') || null,
      affiliate_link: formData.get('affiliate_link') || '',
      image_url: uploadedImageUrl || editingProduct?.image_url,
      images: additionalImages,
      notes: formData.get('notes'),
      is_featured: formData.get('is_featured') === 'on'
    };

    try {
      const url = editingProduct
        ? `${API_URL}/products/${editingProduct.id}`
        : `${API_URL}/products`;

      const res = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (res.ok) {
        showMessage('success', editingProduct ? 'Product updated!' : 'Product created!');
        setEditingProduct(null);
        setUploadedImageUrl('');
        setAdditionalImages([]);
        fetchProducts();
        e.currentTarget.reset();
      } else {
        const data = await res.json();
        showMessage('error', data.error || 'Operation failed');
      }
    } catch (error) {
      showMessage('error', 'Operation failed');
    }
  };

  // Product: Delete
  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        showMessage('success', 'Product deleted!');
        fetchProducts();
      } else {
        const data = await res.json();
        showMessage('error', data.error || 'Delete failed');
        console.error('Delete error:', data);
      }
    } catch (error) {
      showMessage('error', 'Delete failed: ' + error.message);
      console.error('Delete error:', error);
    }
  };

  // Category: Create
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = formData.get('name');
    const slug = name.toLowerCase().replace(/\s+/g, '-');

    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          slug,
          description: formData.get('description')
        })
      });

      if (res.ok) {
        showMessage('success', 'Category created!');
        fetchCategories();
        e.currentTarget.reset();
      } else {
        const data = await res.json();
        showMessage('error', data.error || 'Creation failed');
      }
    } catch (error) {
      showMessage('error', 'Creation failed');
    }
  };

  // Review: Submit
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showMessage('error', 'Please login to leave a review');
      return;
    }
    if (!selectedProduct) return;

    try {
      const res = await fetch(`${API_URL}/reviews/product/${selectedProduct.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newReview)
      });

      if (res.ok) {
        showMessage('success', 'Review submitted!');
        setNewReview({ rating: 5, comment: '' });
        fetchReviews(selectedProduct.id);
        fetchProducts();
      } else {
        const data = await res.json();
        const errorMsg = data.error || data.message || 'Review failed';
        showMessage('error', errorMsg);
        console.error('Review submission error:', data);
      }
    } catch (error) {
      showMessage('error', 'Review submission failed: ' + error.message);
      console.error('Review submission error:', error);
    }
  };

  // Open product modal
  const openProductModal = (product) => {
    setSelectedProduct(product);
    fetchReviews(product.id);
  };

  // Helper: Show message
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  // Helper: Render stars
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i}>{i < Math.round(rating) ? '★' : '☆'}</span>
    ));
  };

  // Apply filters
  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, priceMin, priceMax, sortBy, sortOrder, featuredOnly]);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <nav className="nav-container">
          <div className="logo" onClick={() => { setShowAdmin(false); setShowAuth(false); setSelectedProduct(null); }}>
            🎁 GiftOnline.com
          </div>

          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            ☰
          </button>

          <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <li><button onClick={() => { setShowAdmin(false); setShowAuth(false); setSelectedProduct(null); setMobileMenuOpen(false); }}>Home</button></li>
            {user ? (
              <>
                {(user?.is_admin === true || user?.role === 'admin' || user?.name === 'Admin User') && (
                  <li><button onClick={() => { setShowAdmin(!showAdmin); setMobileMenuOpen(false); }} style={{ color: '#FFD700', fontWeight: 700 }}>🛠️ Admin Panel</button></li>
                )}
                <li style={{ color: 'var(--secondary)', fontWeight: 600 }}>Welcome, {user.name}!</li>
                <li><button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>Logout</button></li>
              </>
            ) : (
              <li><button onClick={() => { setShowAuth(true); setMobileMenuOpen(false); }}>Login / Register</button></li>
            )}
          </ul>
        </nav>
      </header>

      {/* Alert Messages */}
      {message && (
        <div style={{ position: 'fixed', top: '100px', right: '20px', zIndex: 3000 }}>
          <div className={`alert alert-${message.type}`}>
            {message.type === 'success' ? '✓' : '✕'} {message.text}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuth && !user && (
        <div className="modal-overlay" onClick={() => setShowAuth(false)}>
          <div className="auth-container" onClick={e => e.stopPropagation()}>
            <form className="auth-form" onSubmit={isLogin ? handleLogin : handleRegister}>
              <h2>{isLogin ? 'Login' : 'Register'}</h2>

              {!isLogin && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="name" required placeholder="Your name" />
                </div>
              )}

              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" required placeholder="your@email.com" />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" required placeholder="••••••••" minLength={6} />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <span>{isLogin ? 'Login' : 'Register'}</span>
              </button>

              <div className="auth-toggle">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button type="button" onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? 'Register' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Panel */}
      {showAdmin && user && (user?.is_admin === true || user?.role === 'admin' || user?.name === 'Admin User') ? (
        <div className="main-container">
          <div className="admin-panel">
            <div className="admin-header">
              <h2>🛠️ Admin Panel - GiftOnline.com</h2>
              <button className="btn btn-secondary" onClick={() => setShowAdmin(false)}>
                <span>Back to Store</span>
              </button>
            </div>

            <div className="admin-tabs">
              <button
                className={`tab-btn ${adminTab === 'products' ? 'active' : ''}`}
                onClick={() => setAdminTab('products')}
              >
                📦 Products
              </button>
              <button
                className={`tab-btn ${adminTab === 'categories' ? 'active' : ''}`}
                onClick={() => setAdminTab('categories')}
              >
                🏷️ Categories
              </button>
            </div>

            {adminTab === 'products' && (
              <>
                <form onSubmit={handleProductSubmit}>
                  <h3>{editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}</h3>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Product Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        defaultValue={editingProduct?.name}
                        placeholder="Gift Name"
                      />
                    </div>

                    <div className="form-group">
                      <label>Category</label>
                      <select name="category_id" defaultValue={editingProduct?.category_id || ''}>
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Price * ($)</label>
                      <input
                        type="number"
                        name="price"
                        step="0.01"
                        min="0"
                        required
                        defaultValue={editingProduct?.price}
                        placeholder="19.99"
                      />
                    </div>

                    <div className="form-group">
                      <label>Original Price ($)</label>
                      <input
                        type="number"
                        name="original_price"
                        step="0.01"
                        min="0"
                        defaultValue={editingProduct?.original_price}
                        placeholder="29.99"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      rows={3}
                      defaultValue={editingProduct?.description}
                      placeholder="Product description..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Notes / Special Info</label>
                    <textarea
                      name="notes"
                      rows={2}
                      defaultValue={editingProduct?.notes}
                      placeholder="Special notes about this product..."
                    />
                  </div>

                  <div className="form-group">
                    <label>🔗 Product / Affiliate URL</label>
                    <input
                      type="url"
                      name="affiliate_link"
                      placeholder="https://example.com/product"
                      defaultValue={editingProduct?.affiliate_link || ''}
                    />
                  </div>

                  <div className="form-group">
                    <label>📤 Upload Main Image {editingProduct ? '' : '*'}</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        style={{ flex: 1 }}
                        required={!editingProduct}
                      />
                      {uploadingImage && <span style={{ color: '#FFD700' }}>⏳ Uploading...</span>}
                      {uploadedImageUrl && <span style={{ color: '#4CAF50' }}>✅ Uploaded!</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>🖼️ Upload Additional Images (Gallery)</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleAdditionalImageUpload}
                        disabled={uploadingImage}
                        style={{ flex: 1 }}
                      />
                      {uploadingImage && <span style={{ color: '#FFD700' }}>⏳ Uploading...</span>}
                    </div>
                    {additionalImages.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {additionalImages.map((imgUrl, idx) => (
                          <div key={idx} style={{ position: 'relative', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #ddd' }}>
                            <img src={`http://localhost:3000${imgUrl}`} alt={`gallery-${idx}`} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                            <button
                              type="button"
                              onClick={() => handleRemoveAdditionalImage(idx)}
                              style={{
                                position: 'absolute',
                                top: '2px',
                                right: '2px',
                                background: '#FF6B6B',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                padding: 0
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      name="is_featured"
                      id="is_featured"
                      defaultChecked={editingProduct?.is_featured}
                    />
                    <label htmlFor="is_featured">⭐ Featured Product</label>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                    <button type="submit" className="btn btn-primary">
                      <span>{editingProduct ? '💾 Update' : '➕ Add'} Product</span>
                    </button>
                    {editingProduct && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setEditingProduct(null);
                          setUploadedImageUrl('');
                          setAdditionalImages([]);
                        }}
                      >
                        <span>❌ Cancel</span>
                      </button>
                    )}
                  </div>
                </form>

                <h3 style={{ marginTop: '2rem' }}>📋 All Products</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Rating</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.category_name || 'N/A'}</td>
                        <td>${Number(product.price).toFixed(2)}</td>
                        <td>⭐ {Number(product.average_rating).toFixed(1)} ({product.total_reviews})</td>
                        <td>{product.is_featured ? '✅' : '❌'}</td>
                        <td className="table-actions">
                          <button
                            className="icon-btn edit"
                            onClick={() => setEditingProduct(product)}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            className="icon-btn delete"
                            onClick={() => handleDeleteProduct(product.id)}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {adminTab === 'categories' && (
              <>
                <form onSubmit={handleCategorySubmit}>
                  <h3>➕ Add New Category</h3>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Category Name *</label>
                      <input type="text" name="name" required placeholder="Electronics, Gadgets, etc." />
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <input type="text" name="description" placeholder="Category description" />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    <span>➕ Add Category</span>
                  </button>
                </form>

                <h3 style={{ marginTop: '2rem' }}>📋 All Categories</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Slug</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(cat => (
                      <tr key={cat.id}>
                        <td>{cat.name}</td>
                        <td><code>{cat.slug}</code></td>
                        <td>{cat.description || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="hero">
            <div className="hero-content">
              <h1>🎁 Find the Perfect Gift</h1>
              <p>Discover amazing gift ideas with exclusive affiliate links at GiftOnline.com</p>
              <button className="btn btn-primary" onClick={() => document.querySelector('.filters-section')?.scrollIntoView({ behavior: 'smooth' })}>
                <span>🛍️ Start Shopping</span>
              </button>
            </div>
          </section>

          {/* Main Content */}
          <main className="main-container">
            {/* Filters */}
            <section className="filters-section">
              <div className="filters-header">
                <h2>🔍 Find Your Perfect Gift</h2>
                <button className="btn btn-small btn-secondary" onClick={() => {
                  setCategoryFilter('');
                  setPriceMin('');
                  setPriceMax('');
                  setFeaturedOnly(false);
                  setSortBy('created_at');
                  setSortOrder('DESC');
                }}>
                  <span>🔄 Clear Filters</span>
                </button>
              </div>

              <div className="filters-grid">
                <div className="filter-group">
                  <label>🏷️ Category</label>
                  <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>📊 Sort By</label>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="created_at">Latest</option>
                    <option value="price">Price</option>
                    <option value="average_rating">Rating</option>
                    <option value="total_reviews">Reviews</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>📈 Order</label>
                  <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                    <option value="DESC">High to Low</option>
                    <option value="ASC">Low to High</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>💰 Price Range ($)</label>
                  <div className="price-range">
                    <input
                      type="number"
                      placeholder="Min"
                      min="0"
                      value={priceMin}
                      onChange={e => setPriceMin(e.target.value)}
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      min="0"
                      value={priceMax}
                      onChange={e => setPriceMax(e.target.value)}
                    />
                  </div>
                </div>

                <div className="filter-group">
                  <label>⭐ Featured</label>
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="featured-filter"
                      checked={featuredOnly}
                      onChange={e => setFeaturedOnly(e.target.checked)}
                    />
                    <label htmlFor="featured-filter">Show featured products only</label>
                  </div>
                </div>
              </div>
            </section>

            {/* Products Grid */}
            {loading ? (
              <div className="loading">Loading amazing gifts...</div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🎁</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters to discover more gifts</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <div key={product.id} className="product-card" onClick={() => openProductModal(product)}>
                    {product.is_featured && <div className="product-badge">⭐ Featured</div>}

                    <img
                      src={
                        product.image_url && product.image_url.startsWith('/')
                          ? `http://localhost:3000${product.image_url}`
                          : (product.image_url || 'https://via.placeholder.com/300x250?text=No+Image')
                      }
                      alt={product.name}
                      className="product-image"
                    />

                    <div className="product-info">
                      {product.category_name && (
                        <div className="product-category">{product.category_name}</div>
                      )}

                      <h3 className="product-name">{product.name}</h3>

                      <div className="product-rating">
                        <div className="stars">{renderStars(product.average_rating)}</div>
                        <span className="rating-text">
                          {Number(product.average_rating).toFixed(1)} ({product.total_reviews})
                        </span>
                      </div>

                      <div className="product-price">
                        <span className="current-price">${Number(product.price).toFixed(2)}</span>
                        {product.original_price && Number(product.original_price) > Number(product.price) && (
                          <>
                            <span className="original-price">${Number(product.original_price).toFixed(2)}</span>
                            <span className="discount-badge">
                              {Math.round((1 - Number(product.price) / Number(product.original_price)) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </div>

                      <button className="btn btn-success" style={{ width: '100%' }} onClick={(e) => {
                        e.stopPropagation();
                        window.open(product.affiliate_link, '_blank');
                      }}>
                        <span>🛒 Buy Now</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)}>×</button>

            <div className="product-detail">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <img
                  src={
                    selectedProduct.image_url && selectedProduct.image_url.startsWith('/')
                      ? `http://localhost:3000${selectedProduct.image_url}`
                      : (selectedProduct.image_url || 'https://via.placeholder.com/400')
                  }
                  alt={selectedProduct.name}
                  className="product-detail-image"
                />

                {selectedProduct.images && Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {selectedProduct.images.map((imgUrl, idx) => (
                      <img
                        key={idx}
                        src={
                          imgUrl && imgUrl.startsWith('/')
                            ? `http://localhost:3000${imgUrl}`
                            : imgUrl
                        }
                        alt={`gallery-${idx}`}
                        style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '0.5rem', cursor: 'pointer', border: '2px solid transparent', transition: 'border 0.2s' }}
                        onMouseEnter={(e) => e.target.style.border = '2px solid #FFD700'}
                        onMouseLeave={(e) => e.target.style.border = '2px solid transparent'}
                        onClick={() => {
                          // You could add a lightbox here to view full-size image
                          window.open(
                            imgUrl && imgUrl.startsWith('/') ? `http://localhost:3000${imgUrl}` : imgUrl,
                            '_blank'
                          );
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="product-detail-info">
                {selectedProduct.category_name && (
                  <div className="product-category">{selectedProduct.category_name}</div>
                )}

                <h2>{selectedProduct.name}</h2>

                <div className="product-rating">
                  <div className="stars">{renderStars(selectedProduct.average_rating)}</div>
                  <span className="rating-text">
                    {Number(selectedProduct.average_rating).toFixed(1)} ({selectedProduct.total_reviews} reviews)
                  </span>
                </div>

                {selectedProduct.description && (
                  <p className="product-description">{selectedProduct.description}</p>
                )}

                {selectedProduct.notes && (
                  <div className="product-notes">
                    <strong>📝 Note:</strong> {selectedProduct.notes}
                  </div>
                )}

                <div className="product-price">
                  <span className="current-price">${Number(selectedProduct.price).toFixed(2)}</span>
                  {selectedProduct.original_price && Number(selectedProduct.original_price) > Number(selectedProduct.price) && (
                    <>
                      <span className="original-price">${Number(selectedProduct.original_price).toFixed(2)}</span>
                      <span className="discount-badge">
                        {Math.round((1 - Number(selectedProduct.price) / Number(selectedProduct.original_price)) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>

                <button
                  className="btn btn-success"
                  style={{ width: '100%', marginTop: '1rem' }}
                  onClick={() => window.open(selectedProduct.affiliate_link, '_blank')}
                >
                  <span>🛒 Buy Now</span>
                </button>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="reviews-section">
              <h3>⭐ Customer Reviews</h3>

              {user ? (
                <form className="review-form" onSubmit={handleReviewSubmit}>
                  <h4>Leave Your Review</h4>

                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${star <= newReview.rating ? 'active' : ''}`}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        title={`Rate ${star} stars`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <textarea
                    placeholder="Share your thoughts about this product..."
                    value={newReview.comment}
                    onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                  />

                  <button type="submit" className="btn btn-primary">
                    <span>💬 Submit Review</span>
                  </button>
                </form>
              ) : (
                <div className="review-form">
                  <p style={{ textAlign: 'center', color: 'var(--gray)' }}>
                    👤 Please login to leave a review
                  </p>
                  <button className="btn btn-primary" onClick={() => {
                    setSelectedProduct(null);
                    setShowAuth(true);
                  }} style={{ width: '100%' }}>
                    <span>Login / Register</span>
                  </button>
                </div>
              )}

              <div className="reviews-list">
                {reviews.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--gray)', padding: '2rem' }}>
                    No reviews yet. Be the first to review! 🌟
                  </p>
                ) : (
                  reviews.map(review => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <div>
                          <div className="review-author">👤 {review.user_name || 'Anonymous'}</div>
                          <div className="product-rating">
                            <div className="stars">{renderStars(review.rating)}</div>
                          </div>
                        </div>
                        <div className="review-date">
                          {new Date(review.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="review-comment">{review.comment}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
