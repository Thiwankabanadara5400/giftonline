import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} />
        ) : (
          <div className="placeholder-image">No Image</div>
        )}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="category">{product.category_name}</p>
        <p className="description">{product.description?.substring(0, 100)}...</p>
        <div className="product-footer">
          <span className="price">${product.price}</span>
          <Link to={`/product/${product.id}`} className="btn-view">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
