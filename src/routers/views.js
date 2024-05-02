import { Router } from 'express';
import { productsModel } from '../dao/models/productsModel.js';
import {messagesModel} from '../dao/models/messagesModel.js'

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

router.get('/chat', async (req, res) => {
    const messages = await messagesModel.find().lean();
    return res.render('chat', {messages});
});

export default router;