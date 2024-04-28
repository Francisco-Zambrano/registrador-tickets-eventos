import { request, response } from "express";
import { productsModel } from "./models/productsModel";


export const getProducts = async (req = request, res = response) => {

    try {
        // const {limit} = request.query;
        const products = await productsModel.find();
        return res.json({products});

    } catch (error) {
        console.log('getProducts', error);
        return res.status(500);
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
        return res.status(500);
    }

};

export const addProduct = async (req = request, res = response) => {

    try {

        const {title, description, price, thumbnails, code, stock, category, status} = req.body; 
        if (!title || !description || !price || !code || !stock || !category)  
            return res.status(404);
    
        const product = await productsModel.create({title, description, price, thumbnails, code, stock, category, status})
        return res.json({product});

    } catch (error) {

        console.log('addProduct', error);
        return res.status(500);

    }

};

export const updateProduct = async (req = request, res = response) => {

    try {

        const {pid} = req.params;
        const {_id, ...rest} = req.body;
        const product = await productsModel.findByIdAndUpdate(pid, {...rest}, {new: true});

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

// import fs from 'fs';

// class ProductManager {

//     #products;
//     #path;
//     static idProduct = 0;

//     constructor() {
//         this.#path = './src/data/products.json';
//         this.#products = this.#readListProducts();
//     }

//     #readListProducts() {
//         try {
//             if (fs.existsSync(this.#path))
//                 return JSON.parse(fs.readFileSync(this.#path, 'utf-8'));
//             return [];
//         } catch (error) {
//             console.log("Error reading file");
//         }
//     }

//     #saveNewData() {
//         try {
//             fs.writeFileSync(this.#path, JSON.stringify(this.#products));
//         } catch (error) {
//             console.log("Error saving file");
//         }
//     }

//     addProduct(title, description, price, thumbnail=[], code, stock, status=true, category) {
//         if (!title || !description || !price || !code || !stock || !category) {
//             return "All parameters are required";
//         }

//         const uniqueCode = this.#products.some(product => product.code === code);
//         if (uniqueCode) {
//             return "Product Code Already Exists";
//         }

//         const lastId = this.#products.length > 0 ? this.#products[this.#products.length - 1].id : 0;
//         const id = lastId + 1;

//         const newProduct = { id, title, description, price, thumbnail, code, stock, status, category };
//         this.#products.push(newProduct);
//         this.#saveNewData();
//         return "Product successfully added";
//     }

//     getProducts(limit = 0) {
//         limit = Number(limit);
//         return limit > 0 ? this.#products.slice(0, limit) : this.#products;
//     }

//     getProductById(id) {
//         let status = false;
//         let message = "Not Found"

//         const product = this.#products.find(data => data.id === id);
        
//         if (product) {
//             status = true;
//             message = product;
//         }

//         return {status, message}
//     }

//     updateProduct(id, objectUpdate) {
//         let message = "The product does not exist"

//         const index = this.#products.findIndex(p => p.id === id);

//         if (index !== -1) {
//             const { id, ...res } = objectUpdate;
//             this.#products[index] = { ...this.#products[index], ...res }
//             this.#saveNewData();
//             message = "Updated Product";
//         }

//         return message;
//     }

//     deleteProduct(id) {
//         let message = "The product does not exist"

//         const index = this.#products.findIndex(p => p.id === id);

//         if (index !== -1) {
//             this.#products = this.#products.filter(p => p.id !== id);
//             this.#saveNewData();
//             message = "Deleted Product"
//         }
        
//         return message;
//     }
// }

// export default ProductManager;
