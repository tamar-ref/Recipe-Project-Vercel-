import User, { generateToken, JoiUserSchemas } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
//import crypto from "crypto";
//import nodemailer from "nodemailer";

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
        const { username, password, email, phone,  role: incomingRole } = req.body;

        // בדיקה אם כבר קיים משתמש עם המייל הזה
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next({ status: 409, message: 'מייל זה כבר רשום במערכת' });
        }
        // בדיקה אם זה המשתמש הראשון
        const usersCount = await User.countDocuments();
        const role = incomingRole || (usersCount === 0 ? 'admin' : 'user');

        const user = new User({ username, password, email, phone, role });
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

        const userToDelete = await User.findById(id);

        if (userToDelete.role === 'admin') {
            return next({ message: `you can't delete admin user` })
        }

        await userToDelete.deleteOne();
        res.status(204).end();
    } catch (error) {
        next({ message: error.message });
    }
}

export const updateDetails = async (req, res, next) => {
    try {
        const id = req.params.id;

        const v = JoiUserSchemas.update.validate(req.body);
        if (v.error) {
            return next({ status: 400, message: v.error.message });
        }

        const user = await User.findById(id);
        if (!user) return next({ status: 404, message: 'User not found' });

        if (req.myUser._id !== id && req.myUser.role !== 'admin') {
            return next({ status: 403, message: 'Not authorized to update this user' });
        }

        const { username, password, email, phone, role: incomingRole } = req.body;
        const updateData = {};

        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            updateData.password = hash;
        }
        if (incomingRole && req.myUser.role === 'admin') {
            updateData.role = incomingRole;
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        res.json({
            message: 'User updated successfully',
            user: updatedUser
        });

    }
    catch (error) {
        next({ message: error.message });
    }
}

/*export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return next({ status: 404, message: 'User not found' });

        // צור token חד-פעמי
        const token = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // שעה אחת
        await user.save();
        
        // שימוש ב-SendGrid
        const transporter = nodemailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 587,
            auth: {
                user: 'apikey', 
                pass: process.env.EMAIL_PASS
            }
        });

        const resetURL = `http://localhost:4200/reset-password/${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER, // כתובת שממנה נשלח המייל
            to: user.email,
            subject: "איפוס סיסמה",
            html: `<p>לחץ/י על הקישור כדי לאפס את הסיסמה:</p><a href="${resetURL}">${resetURL}</a>`
        });

        res.json({ message: 'קישור לאיפוס סיסמה נשלח למייל' });
    } catch (err) {
        next({ message: err.message });
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return next({ status: 400, message: 'Token לא תקין או פג תוקף' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: 'הסיסמה עודכנה בהצלחה' });
    } catch (err) {
        next({ message: err.message });
    }
};*/