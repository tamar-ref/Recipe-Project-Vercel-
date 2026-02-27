import { model, Schema } from "mongoose";

const categorySchema = new Schema({
    code: { type: String },
    description: { type: String, required: true, unique: true },
    num: { type: Number, default: 0 },
    recipes: [{
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'recipes',
        },
        name: String
    }],
});

export default model('categories', categorySchema);