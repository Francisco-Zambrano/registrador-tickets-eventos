import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { viewsController } from '../controllers/viewsController.js';
import { isAdmin, isUser } from '../middleware/roleAuth.js';

export const router = Router();

router.get('/', auth, isAdmin, viewsController.getProducts);
router.get('/products', auth, viewsController.getAllProducts)
router.get('/realtimeproducts', auth, isAdmin, (req, res) => {return res.render('realTimeProducts')});
router.get('/chat', auth, isUser, viewsController.getMessages)
router.get('/carts/:cid', auth, viewsController.getCartById)
router.get('/register', (req, res) => {res.status(200).render('register')});

router.get('/login', (req, res) => {
    let { error } = req.query;
    res.status(200).render('login', { error });
});

router.get('/profile', auth, (req, res) => {
    res.status(200).render('profile', {
        user:req.user
    });
});
