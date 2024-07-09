import { DaoFactory } from '../dao/DaoFactory.js';
import { ProductRepository } from '../repositories/ProductRepository.js';
import { CartRepository } from '../repositories/CartRepository.js';
import { ProductDTO } from '../dto/ProductDTO.js';
import { CartDTO } from '../dto/CartDTO.js';
import { messagesModel } from '../dao/models/messagesModel.js';
import { logger } from '../utils/logger.js';

const daoType = process.env.DAO_TYPE || 'mongo';
const { productDao, cartDao } = DaoFactory.getDao(daoType);

const productRepository = new ProductRepository(productDao);
const cartRepository = new CartRepository(cartDao);

export class viewsController {

    static getProducts = async (req, res) => {
        try {
            const result = await productRepository.getBy({}, { lean: true });
            if (!result || !Array.isArray(result.docs)) {
                throw new Error('Invalid data');
            }
            const products = result.docs.map(product => new ProductDTO(product));
            return res.render('home', { products });
        } catch (error) {
            logger.error('Error fetching products:', error);
            return res.status(500).send('Server error');
        }
    };

    static getAllProducts = async (req, res) => {
        try {
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = 8;
            const sort = req.query.sort || 'asc';
            const options = { page, limit, lean: true };

            const result = await productRepository.getBy({}, options);
            if (!result || !Array.isArray(result.docs)) {
                throw new Error('Invalid data');
            }
            const products = result.docs.map(product => new ProductDTO(product));
            return res.render('products', {
                products,
                page,
                limit,
                totalPages: result.totalPages,
                totalDocs: result.totalDocs,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                user: req.user
            });
        } catch (error) {
            logger.error('Error fetching products:', error);
            return res.status(500).send('Server error');
        }
    };

    static getMessages = async (req, res) => {
        try {
            const messages = await messagesModel.find().lean();
            return res.render('chat', { messages });
        } catch (error) {
            logger.error('Error fetching messages:', error);
            return res.status(500).send('Server error');
        }
    };

    static getCartById = async (req, res) => {
        try {
            const userCart = await cartRepository.getById(req.user.cart, { populate: 'products.id' });
            if (!userCart) {
                return res.status(404).send('Cart not found');
            }
            // const cartDTO = new CartDTO(userCart);
            // res.render('cart', { cart: cartDTO });
            res.render('cart', { cart: userCart });
        } catch (error) {
            logger.error(`Error fetching cart: ${error.message}`);
            res.status(500).send(`Server error: ${error.message}`);
        }
    };

};