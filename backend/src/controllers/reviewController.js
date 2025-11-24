import { Review } from '../models/Review.js';
import db from '../config/database.js';

export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.findByProductId(productId);
    res.json(reviews || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!productId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Product ID and rating (1-5) are required' });
    }

    // Check if user already reviewed this product
    const existingReview = await db('reviews')
      .where('product_id', productId)
      .where('user_id', req.user.id)
      .first();

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      product_id: productId,
      user_id: req.user.id,
      rating,
      comment: comment || null,
      created_at: new Date(),
    });

    res.status(201).json({
      message: 'Review created successfully',
      review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;
    const { rating, comment } = req.body;

    const existingReview = await Review.findById(id);
    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (existingReview.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const review = await Review.update(id, {
      rating: rating || existingReview.rating,
      comment: comment !== undefined ? comment : existingReview.comment,
      updated_at: new Date(),
    });

    res.json({
      message: 'Review updated successfully',
      review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Review.delete(id);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.all();
    res.json(reviews || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
