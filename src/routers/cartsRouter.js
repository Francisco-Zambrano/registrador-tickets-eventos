import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { cartsController } from '../controllers/cartsController.js';

export const router = Router();

router.post('/', cartsController.createCart);
router.get('/:cid', cartsController.getCartById);
router.post('/:cid/products/:pid', cartsController.addProductOnCart);
router.delete('/:cid', cartsController.deleteCart);
router.delete('/:cid/products/:pid', cartsController.deleteCartProduct);
router.get('/:cid', auth, cartsController.getCartPopulate);
router.put('/:cid/products/:pid', cartsController.updateProductQuantity);
router.post('/add-product', auth, cartsController.addProduct);