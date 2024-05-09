import { request, response } from "express";
import { productsModel } from "./models/productsModel.js";


export const getProducts = async (req, res, options, sort) => {
    try {
        
        const page = parseInt(options.page) || 1;
        const limit = parseInt(options.limit) || 10;

        const paginationOptions = {
            page,
            limit,
            lean: true
        };

        
        const sortOptions = {};
        if (sort === 'asc' || sort === 'desc') {
            sortOptions.price = (sort === 'asc') ? 1 : -1;
        } else {
            
        };

        const result = await productsModel.paginate({}, paginationOptions);

        result.docs.sort((a, b) => {
            return sortOptions.price * (a.price - b.price);
        });
        return result;

    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};


export const getProductById = async (req = request, res = response) => {

    try {
        const {pid} = req.params;
        const product = await productsModel.findById(pid);
        if (!product)
            return res.status(404)
    } catch (error) {
        console.log('getProductsById', error);
        return res.status(500).json({ error: 'Internal server error' })
    }

};


export const addProduct = async (req = request, res = response) => {
    
    try {
        const { title, description, price, thumbnails, code, stock, category, status } = req.body;
        
        if (!title || !description || !price || !code || !stock || !category) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const existingProduct = await productsModel.findOne({ code });

        if (existingProduct) {
            return res.status(400).json({ error: 'Product already exists' });
        }

        const product = await productsModel.create({ title, description, price, thumbnails, code, stock, category, status });
        return res.status(201).json({ product });
    } catch (error) {
        console.log('addProduct', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

};


export const updateProduct = async (req = request, res = response) => {

    try {

        const {pid} = req.params;
        const product = await productsModel.findByIdAndUpdate(pid, req.body, {new: true});

        if(product)
            return res.json({message: 'Product Updated'});
        return res.status(404).json({message: 'Product could not be updated'})

    } catch (error) {
        console.log('updateProduct', error);
        return res.status(500);
    }

};


export const deleteProduct = async (req = request, res = response) => {

    try {

        const {pid} = req.params;
        const product = await productsModel.findByIdAndDelete(pid);

        if(product)
            return res.json({message: 'Product Deleted'});
        return res.status(404).json({message: 'Product could not be deleted'})

    } catch (error) {
        console.log('deleteProduct', error);
        return res.status(500);
    }

};



// export default class ProductMAnager{

//     async getProducts() {
//         try {
            
//             const page = parseInt(options.page) || 1;
//             const limit = parseInt(options.limit) || 10;
    
//             const paginationOptions = {
//                 page,
//                 limit,
//                 lean: true
//             };
    
            
//             const sortOptions = {};
//             if (sort === 'asc' || sort === 'desc') {
//                 sortOptions.price = (sort === 'asc') ? 1 : -1;
//             } else {
                
//             };
    
//             const result = await productsModel.paginate({}, paginationOptions);
    
//             result.docs.sort((a, b) => {
//                 return sortOptions.price * (a.price - b.price);
//             });
//             return result;
    
//         } catch (error) {
//             console.error('Error fetching products:', error);
//             throw error;
//         }
//     };


//     async getProductById(req, res) {

//         try {
//             const {pid} = req.params;
//             const product = await productsModel.findById(pid);
//             if (!product)
//                 return res.status(404)
//         } catch (error) {
//             console.log('getProductsById', error);
//             return res.status(500).json({ error: 'Internal server error' })
//         }
    
//     };


//     async addProduct(req, res) {
    
//         try {
//             const { title, description, price, thumbnails, code, stock, category, status } = req.body;
            
//             if (!title || !description || !price || !code || !stock || !category) {
//                 return res.status(400).json({ error: 'Missing required fields' });
//             }
    
//             const existingProduct = await productsModel.findOne({ code });
    
//             if (existingProduct) {
//                 return res.status(400).json({ error: 'Product already exists' });
//             }
    
//             const product = await productsModel.create({ title, description, price, thumbnails, code, stock, category, status });
//             return res.status(201).json({ product });
//         } catch (error) {
//             console.log('addProduct', error);
//             return res.status(500).json({ error: 'Internal server error' });
//         }
    
//     };


//     async updateProduct (req, res) {

//         try {
    
//             const {pid} = req.params;
//             const product = await productsModel.findByIdAndUpdate(pid, req.body, {new: true});
    
//             if(product)
//                 return res.json({message: 'Product Updated'});
//             return res.status(404).json({message: 'Product could not be updated'})
    
//         } catch (error) {
//             console.log('updateProduct', error);
//             return res.status(500);
//         }
    
//     };


//     async deleteProduct (req, res) {

//         try {
    
//             const {pid} = req.params;
//             const product = await productsModel.findByIdAndDelete(pid);
    
//             if(product)
//                 return res.json({message: 'Product Deleted'});
//             return res.status(404).json({message: 'Product could not be deleted'})
    
//         } catch (error) {
//             console.log('deleteProduct', error);
//             return res.status(500);
//         }
    
//     };

// };