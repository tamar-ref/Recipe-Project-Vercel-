import { Router } from "express";
import { getAllUsers, login, register, deleteUser, updateDetails, getUserById } from "../controllers/user.controller.js";
import { auth, authAdmin } from "../middlewares/auth.middleware.js";

export const userRouter = Router();

// GET http://localhost:3000/user
userRouter.get('/', auth, authAdmin, getAllUsers);

userRouter.get('/:id', auth, authAdmin, getUserById);
// POST http://localhost:3000/user/login
userRouter.post('/login', login);
// POST http://localhost:3000/user/register
userRouter.post('/register', register);
// DELETE http://localhost:3000/user/5
userRouter.delete('/:id', auth, deleteUser);
// PUT http://localhost:3000/user/7/password
userRouter.put('/:id', auth, updateDetails);