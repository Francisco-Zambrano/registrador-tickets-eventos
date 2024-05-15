import { Router } from 'express';
import productManager from '../dao/productManagerMONGO.js';

export const router = Router();

router.get('/', async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const sort = req.query.sort || 'asc';

        const options = { page, limit, lean: true };

        const result = await productManager.getProducts(options, sort);
        const { docs: products, totalPages, totalDocs, hasPrevPage, hasNextPage, prevPage, nextPage } = result;

        return res.json({ products, page, limit, totalPages, totalDocs, hasPrevPage, hasNextPage, prevPage, nextPage });
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).send('Internal server error');
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.json(product);
    } catch (error) {
        console.error('Error fetching product by id:', error);
        return res.status(500).send('Internal server error');
    }
});

router.post('/', async (req, res) => {
    try {
        const productData = req.body;
        const product = await productManager.addProduct(productData);
        return res.status(201).json({ product });
    } catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const newData = req.body;
        const updatedProduct = await productManager.updateProduct(pid, newData);
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const deletedProduct = await productManager.deleteProduct(pid);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});