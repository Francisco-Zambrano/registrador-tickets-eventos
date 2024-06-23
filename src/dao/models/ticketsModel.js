import mongoose from "mongoose";

const ticketsCollection = "ticket"
const ticketsSchema = new mongoose.Schema(
    {
        code: {
        type: String,
        unique: true,
        
        },
        purchase_datetime: {
            type: Date,
            default: Date.now
        },
        amount: {
            type: Number,
            required: true
        },
        purchaser: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);

export const ticketsModel = mongoose.model(
    ticketsCollection,
    ticketsSchema
);