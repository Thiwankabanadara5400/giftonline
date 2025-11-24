import React, { useState } from 'react';
import ProductCard from './ProductCard.jsx';
import '../styles/ProductList.css';

const ProductList = ({ products, categories, loading }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products?.filter((product) => {
    const categoryMatch = !selectedCategory || product.category_id === parseInt(selectedCategory);
    const searchMatch = !searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <div className="product-list-container">
      <div className="filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="category-filter">
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
          >
            <option value="">All Categories</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="loading">Loading products...</p>
      ) : filteredProducts?.length === 0 ? (
        <p className="no-products">No products found.</p>
      ) : (
        <div className="product-grid">
          {filteredProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
