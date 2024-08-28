import { Router } from 'express';
import { productsController } from '../controllers/productsController.js';
import { auth } from '../middleware/auth.js';
import { isAdmin, isUser } from '../middleware/roleAuth.js';

export const router = Router();

router.get('/', productsController.getProducts);
router.get('/:pid', productsController.getProductById);
router.post('/', auth, productsController.addProducts);
router.put('/:pid', auth, isAdmin, productsController.updateProduct);
router.delete('/:pid', auth, isAdmin, productsController.deleteProduct);