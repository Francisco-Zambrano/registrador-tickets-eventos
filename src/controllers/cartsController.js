import { DaoFactory } from '../dao/DaoFactory.js';
import { CartRepository } from '../repositories/CartRepository.js';
import { CartDTO } from '../dto/CartDTO.js';
import { ProductRepository } from '../repositories/ProductRepository.js';
import { TicketRepository } from '../repositories/TicketRepository.js';
import { TicketDTO } from '../dto/TicketDTO.js';


const daoType = process.env.DAO_TYPE || 'mongo';
const { cartDao, productDao } = DaoFactory.getDao(daoType);

const cartRepository = new CartRepository(cartDao);
const productRepository = new ProductRepository(productDao);
const ticketRepository = new TicketRepository();

export class cartsController {

    static createCart = async (req, res) => {

        try {
            const cart = await cartRepository.create({ products: [] });
            res.json({ msg: 'Cart created', cart: new CartDTO(cart) });
        } catch (error) {
            console.error('Error creating cart:', error);
            res.status(500).json({ msg: 'Server error' });
        }

    };

    static getCartById = async (req, res) => {

        try {
            const { cid } = req.params;
            const cart = await cartRepository.getById({ _id: cid });
            if (cart) {
                res.json({ cart: new CartDTO(cart) });
            } else {
                res.status(404).json({ msg: 'Cart not found' });
            }
        } catch (error) {
            console.error('Error getting cart:', error);
            res.status(500).json({ msg: 'Server error' });
        }

    };

    static addProductOnCart = async (req, res) => {

        try {
            const { cid, pid } = req.params;
            const cart = await cartRepository.addProduct(cid, pid);
            res.json({ msg: 'Product added to cart', cart: new CartDTO(cart) });
        } catch (error) {
            console.error('Error adding product to cart:', error);
            res.status(500).json({ msg: 'Server error' });
        }

    };

    static deleteCart = async (req, res) => {

        try {
            const { cid } = req.params;
            await cartRepository.delete(cid);
            res.json({ msg: 'Cart deleted' });
        } catch (error) {
            console.error('Error deleting cart:', error);
            res.status(500).json({ msg: 'Server error' });
        }

    };

    static deleteCartProduct = async (req, res) => {

        try {
            const { cid, pid } = req.params;
            const cart = await cartRepository.deleteProduct(cid, pid);
            res.json({ msg: 'Product deleted from cart', cart: new CartDTO(cart) });
        } catch (error) {
            console.error('Error deleting product from cart:', error);
            res.status(500).json({ msg: 'Server error' });
        }

    };

    static getCartPopulate = async (req, res) => {

        try {
            const { cid } = req.params;
            const cart = await cartRepository.getById({ _id: cid }, { populate: 'products.id' });
            if (cart) {
                res.json({ cart: new CartDTO(cart) });
            } else {
                res.status(404).json({ msg: 'Cart not found' });
            }
        } catch (error) {
            console.error('Error getting cart:', error);
            res.status(500).json({ msg: 'Server error' });
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
            res.status(500).json({ msg: 'Server error' });
        }

    };

    static addProduct = async (req, res) => {

        try {
            const { productId } = req.body;
            const userCart = req.user.cart;
    
            if (!userCart) {
                return res.status(400).json({ msg: 'Cart not found' });
            }
    
            const cart = await cartRepository.addProduct(userCart, productId);
            res.json({ msg: 'Product added to cart', cart: new CartDTO(cart) });
        } catch (error) {
            console.error('Error adding product to cart:', error);
            res.status(500).json({ msg: 'Server error' });
        }

    };

    static purchaseCart = async (req, res) => {

        try {
            const { cid } = req.params;
            const cart = await cartRepository.getById(cid);

            if (!cart) {
                return res.status(404).json({ msg: 'Cart not found' });
            }

            const productsToPurchase = [];
            const productsNotPurchased = [];

            for (const item of cart.products) {
                const product = await productRepository.getById(item.id._id);

                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await productRepository.update(product._id, { stock: product.stock });
                    productsToPurchase.push({
                        ...item.id._doc,
                        quantity: item.quantity
                    });
                } else {
                    productsNotPurchased.push(item);
                }
            }

            if (productsToPurchase.length > 0) {
                const amount = productsToPurchase.reduce((total, item) => total + item.quantity * item.price, 0);
                const purchaser = req.user.email;
                const ticketData = { amount, purchaser };
                const ticket = await ticketRepository.create(ticketData);

                cart.products = productsNotPurchased;
                await cartRepository.update(cart.id, { products: cart.products });

                return res.status(201).json({
                    msg: 'Purchase completed',
                    ticket: new TicketDTO(ticket),
                    notPurchased: productsNotPurchased.map(item => item.id._id)
                });
            } else {
                return res.status(200).json({ msg: 'No products were purchased', notPurchased: productsNotPurchased.map(item => item.id._id) });
            }
        } catch (error) {
            console.error('Error purchasing cart:', error);
            res.status(500).json({ msg: 'Internal server error' });
        }

    };

};