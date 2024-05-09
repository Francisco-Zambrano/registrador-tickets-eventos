import { cartsModel } from "./models/cartsModel.js"; 


export const getCartById = async (cid) => {
    try {
        const cart = await cartsModel.findById(cid);
        return cart;
    } catch (error) {
        console.log('getCartById', error);
        throw new Error('Internal server error');
    }
};


export const createCart = async () => {
    try {
        const cart = await cartsModel.create({});
        return cart;
    } catch (error) {
        console.log('createCart', error);
        throw new Error('Internal server error');
    }
};


export const addProduct = async (cid, pid) => {
    try {
        const cart = await cartsModel.findById(cid);

        if(!cart) 
            throw new Error('Cart does not exist');

        const productInCart = cart.products.find(p => p.id.toString() === pid);
        
        if (productInCart) 
            productInCart.quantity++;
         else 
            cart.products.push({ id: pid, quantity: 1 });
        
        await cart.save();
        
        return cart;

    } catch (error) {
        console.log('addProduct', error);
        throw new Error('Internal server error');
    }
};


export const deleteCart = async (cid) => {
    try {
        await cartsModel.findByIdAndDelete(cid);
    } catch (error) {
        console.log('deleteCart', error);
        throw new Error('Internal server error');
    }
};


export const deleteProduct = async (cid, pid) => {
    try {
        const cart = await cartsModel.findById(cid);

        if (!cart) 
            throw new Error('Cart does not exist');

        cart.products = cart.products.filter(product => product.id.toString() !== pid);
        await cart.save();

        return cart;
    } catch (error) {
        console.log('deleteProduct', error);
        throw new Error('Internal server error');
    }
};


export const updateCart = async (cid, products) => {
    try {
        const cart = await cartsModel.findByIdAndUpdate(cid, { products }, { new: true });
        return cart;
    } catch (error) {
        console.log('updateCart', error);
        throw new Error('Internal server error');
    }
};


export const updateProductQuantity = async (cid, pid, quantity) => {
    try {
        const cart = await cartsModel.findById(cid);

        if (!cart) 
            throw new Error('Cart does not exist');

        const productInCart = cart.products.find(product => product.id.toString() === pid);
        if (productInCart) {
            productInCart.quantity = quantity;
            await cart.save();
            return cart;
        } else {
            throw new Error('Product not found in cart');
        }
    } catch (error) {
        console.log('updateProductQuantity', error);
        throw new Error('Internal server error');
    }
};