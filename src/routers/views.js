import { Router } from 'express';
import { productsModel } from '../dao/models/productsModel.js';
import { messagesModel } from '../dao/models/messagesModel.js'
import { getProducts } from '../dao/productManagerMONGO.js';


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

        const result = await getProducts(req, res, options, sort); 
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

router.get('/cart', (req, res) => {
    res.render('cart');
});

export default router;