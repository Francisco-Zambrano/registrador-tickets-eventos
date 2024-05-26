import { Router } from 'express';
import { productsModel } from '../dao/models/productsModel.js';
import { messagesModel } from '../dao/models/messagesModel.js'
import productManager from '../dao/productManagerMONGO.js';
import { cartsModel } from '../dao/models/cartsModel.js';
import { auth } from '../middleware/auth.js';


export const router = Router();

router.get('/', async (req, res) => {

    try {
        const products = await productsModel.find().lean();
        return res.render('home', { products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).send('Internal server error');
    }

});


router.get('/products', auth, async (req, res) => {
    
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = 10;
        const sort = req.query.sort || 'asc'; 
        const options = { page: parseInt(page), limit: parseInt(limit), lean: true };

        const result = await productManager.getProducts(options, sort);
        const { docs: products, totalPages, totalDocs, hasPrevPage, hasNextPage, prevPage, nextPage } = result;

        return res.render('products', { products, page, limit, totalPages, totalDocs, hasPrevPage, hasNextPage, prevPage, nextPage, login: req.session.user });
        
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


router.get('/carts/:cid', auth, async (req, res) => {

    try {
        const userCart = await cartsModel.findById(req.user.cart).populate('products.id').lean();
        if (!userCart) {
            return res.status(404).send('Cart not found');
        }

        res.render('cart', { cart: userCart });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).send('Internal server error');
    }

});


router.get('/register',(req,res)=>{
    res.status(200).render('register')
})

router.get('/login',(req,res)=>{
    let {error}=req.query
    res.status(200).render('login', {error})
})

router.get('/profile', auth, (req,res)=>{
    res.status(200).render('profile',{
        user:req.session.user
    })
})