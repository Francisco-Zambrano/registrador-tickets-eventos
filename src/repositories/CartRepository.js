import { CartDAO } from '../dao/cartDAO.js';

export class CartRepository {

    constructor() {
        this.cartDAO = new CartDAO();
    };

    async create(cartData) {
        return await this.cartDAO.create(cartData);
    };

    async getById(id) {
        return await this.cartDAO.getById(id);
    };

    async getAll() {
        return await this.cartDAO.getBy({});
    };

    async update(id, cartData) {
        return await this.cartDAO.update(id, cartData);
    };

    async delete(id) {
        return await this.cartDAO.delete(id);
    };

    async addProduct(cid, pid) {
        return await this.cartDAO.addProduct(cid, pid);
    };

    async deleteProduct(cid, pid) {
        return await this.cartDAO.deleteProduct(cid, pid);
    };

    async updateProductQuantity(cid, pid, quantity) {
        return await this.cartDAO.updateProductQuantity(cid, pid, quantity);
    };
    
};