import { Router } from 'express';
import {CartManagerMongo} from '../dao/cartManagerMONGO.js';

export const router = Router();

const cartManager = new CartManagerMongo();

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);
        if (cart) {
            res.json({ cart });
        } else {
            res.status(404).json({ msg: 'Cart not found' });
        }
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const cart = await cartManager.createCart();
        res.json({ msg: 'Cart created', cart });
    } catch (error) {
        console.error('Error creating cart:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartManager.addProduct(cid, pid);
        res.json({ msg: 'Product added to cart', cart });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        await cartManager.deleteCart(cid);
        res.json({ msg: 'Cart deleted' });
    } catch (error) {
        console.error('Error deleting cart:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartManager.deleteProduct(cid, pid);
        res.json({ msg: 'Product deleted from cart', cart });
    } catch (error) {
        console.error('Error deleting product from cart:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        const cart = await cartManager.updateCart(cid, products);
        res.json({ msg: 'Cart updated', cart });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await cartManager.updateProductQuantity(cid, pid, quantity);
        res.json({ msg: 'Product quantity updated in cart', cart });
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});
