import { productsModel } from "./models/productsModel.js";

class ProductManager {
    async getProducts(options, sort) {
        try {
            const page = parseInt(options.page) || 1;
            const limit = parseInt(options.limit) || 10;

            const paginationOptions = {
                page,
                limit,
                lean: true
            };

            const sortOptions = {};
            if (sort === 'asc' || sort === 'desc') {
                sortOptions.price = (sort === 'asc') ? 1 : -1;
            }

            const result = await productsModel.paginate({}, paginationOptions);

            result.docs.sort((a, b) => {
                return sortOptions.price * (a.price - b.price);
            });
            return result;

        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    async getProductById(pid) {
        try {
            const product = await productsModel.findById(pid);
            return product;
        } catch (error) {
            console.log('getProductById', error);
            throw error;
        }
    }

    async addProduct(productData) {
        try {
            const product = await productsModel.create(productData);
            return product;
        } catch (error) {
            console.log('addProduct', error);
            throw error;
        }
    }

    async updateProduct(pid, newData) {
        try {
            const product = await productsModel.findByIdAndUpdate(pid, newData, { new: true });
            return product;
        } catch (error) {
            console.log('updateProduct', error);
            throw error;
        }
    }

    async deleteProduct(pid) {
        try {
            const product = await productsModel.findByIdAndDelete(pid);
            return product;
        } catch (error) {
            console.log('deleteProduct', error);
            throw error;
        }
    }
}

export default new ProductManager();