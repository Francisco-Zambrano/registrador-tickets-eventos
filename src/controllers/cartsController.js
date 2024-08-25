import { DaoFactory } from '../dao/DaoFactory.js';
import { CartRepository } from '../repositories/CartRepository.js';
import { CartDTO } from '../dto/CartDTO.js';
import { ProductRepository } from '../repositories/ProductRepository.js';
import { TicketRepository } from '../repositories/TicketRepository.js';
import { TicketDTO } from '../dto/TicketDTO.js';
import { CustomError } from '../utils/CustomError.js';
import { TYPES_OF_ERROR } from '../utils/errorTypes.js';
import { logger } from '../utils/logger.js';

const daoType = process.env.DAO_TYPE || 'mongo';
const { cartDao, productDao } = DaoFactory.getDao(daoType);

const cartRepository = new CartRepository(cartDao);
const productRepository = new ProductRepository(productDao);
const ticketRepository = new TicketRepository();

export class cartsController {

    static createCart = async (req, res, next) => {
        try {
            const cart = await cartRepository.create({ products: [] });
            res.json({ msg: 'Cart created', cart: new CartDTO(cart) });
        } catch (error) {
            next(error);
        }
    };

    static getCartById = async (req, res, next) => {
        try {
            const { cid } = req.params;
            const cart = await cartRepository.getById({ _id: cid });
            if (!cart) {
                throw CustomError.createError(
                    "NotFoundError",
                    new Error(`Cart with id ${cid} not found`),
                    'Cart not found',
                    TYPES_OF_ERROR.NOT_FOUND
                );
            }
            res.json({ cart: new CartDTO(cart) });
        } catch (error) {
            next(error);
        }
    };

    static addProductOnCart = async (req, res, next) => {
        try {
            const { cid, pid } = req.params;
            logger.debug(`Adding product to cart - Cart ID: ${cid}, Product ID: ${pid}`);
            
            const product = await productRepository.getById(pid);
            if (!product) {
                throw CustomError.createError(
                    "NotFoundError",
                    new Error(`Product with id ${pid} not found`),
                    'Product not found',
                    TYPES_OF_ERROR.NOT_FOUND
                );
            }

            const cart = await cartRepository.addProduct(cid, pid);
            res.json({ msg: 'Product added to cart', cart: new CartDTO(cart) });
        } catch (error) {
            next(error);
        }
    };

    static deleteCart = async (req, res, next) => {
        try {
            const { cid } = req.params;
            const deletedCart = await cartRepository.delete(cid);
            if (!deletedCart) {
                throw CustomError.createError(
                    "NotFoundError",
                    new Error(`Cart with id ${cid} not found`),
                    'Cart not found',
                    TYPES_OF_ERROR.NOT_FOUND
                );
            }
            res.json({ msg: 'Cart deleted' });
        } catch (error) {
            next(error);
        }
    };

    static deleteCartProduct = async (req, res, next) => {
        try {
            const { cid, pid } = req.params;
            const cart = await cartRepository.deleteProduct(cid, pid);
            if (!cart) {
                throw CustomError.createError(
                    "NotFoundError",
                    new Error(`Product with id ${pid} not found in cart with id ${cid}`),
                    'Product not found in cart',
                    TYPES_OF_ERROR.NOT_FOUND
                );
            }
            res.json({ msg: 'Product deleted from cart', cart: new CartDTO(cart) });
        } catch (error) {
            next(error);
        }
    };

    static getCartPopulate = async (req, res, next) => {
        try {
            const { cid } = req.params;
            const cart = await cartRepository.getById({ _id: cid }, { populate: 'products.id' });
            if (!cart) {
                throw CustomError.createError(
                    "NotFoundError",
                    new Error(`Cart with id ${cid} not found`),
                    'Cart not found',
                    TYPES_OF_ERROR.NOT_FOUND
                );
            }
            res.json({ cart: new CartDTO(cart) });
        } catch (error) {
            next(error);
        }
    };

    static updateProductQuantity = async (req, res, next) => {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const cart = await cartRepository.updateProductQuantity(cid, pid, quantity);
            if (!cart) {
                throw CustomError.createError(
                    "NotFoundError",
                    new Error(`Product with id ${pid} not found in cart with id ${cid}`),
                    'Product not found in cart',
                    TYPES_OF_ERROR.NOT_FOUND
                );
            }
            res.json({ msg: 'Product quantity updated in cart', cart: new CartDTO(cart) });
        } catch (error) {
            next(error);
        }
    };

    static addProduct = async (req, res, next) => {
        try {
            const { productId } = req.body;
            const userCart = req.user.cart;

            if (!userCart) {
                throw CustomError.createError(
                    "NotFoundError",
                    new Error('Cart not found'),
                    'User cart not found',
                    TYPES_OF_ERROR.NOT_FOUND
                );
            }

            const cart = await cartRepository.addProduct(userCart, productId);
            res.json({ msg: 'Product added to cart', cart: new CartDTO(cart) });
        } catch (error) {
            next(error);
        }
    };

    static purchaseCart = async (req, res, next) => {
        try {
            const { cid } = req.params;
            const cart = await cartRepository.getById(cid);

            if (!cart) {
                throw CustomError.createError(
                    "NotFoundError",
                    new Error(`Cart with id ${cid} not found`),
                    'Cart not found',
                    TYPES_OF_ERROR.NOT_FOUND
                );
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
            next(error);
        }
    };

};