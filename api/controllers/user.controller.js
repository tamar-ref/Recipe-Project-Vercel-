import User, { generateToken, JoiUserSchemas } from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.json(users);
    }
    catch (error) {
        next({ message: error.message });
    }
};

export const login = async (req, res, next) => {
    try {
        const v = JoiUserSchemas.login.validate(req.body);
        if (v.error) {
            return next({ status: 400, message: v.error.message });
        }

        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return next({ message: 'user not found', status: 401 });
        }

        // בדיקת הסיסמא שנשלחה עם הסיסמא המוצפנת
        const isAuth = await bcrypt.compare(password, user.password);
        if (!isAuth) {
            return next({ message: 'wrong password', status: 401 });
        }

        const token = generateToken(user);
        res.json({ username: user.username, token });
    }
    catch (error) {
        next({ message: error.message });
    }
}

export const register = async (req, res, next) => {
    try {
        const v = JoiUserSchemas.register.validate(req.body);
        if (v.error) {
            return next({ status: 400, message: v.error.message });
        }
        const { username, password, email, address, role: incomingRole } = req.body;

        // בדיקה אם כבר קיים משתמש עם המייל הזה
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next({ status: 409, message: 'מייל זה כבר רשום במערכת' });
        }
        // בדיקה אם זה המשתמש הראשון
        const usersCount = await User.countDocuments();
        const role = incomingRole || (usersCount === 0 ? 'admin' : 'user');

        const user = new User({ username, password, email, address, role });
        await user.save();

        const token = generateToken(user);
        res.json({ username: user.username, token });
    }
    catch (error) {
        next({ message: error.message });
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (req.myUser._id !== id && req.myUser.role !== 'admin') {
            return next({ status: 403, message: `user ${req.myUser._id} is not authorized to delete user ${id}` })
        }

        await User.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        next({ message: error.message });
    }
}

export const updatePassword = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        // בדיקה שהמשתמש מעדכן רק את עצמו
        if (req.myUser._id !== id) {
            return next({
                status: 403, message: `user ${req.myUser._id} cannot update password for user ${id}`
            });
        }
        // בדיקה בסיסית שהסיסמה קיימת
        if (!password || password.length < 4) {
            return next({ status: 400, message: 'Password is required and must be at least 4 characters' });
        }
        // הצפנת הסיסמה החדשה
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // עדכון במסד
        await User.findByIdAndUpdate(id, { password: hash });

        res.json({ message: 'Password updated successfully' });
    }
    catch (error) {
        next({ message: error.message });
    }
}