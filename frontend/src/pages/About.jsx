import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-page">
      <h1>About GiftOfficial</h1>
      <section className="about-content">
        <h2>Our Story</h2>
        <p>
          GiftOfficial was founded with a simple mission: to make finding the
          perfect gift easy and enjoyable for everyone. We believe that the best
          gifts come from the heart, and we're here to help you find something
          special for every person and occasion in your life.
        </p>

        <h2>Our Mission</h2>
        <p>
          To provide a curated selection of high-quality gifts that bring joy
          and create memorable moments. We're committed to exceptional customer
          service and affordable prices.
        </p>

        <h2>Why Choose Us?</h2>
        <ul>
          <li>Carefully selected products from trusted suppliers</li>
          <li>Competitive prices and regular discounts</li>
          <li>Fast and reliable shipping</li>
          <li>Excellent customer support</li>
          <li>Easy returns and exchanges</li>
          <li>Secure payment processing</li>
        </ul>

        <h2>Contact Us</h2>
        <p>
          Have questions? We'd love to hear from you!
          <br />
          Email: info@giftonline.com
          <br />
          Phone: +1 (555) 123-4567
        </p>
      </section>
    </div>
  );
};

export default About;
