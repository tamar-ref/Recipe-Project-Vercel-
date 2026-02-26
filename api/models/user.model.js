import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Joi from "joi";

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true, minlength: 4 },
    email: { type: String, unique: true, required: true },
    address: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    passwordStrength: { type: Boolean, default: false },
});

//הצפנת סיסמה לפני שמירת המשתמש
userSchema.pre('save', async function () {
    this.passwordStrength = isStrongPassword(this.password);
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//בדיקה האם הסיסמא חזקה
function isStrongPassword(password) {
    // קריטריונים:
    // - לפחות 8 תווים
    // - לפחות אות אחת גדולה
    // - לפחות אות אחת קטנה
    // - לפחות מספר אחד
    // - לפחות תו מיוחד אחד
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;
    return strong.test(password);
}

//יצירת טוקן JWT (לצורך התחברות/אימות)
export const generateToken = (user) => {
    const secretKey = process.env.JWT_SECRET || 'JWT_SECRET';
    const token = jwt.sign({ _id: user._id, role: user.role }, secretKey, { expiresIn: '1h' });
    return token;
};

//בדיקת תקינות קלט עם Joi (ולידציה)
export const JoiUserSchemas = {
    register: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().min(4).required(),
        email: Joi.string().email().lowercase().required(),
        address: Joi.string().required(),
    }),
    login: Joi.object({
        email: Joi.string().lowercase().required(),
        password: Joi.string().required(),
    }),
};

export default model('users', userSchema);