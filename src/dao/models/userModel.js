import mongoose from 'mongoose'

export const userModel = mongoose.model('user',new mongoose.Schema(
    {
        first_name: String,
        last_name: String,
        email:{
            type: String, 
            unique:true
        },
        age: Number, 
        password: String,
        role:{
            type: String, 
            default:"user",
        },
        cart:{
            type: mongoose.Types.ObjectId, 
            ref: "carts"
        }
    },
    {
        timestamps: true,
        strict: false
    }
));