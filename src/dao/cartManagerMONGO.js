import { request, response } from "express";
import { cartsModel } from "./models/cartsModel.js"; 

export const getCartById = async (req = request, res = response) => {
    
    try {
        const {cid} = req.params;
        const cart = await cartsModel.findById(cid);
        if (cart) {
            return res.json({cart});
        } return res.status(404).json({msg:'cart not found'})
    } catch (error) {
        console.log('getCartById', error);
        return res.status(500).json({ msg: 'Internal server error' });
    }

};

export const createCart = async (req = request, res = response) => {

    try {
        const cart = await cartsModel.create({});
        return res.json({msg:'Cart created', cart});
    } catch (error) {
        console.log('createCart', error);
        return res.status(500).json({ msg: 'Internal server error' });
    }

};

export const addProduct = async (req = request, res = response) => {

    try {
        const {cid, pid} = req.params;
        const cart = await cartsModel.findById(cid);

        if(!cart) 
            return res.status(404).json({msg: 'Cart does not exist'})

        const productInCart = cart.products.find(p=>p.id.toString() === pid);
        
        if (productInCart) 
            productInCart.quantity++;
         else 
            cart.products.push({id:pid, quantity: 1});
        
        await cart.save();
        
        return res.json({msg: 'cart updated', cart});

    } catch (error) {
        console.log('addProduct', error)
        return res.status(500).json({ msg: 'Internal server error' });
    }

};