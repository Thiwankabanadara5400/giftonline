import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewForm from '../components/ReviewForm.jsx';
import { productsAPI, reviewsAPI } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const productRes = await productsAPI.getProductById(id);
      setProduct(productRes.data);

      const reviewsRes = await reviewsAPI.getReviewsByProduct(id);
      setReviews(reviewsRes.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      setSubmittingReview(true);
      await reviewsAPI.createReview({
        ...reviewData,
        productId: parseInt(id),
      });
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="error-message">Product not found</div>;

  return (
    <div className="product-detail-page">
      <button onClick={() => navigate('/products')} className="back-btn">
        &larr; Back to Products
      </button>

      <div className="product-detail">
        <div className="product-image-section">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} />
          ) : (
            <div className="placeholder-image">No Image</div>
          )}
        </div>

        <div className="product-info-section">
          <h1>{product.name}</h1>
          <p className="category">{product.category_name}</p>
          <p className="description">{product.description}</p>
          <div className="product-meta">
            <span className="price">${product.price}</span>
            <span className="stock">
              Stock: {product.stock > 0 ? product.stock : 'Out of Stock'}
            </span>
          </div>
          <button className="btn-add-to-cart" disabled={product.stock === 0}>
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        {isAuthenticated && (
          <ReviewForm onSubmit={handleReviewSubmit} loading={submittingReview} />
        )}
        {!isAuthenticated && (
          <p className="login-prompt">
            <a href="/login">Login</a> to write a review
          </p>
        )}

        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <strong>{review.user_name}</strong>
                  <span className="rating">
                    {'⭐'.repeat(review.rating)}
                  </span>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
