import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', reviewController.getAllReviews);
router.get('/product/:productId', reviewController.getReviewsByProduct);
router.post('/product/:productId', verifyToken, reviewController.createReview);
router.get('/:id', reviewController.getReviewById);
router.put('/:id', verifyToken, reviewController.updateReview);
router.delete('/:id', verifyToken, reviewController.deleteReview);

export default router;
