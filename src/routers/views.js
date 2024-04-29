import { Router } from 'express';
import { productsModel } from '../dao/models/productsModel.js';
import { getProducts } from '../dao/productManagerMONGO.js';

const router = Router();

router.get('/', async (req, res) => {

    try {
        const products = await productsModel.find();
        return res.render('home', { products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).send('Internal server error');
    }

});

router.get('/realtimeproducts', (req, res) => {
    return res.render('realTimeProducts');
});

export default router;