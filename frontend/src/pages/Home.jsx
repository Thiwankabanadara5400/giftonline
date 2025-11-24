import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to GiftOnline.com</h1>
          <p>Discover the perfect gifts for every occasion</p>
          <Link to="/products" className="btn-primary">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <h3>Wide Selection</h3>
          <p>Browse through thousands of unique gift ideas</p>
        </div>
        <div className="feature">
          <h3>Fast Delivery</h3>
          <p>Get your gifts delivered quickly and safely</p>
        </div>
        <div className="feature">
          <h3>Great Prices</h3>
          <p>Find affordable gifts for every budget</p>
        </div>
        <div className="feature">
          <h3>Customer Reviews</h3>
          <p>Read reviews from other customers to make informed decisions</p>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to find the perfect gift?</h2>
        <Link to="/products" className="btn-secondary">
          Browse Products
        </Link>
      </section>
    </div>
  );
};

export default Home;
