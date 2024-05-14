import mongoose from 'mongoose'

export const userModel = mongoose.model('user',new mongoose.Schema(
    {
        name: String,
        email:{
            type: String, 
            unique:true
        }, 
        password: String,
        rol:{
            type: String, 
            default:"user"
        }
    }
));