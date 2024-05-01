import { Router } from 'express';
import { productsModel } from '../dao/models/productsModel.js';

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

router.get('/realtimeproducts', (req, res) => {
    return res.render('realTimeProducts');
});

router.get('/chat', (req, res) => {
    return res.render('chat');
});

export default router;