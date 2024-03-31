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

router.post('/', (req, res) => {
    const {title, description, price, thumbnail, code, stock, status, category} = req.body;
    const product = new ProductManager();
    const result = product.addProduct(title, description, price, thumbnail, code, stock, status, category)
    return res.json({result});
})

router.put('/:pid', (req, res) => {
    const {pid} = req.params;
    const product = new ProductManager();
    const result = product.updateProduct(Number(pid), req.body)
    return res.json({result});
})

router.delete('/:pid', (req, res) => {
    const {pid} = req.params;
    const product = new ProductManager();
    const result = product.deleteProduct(Number(pid), req.body)
    return res.json({result});
})



export default router;