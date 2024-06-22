export class ProductRepository {

    constructor(dao) {
        this.dao = dao;
    };

    async create(product) {
        return await this.dao.create(product);
    };

    async getBy(query, options = {}) {
        const result = await this.dao.getBy(query, options);
        if (options.page && options.limit) {
            return result; // Return paginated result
        } else {
            return Array.isArray(result) ? result : [result]; // Ensure an array is returned
        }
    };

    async update(id, product) {
        return await this.dao.update(id, product);
    };

    async delete(id) {
        return await this.dao.delete(id);
    };

};


