import { productsModel } from '../dao/models/productsModel.js';

export class ProductRepository {

    async create(productData) {
        return await productsModel.create(productData);
    }

    async getBy(query, options) {
        return await productsModel.paginate(query, options);
    }

    async getById(id) {
        return await productsModel.findById(id);
    }

    async getAll(query = {}, options = {}) {
        return await productsModel.find(query, null, options);
    }

    async update(id, productData) {
        return await productsModel.findByIdAndUpdate(id, productData, { new: true });
    }

    async delete(id) {
        return await productsModel.findByIdAndDelete(id);
    }

};