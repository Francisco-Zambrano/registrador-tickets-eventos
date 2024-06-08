import { Router } from 'express';
import { productsController } from '../controllers/productsController.js';

export const router = Router();

router.get('/', productsController.getProducts);
router.get('/:pid', productsController.getProductById);
router.post('/', productsController.addProducts);
router.put('/:pid', productsController.updateProduct);
router.delete('/:pid', productsController.deleteProduct);