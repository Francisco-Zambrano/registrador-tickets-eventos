import { Router } from 'express';
import ProductManager from '../productManager.js';

const router = Router();

router.get('/', (req, res) => {

    const {limit} = req.query;
    const product = new ProductManager();
    const data = product.getProducts(limit);
    return res.json({data:data})

});

router.get('/:pid', (req, res) => {

    const {pid} = req.params;
    const product = new ProductManager();
    const data = product.getProductById(Number(pid));
    return res.json({data});

});

export default router;