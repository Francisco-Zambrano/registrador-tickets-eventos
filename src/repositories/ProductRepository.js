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
        const sortOption = options.sort === 'asc' ? { price: 1 } : { price: -1 };
        const updatedOptions = { ...options, sort: sortOption };
        return await productsModel.find(query, null, updatedOptions);
    }

    async update(id, productData) {
        return await productsModel.findByIdAndUpdate(id, productData, { new: true });
    }

    async delete(id) {
        return await productsModel.findByIdAndDelete(id);
    }

};