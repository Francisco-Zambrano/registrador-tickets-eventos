import { userModel } from "./models/userModel.js";


export class UserDAO {

    async create(item) {
        return await userModel.create(item);
    }
    async getBy(query) {
        return await userModel.findOne(query).lean();
    }
    async update(id, item) {
        return await userModel.findByIdAndUpdate(id, item, { new: true });
    }
    async delete(id) {
        return await userModel.findByIdAndDelete(id);
    }
    async findById(id) {
        return await userModel.findById(id);
    }

};