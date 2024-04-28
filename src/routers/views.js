import { Router } from 'express';
import ProductManager from '../dao/productManagerMONGO.js';

const router = Router();

router.get('/', (req, res) => {

    const product = new ProductManager();
    const products = product.getProducts();

    return res.render('home', {products});
});

router.get('/realtimeproducts', (req, res) => {
    return res.render('realTimeProducts');
});



export default router;