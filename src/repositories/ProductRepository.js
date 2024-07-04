import { productsModel } from '../dao/models/productsModel.js';

export class ProductRepository {

    async create(productData) {
        return await productsModel.create(productData);
    };

    async getById(id) {
        return await productsModel.findById(id);
    };

    async getAll() {
        return await productsModel.find();
    };

    async update(id, productData) {
        return await productsModel.findByIdAndUpdate(id, productData, { new: true });
    };

    async delete(id) {
        return await productsModel.findByIdAndDelete(id);
    };

};