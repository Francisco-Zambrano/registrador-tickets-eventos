import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2"

const productsCollection = "products"
const productsSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
            index: true
        },
        description:{
            type: String,
            required: true
        },
        price:{
            type: Number,
            required: true
        },
        thumbnails:[
            {
                type: String,
            }
        ],
        code:{
            type: String,
            unique: true,
            required: true
        },
        stock:{
            type: Number,
            required: true,
            default: 0
        },
        status:{
            type: Boolean,
        },
        category:{
            type: String,
            required: true,
            index: true
        },
        owner:{
            type: mongoose.Types.ObjectId,
            ref: 'User',
            
        }
    },
    {
        timestamps: true
    }
);

productsSchema.plugin(paginate);

export const productsModel = mongoose.model(
    productsCollection,
    productsSchema,
)