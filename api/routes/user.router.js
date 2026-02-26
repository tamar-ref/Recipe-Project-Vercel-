import { Router } from "express";
import { getAllUsers, login, register, deleteUser, updatePassword } from "../controllers/user.controller.js";
import { auth, authAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// GET http://localhost:3000/users
router.get('/', auth, authAdmin, getAllUsers);
// POST http://localhost:3000/users/login
router.post('/login', login);
// POST http://localhost:3000/users/register
router.post('/register', register);
// DELETE http://localhost:3000/users/5
router.delete('/:id', auth, deleteUser);
// PUT http://localhost:3000/users/7/password
router.put('/:id/password', auth, updatePassword);

export default router;