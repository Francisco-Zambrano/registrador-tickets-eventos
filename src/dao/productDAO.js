import { productsModel } from "./models/productsModel.js";

export class ProductDAO {

    async create(product) {
        return await productsModel.create(product);
    };

    async getBy(query, options = {}) {

        if (options.page && options.limit) {
            return await productsModel.paginate(query, options);
        } else {
            return await productsModel.find(query).lean();
        }
        
    };

    async update(id, product) {
        return await productsModel.findByIdAndUpdate(id, product, { new: true });
    };

    async delete(id) {
        return await productsModel.findByIdAndDelete(id);
    };

};


