import { model, Schema } from "mongoose";

const recipeSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, },
    category: {
        _id: { type: Schema.Types.ObjectId, ref: 'categories', required: true },
        name: String,
    },
    time: { type: Number, required: true, min: 1 },
    difficulty: { type: Number, enum: [1, 2, 3, 4, 5], required: true },
    date: { type: Date, default: Date.now },
    layers: {
        type: [{
            ingredients: { type: String, required: true },
            description: { type: String },
        }],
        required: true,
        default: undefined,
        validate: {
            validator: function (v) {
                return Array.isArray(v) && v.length > 0;
            },
            message: 'יש להזין לפחות מרכיב אחד'
        }
    },
    instructions: {
        type: [String],
        required: true,
        validate: {
            validator: function (v) {
                return Array.isArray(v) && v.length > 0;
            },
            message: 'יש להזין לפחות הוראת הכנה אחת'
        }
    },
    image: { type: String },
    isPrivate: { type: Boolean, default: false },
    user: {
        _id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    },
});

export default model('recipes', recipeSchema);