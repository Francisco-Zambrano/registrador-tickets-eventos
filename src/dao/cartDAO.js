import { cartsModel } from './models/cartsModel.js';

export class CartDAO {

    async create(cart) {
        return await cartsModel.create(cart);
    };

    async getBy(query, options = {}) {
        if (options.populate) {
            return await cartsModel.findOne(query).populate(options.populate).lean();
        }
        return await cartsModel.findOne(query).lean();
    };

    async update(id, cart) {
        return await cartsModel.findByIdAndUpdate(id, cart, { new: true });
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
