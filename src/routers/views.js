import { Router } from 'express';
import ProductManager from '../productManager.js';

const router = Router();

router.get('/', (req, res) => {

    const product = new ProductManager();
    const products = product.getProducts();

    return res.render('home', {products});
})



export default router;