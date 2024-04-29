import { Router } from 'express';
import { addProduct, createCart, getCartById } from '../dao/cartManagerMONGO.js';

const router = Router();

router.get('/:cid', getCartById)
router.post('/', createCart)
router.post('/:cid/product/:pid', addProduct)

export default router;



// import { Router } from 'express';
// import CartManager from '../dao/cartManagerMONGO.js';

// const router = Router();

// router.get('/:cid', (req, res) => {
//     const {cid} = req.params;
//     const cart = new CartManager();
//     const data = cart.getCartById(Number(cid))
//     return res.json({data});
// })

// router.post('/', (req, res) => {
//     const cart = new CartManager();
//     const data = cart.createCart();
//     return res.json({data});
// })

// router.post('/:cid/product/:pid', (req, res) => {
//     const {cid, pid} = req.params;
//     const cart = new CartManager();
//     const data = cart.addProduct(Number(cid), Number(pid));
//     return res.json({data});
// })

// export default router;