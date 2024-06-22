import { DaoFactory } from '../dao/DaoFactory.js';
import { CartRepository } from '../repositories/CartRepository.js';
import { CartDTO } from '../dto/CartDTO.js';

const daoType = process.env.DAO_TYPE || 'mongo';
const { cartDao } = DaoFactory.getDao(daoType);

const cartRepository = new CartRepository(cartDao);

export class cartsController {

    static createCart = async (req, res) => {

        try {
            const cart = await cartRepository.create({ products: [] });
            res.json({ msg: 'Cart created', cart: new CartDTO(cart) });
        } catch (error) {
            console.error('Error creating cart:', error);
            res.status(500).json({ msg: 'Internal server error' });
        }

    };

    static getCartById = async (req, res) => {

        try {
            const { cid } = req.params;
            const cart = await cartRepository.getBy({ _id: cid });
            if (cart) {
                res.json({ cart: new CartDTO(cart) });
            } else {
                res.status(404).json({ msg: 'Cart not found' });
            }
        } catch (error) {
            console.error('Error getting cart:', error);
            res.status(500).json({ msg: 'Internal server error' });
        }

    };

    static addProductOnCart = async (req, res) => {

        try {
            const { cid, pid } = req.params;
            const cart = await cartRepository.addProduct(cid, pid);
            res.json({ msg: 'Product added to cart', cart: new CartDTO(cart) });
        } catch (error) {
            console.error('Error adding product to cart:', error);
            res.status(500).json({ msg: 'Internal server error' });
        }

    };

    static deleteCart = async (req, res) => {

        try {
            const { cid } = req.params;
            await cartRepository.delete(cid);
            res.json({ msg: 'Cart deleted' });
        } catch (error) {
            console.error('Error deleting cart:', error);
            res.status(500).json({ msg: 'Internal server error' });
        }

    };

    static deleteCartProduct = async (req, res) => {

        try {
            const { cid, pid } = req.params;
            const cart = await cartRepository.deleteProduct(cid, pid);
            res.json({ msg: 'Product deleted from cart', cart: new CartDTO(cart) });
        } catch (error) {
            console.error('Error deleting product from cart:', error);
            res.status(500).json({ msg: 'Internal server error' });
        }

    };

    static getCartPopulate = async (req, res) => {

        try {
            const { cid } = req.params;
            const cart = await cartRepository.getBy({ _id: cid }, { populate: 'products.id' });
            if (cart) {
                res.json({ cart: new CartDTO(cart) });
            } else {
                res.status(404).json({ msg: 'Cart not found' });
            }
        } catch (error) {
            console.error('Error getting cart:', error);
            res.status(500).json({ msg: 'Internal server error' });
        }

    };

    static updateProductQuantity = async (req, res) => {

        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const cart = await cartRepository.updateProductQuantity(cid, pid, quantity);
            res.json({ msg: 'Product quantity updated in cart', cart: new CartDTO(cart) });
        } catch (error) {
            console.error('Error handling request:', error);
            res.status(500).json({ msg: 'Internal server error' });
        }

    };

    static addProduct = async (req, res) => {

        try {
            const { productId } = req.body;
            const userCart = req.user.cart;
    
            if (!userCart) {
                return res.status(400).json({ msg: 'Cart not found for user' });
            }
    
            const cart = await cartRepository.addProduct(userCart, productId);
            res.json({ msg: 'Product added to cart', cart: new CartDTO(cart) });
        } catch (error) {
            console.error('Error adding product to cart:', error);
            res.status(500).json({ msg: 'Internal server error' });
        }

    };
    
};