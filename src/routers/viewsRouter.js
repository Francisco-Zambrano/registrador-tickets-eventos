import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { viewsController } from '../controllers/viewsController.js';
import { isAdmin, isUser } from '../middleware/roleAuth.js';


const router = Router();

router.get('/', auth, isAdmin, viewsController.getProducts);
router.get('/products', auth, viewsController.getAllProducts)
router.get('/realtimeproducts', auth, (req, res) => {return res.render('realTimeProducts')});
router.get('/chat', auth, isUser, viewsController.getMessages)
router.get('/carts/:cid', auth, viewsController.getCartById)
router.get('/register', (req, res) => { res.status(200).render('register') });
router.post('/register', viewsController.registerUser);
router.get('/login', (req, res) => { res.status(200).render('login') });
router.post('/login', viewsController.loginUser);
router.get('/profile', auth, (req, res) => { res.status(200).render('profile', { user:req.user })});
router.get('/mail', (req, res) => { let { error } = req.query; res.status(200).render('mail', { error })});
router.get('/reset-password', (req, res) => { let { error } = req.query; res.status(200).render('password', { error })});
router.get('/config', auth, isAdmin, viewsController.getConfig);
router.post('/config/updateRole', auth, isAdmin, viewsController.updateUserRole);
router.post('/config/deleteUser', auth, isAdmin, viewsController.deleteUser);

export { router };