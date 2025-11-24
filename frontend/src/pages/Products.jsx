import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList.jsx';
import { productsAPI, categoriesAPI } from '../services/api.js';
import '../styles/Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        productsAPI.getAllProducts(),
        categoriesAPI.getAllCategories(),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="products-page">
      <h1>Our Products</h1>
      {error && <div className="error-message">{error}</div>}
      <ProductList
        products={products}
        categories={categories}
        loading={loading}
      />
    </div>
  );
};

export default Products;
