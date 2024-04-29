import { request, response } from "express";
import { productsModel } from "./models/productsModel.js";


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