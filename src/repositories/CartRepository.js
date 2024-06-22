export class CartRepository {

    constructor(dao) {
        this.dao = dao;
    };

    async create(cart) {
        return await this.dao.create(cart);
    };

    async getBy(query, options = {}) {
        return await this.dao.getBy(query, options);
    };

    async update(id, cart) {
        return await this.dao.update(id, cart);
    };

    async delete(id) {
        return await this.dao.delete(id);
    };

    async addProduct(cid, pid) {
        return await this.dao.addProduct(cid, pid);
    };

    async deleteProduct(cid, pid) {
        return await this.dao.deleteProduct(cid, pid);
    };

    async updateProductQuantity(cid, pid, quantity) {
        return await this.dao.updateProductQuantity(cid, pid, quantity);
    };

};