import { DaoFactory } from '../dao/DaoFactory.js';
import { ProductRepository } from '../repositories/ProductRepository.js';
import { ProductDTO } from '../dto/ProductDTO.js';

const daoType = process.env.DAO_TYPE || 'mongo';
const { productDao } = DaoFactory.getDao(daoType);

const productRepository = new ProductRepository(productDao);

export class productsController {

    static getProducts = async (req, res) => {

        try {
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const sort = req.query.sort || 'asc';

            const options = { page, limit, lean: true };

            const result = await productRepository.getBy({}, options);
            const products = result.docs || result;

            if (!Array.isArray(products)) {
                throw new Error('Invalid data format from repository');
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
            console.error('Error fetching products:', error);
            return res.status(500).send('Internal server error');
        }
        
    };


    static getProductById = async (req, res) => {

        try {
            const { pid } = req.params;
            const product = await productRepository.getBy({ _id: pid });
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            return res.json(new ProductDTO(product));
        } catch (error) {
            console.error('Error fetching product by id:', error);
            return res.status(500).send('Internal server error');
        }

    };


    static addProducts = async (req, res) => {
        try {
            const productData = req.body;
            const product = await productRepository.create(productData);
            return res.status(201).json({ product: new ProductDTO(product) });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ error: 'Product already exists' });
            }
            console.error('Error adding product:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    };


    static updateProduct = async (req, res) => {

        try {
            const { pid } = req.params;
            const newData = req.body;
            const updatedProduct = await productRepository.update(pid, newData);
            if (!updatedProduct) {
                return res.status(404).json({ error: 'Product not found' });
            }
            return res.json(new ProductDTO(updatedProduct));
        } catch (error) {
            console.error('Error updating product:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

    };


    static deleteProduct = async (req, res) => {

        try {
            const { pid } = req.params;
            const deletedProduct = await productRepository.delete(pid);
            if (!deletedProduct) {
                return res.status(404).json({ error: 'Product not found' });
            }
            return res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            console.error('Error deleting product:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

    };

};