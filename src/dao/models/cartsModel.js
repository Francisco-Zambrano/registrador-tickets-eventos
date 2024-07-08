import mongoose from "mongoose";
import { Schema } from "mongoose";

const cartsCollection = "carts";
const cartsSchema = new mongoose.Schema(
    {
        products: [
            {
                id: {
                    type: Schema.Types.ObjectId,
                    ref: 'products',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

export const cartsModel = mongoose.model(
    cartsCollection, 
    cartsSchema
);