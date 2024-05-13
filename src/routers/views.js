import { Router } from 'express';
import { productsModel } from '../dao/models/productsModel.js';
import { messagesModel } from '../dao/models/messagesModel.js'
import productManager from '../dao/productManagerMONGO.js';
import { cartsModel } from '../dao/models/cartsModel.js';


const router = Router();

router.get('/', async (req, res) => {

    try {
        const products = await productsModel.find().lean();
        return res.render('home', { products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).send('Internal server error');
    }

});


router.get('/products', async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = 10;
        const sort = req.query.sort || 'asc'; 
        const options = { page: parseInt(page), limit: parseInt(limit), lean: true };

        const result = await productManager.getProducts(options, sort);
        const { docs: products, totalPages, totalDocs, hasPrevPage, hasNextPage, prevPage, nextPage } = result;

        return res.render('products', { products, page, limit, totalPages, totalDocs, hasPrevPage, hasNextPage, prevPage, nextPage });
        
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).send('Internal server error');
    }
});


router.get('/realtimeproducts', (req, res) => {
    return res.render('realTimeProducts');
});


router.get('/chat', async (req, res) => {
    const messages = await messagesModel.find().lean();
    return res.render('chat', {messages});
});


router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartsModel.findById(cid).lean();
        const productIds = cart.products.map(product => product.id);
        const products = await productsModel.find({ _id: { $in: productIds } }).lean();

        cart.products = cart.products.map(cartProduct => {
            const foundProduct = products.find(product => product._id.toString() === cartProduct.id.toString());
            if (foundProduct) {
                return {
                    ...cartProduct,
                    quantity: cartProduct.quantity,
                    title: foundProduct.title,
                    code: foundProduct.code,
                    description: foundProduct.description,
                    category: foundProduct.category,
                    price: foundProduct.price
                };
            }
            return cartProduct;
        });
        
        res.render('cart', { cart });
        
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).send('Internal server error');
    }
});


export default router;