import { DaoFactory } from '../dao/DaoFactory.js';
import { ProductRepository } from '../repositories/ProductRepository.js';
import { ProductDTO } from '../dto/ProductDTO.js';
import { CustomError } from '../utils/CustomError.js';
import { TYPES_OF_ERROR } from '../utils/errorTypes.js';

const daoType = process.env.DAO_TYPE || 'mongo';
const { productDao } = DaoFactory.getDao(daoType);
const productRepository = new ProductRepository(productDao);

export class productsController {

    static getProducts = async (req, res, next) => {
        try {
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const sort = req.query.sort || 'asc';

            const options = { page, limit, lean: true };
            const result = await productRepository.getAll({}, options);
            const products = result.docs || result;

            if (!Array.isArray(products)) {
                throw CustomError.createError(
                    "InvalidDataError",
                    new Error('Invalid data'),
                    'The data retrieved is not in a valid format',
                    TYPES_OF_ERROR.INTERNAL_SERVER_ERROR
                );
            }

            const productDTOs = products.map(product => new ProductDTO(product));
            return res.json({
                products: productDTOs,
                page,
                limit,
                totalPages: result.totalPages || 1,
                totalDocs: result.totalDocs || products.length,
                hasPrevPage: result.hasPrevPage || false,
                hasNextPage: result.hasNextPage || false,
                prevPage: result.prevPage || null,
                nextPage: result.nextPage || null
            });
        } catch (error) {
            next(error);
        }
    };

    static getProductById = async (req, res, next) => {
        try {
            const { pid } = req.params;
            const product = await productRepository.getById({ _id: pid });
            if (!product) {
                throw CustomError.createError(
                    "NotFoundError",
                    new Error(`Product with id ${pid} not found`),
                    'Product not found',
                    TYPES_OF_ERROR.NOT_FOUND
                );
            }
            return res.json(new ProductDTO(product));
        } catch (error) {
            next(error);
        }
    };

    static addProducts = async (req, res, next) => {
        try {
            const productData = req.body;
            const product = await productRepository.create(productData);
            return res.status(201).json({ product: new ProductDTO(product) });
        } catch (error) {
            if (error.code === 11000) {
                next(CustomError.createError(
                    "DuplicateError",
                    error,
                    'Product already exists',
                    TYPES_OF_ERROR.DATA_TYPE
                ));
            } else {
                next(error);
            }
        }
    };

    static updateProduct = async (req, res, next) => {
        try {
            const { pid } = req.params;
            const newData = req.body;
            const updatedProduct = await productRepository.update(pid, newData);
            if (!updatedProduct) {
                throw CustomError.createError(
                    "NotFoundError",
                    new Error(`Product with id ${pid} not found`),
                    'Product not found',
                    TYPES_OF_ERROR.NOT_FOUND
                );
            }
            return res.json(new ProductDTO(updatedProduct));
        } catch (error) {
            next(error);
        }
    };

    static deleteProduct = async (req, res, next) => {
        try {
            const { pid } = req.params;
            const deletedProduct = await productRepository.delete(pid);
            if (!deletedProduct) {
                throw CustomError.createError(
                    "NotFoundError",
                    new Error(`Product with id ${pid} not found`),
                    'Product not found',
                    TYPES_OF_ERROR.NOT_FOUND
                );
            }
            return res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            next(error);
        }
    };

};