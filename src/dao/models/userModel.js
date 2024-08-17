import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin", "premium"]
    },
    cart: {
        type: mongoose.Types.ObjectId,
        ref: "carts"
    },
    documents: [
        {
            name: {
                type: String,
                required: true
            },
            reference: {
                type: String,
                required: true,
            }
        }
    ],
    last_connection: {
        type: Date,
    }
}, {
    timestamps: true,
    strict: false
});


export const userModel = mongoose.model('User', userSchema);