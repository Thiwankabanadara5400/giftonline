import express from 'express';
import * as productController from '../controllers/productController.js';
import { verifyToken } from '../middleware/auth.js';
import { validateCreateProduct } from '../middleware/validation.js';

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:id', productController.getProductById);
router.post('/', verifyToken, validateCreateProduct, productController.createProduct);
router.put('/:id', verifyToken, productController.updateProduct);
router.delete('/:id', verifyToken, productController.deleteProduct);

export default router;
