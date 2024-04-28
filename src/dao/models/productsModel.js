import mongoose from "mongoose";

const productsCollection = "products"
const productsSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        price:{
            type: Number,
            required: true
        },
        thumbnail:[
            {
                type: String,
            }
        ],
        code:{
            type: String,
            required: true
        },
        stock:{
            type: Number,
            required: true
        },
        status:{
            type: Boolean,
            required: true
        },
        category:{
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);

export const productsModel = mongoose.model(
    productsCollection,
    productsSchema
)