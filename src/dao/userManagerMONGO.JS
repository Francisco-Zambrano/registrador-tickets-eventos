import { userModel } from "./models/userModel"

export class UserManagerMongo{

    async create(user){
        let newUser = await userModel.create(user)
        return newUser.toJSON()
    }

    async getBy(filter={}){
        return await userModel.findOne(filter).lean()
    }

};