import { cartsModel } from '../dao/models/cartsModel.js';

export class CartRepository {

    async create(cartData) {
        return await cartsModel.create(cartData);
    };

    async getById(id) {
        return await cartsModel.findById(id).populate('products.id');
    };

    async getAll() {
        return await cartsModel.find();
    };

    async update(id, cartData) {
        return await cartsModel.findByIdAndUpdate(id, cartData, { new: true });
    };

    async delete(id) {
        return await cartsModel.findByIdAndDelete(id);
    };

    async addProduct(cid, pid) {

        const cart = await cartsModel.findById(cid);

        if (!cart) throw new Error('Cart does not exist');

        const productInCart = cart.products.find(p => p.id.toString() === pid);

        if (productInCart) {
            productInCart.quantity++;
        } else {
            cart.products.push({ id: pid, quantity: 1 });
        }

        await cart.save();
        return cart;

    };

    async deleteProduct(cid, pid) {

        const cart = await cartsModel.findById(cid);

        if (!cart) throw new Error('Cart does not exist');

        cart.products = cart.products.filter(product => product.id.toString() !== pid);
        await cart.save();

        return cart;

    };

    async updateProductQuantity(cid, pid, quantity) {

        const cart = await cartsModel.findById(cid);

        if (!cart) throw new Error('Cart does not exist');

        const productInCart = cart.products.find(product => product.id.toString() === pid);
        if (productInCart) {
            productInCart.quantity = quantity;
            await cart.save();
            return cart;
        } else {
            throw new Error('Product not found in cart');
        }

    };

};