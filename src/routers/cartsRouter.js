import { Router } from 'express';
import {CartManagerMongo} from '../dao/cartManagerMONGO.js';
import { auth } from '../middleware/auth.js';

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


router.get('/:cid', auth, async (req, res) => {

    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid).populate('products.id');
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



router.post('/add-product', auth, async (req, res) => {
    try {
        const { productId } = req.body;
        const userCart = req.user.cart;

        if (!userCart) {
            return res.status(400).json({ msg: 'Cart not found for user' });
        }

        const cart = await cartManager.addProduct(userCart, productId);
        res.json({ msg: 'Product added to cart', cart });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});