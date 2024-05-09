import { Router } from 'express';
import { addProduct, createCart, deleteCart, deleteProduct, getCartById, updateCart, updateProductQuantity } from '../dao/cartManagerMONGO.js';

const router = Router();

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await getCartById(cid);
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
        const cart = await createCart();
        res.json({ msg: 'Cart created', cart });
    } catch (error) {
        console.error('Error creating cart:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});


router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await addProduct(cid, pid);
        res.json({ msg: 'Product added to cart', cart });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});


router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        await deleteCart(cid);
        res.json({ msg: 'Cart deleted' });
    } catch (error) {
        console.error('Error deleting cart:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});


router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await deleteProduct(cid, pid);
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
        const cart = await updateCart(cid, products);
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
        const cart = await updateProductQuantity(cid, pid, quantity);
        res.json({ msg: 'Product quantity updated in cart', cart });
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});


export default router;