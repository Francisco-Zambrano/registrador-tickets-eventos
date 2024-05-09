import { Router } from 'express';
import { addProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../dao/productManagerMONGO.js';

const router = Router();

// router.get('/', getProducts);
router.get('/:pid', getProductById);
router.post('/', addProduct);
router.put('/:pid', updateProduct);
router.delete('/:pid', deleteProduct);


router.get('/', async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const sort = req.query.sort || 'asc';

        const options = { page, limit, lean: true };

        const result = await getProducts(req, res, options, sort);
        const { docs: products, totalPages, totalDocs, hasPrevPage, hasNextPage, prevPage, nextPage } = result;

        return res.json({ products, page, limit, totalPages, totalDocs, hasPrevPage, hasNextPage, prevPage, nextPage });
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).send('Internal server error');
    }
});

export default router;



// import { Router } from 'express';
// import ProductManager from '../dao/productManagerMONGO.js';

// const router = Router();

// router.get('/', (req, res) => {

//     const {limit} = req.query;
//     const product = new ProductManager();
//     const data = product.getProducts(limit);
//     return res.json({data:data})

// });

// router.get('/:pid', (req, res) => {

//     const {pid} = req.params;
//     const product = new ProductManager();
//     const data = product.getProductById(Number(pid));
//     return res.json({data});

// });

// router.post('/', (req, res) => {
//     const {title, description, price, thumbnail, code, stock, status, category} = req.body;
//     const product = new ProductManager();
//     const result = product.addProduct(title, description, price, thumbnail, code, stock, status, category)
//     return res.json({result});
// })

// router.put('/:pid', (req, res) => {
//     const {pid} = req.params;
//     const product = new ProductManager();
//     const result = product.updateProduct(Number(pid), req.body)
//     return res.json({result});
// })

// router.delete('/:pid', (req, res) => {
//     const {pid} = req.params;
//     const product = new ProductManager();
//     const result = product.deleteProduct(Number(pid), req.body)
//     return res.json({result});
// })

// export default router;