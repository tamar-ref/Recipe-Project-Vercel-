// --------------category----------------
import { Router } from "express";
import { getAllCategories, getAllCategoriesAndRecipes, getCategoryByNameAndRecipes, addCategory } from "../controllers/category.controller.js";
import { auth, authAdmin } from "../middlewares/auth.middleware.js";

export const categoryRouter = Router();

// GET http://localhost:3000/category
categoryRouter.get('/', getAllCategories);
// GET http://localhost:3000/category/with-recipes
categoryRouter.get('/with-recipes', getAllCategoriesAndRecipes);
// GET http://localhost:3000/category/search?search=ABC123
// GET http://localhost:3000/category/search?search=קינוח
categoryRouter.get('/search', getCategoryByNameAndRecipes);
// POST http://localhost:3000/category
categoryRouter.post('/', auth, authAdmin, addCategory);


// ---------------recipe---------------
import {
    getAllRecipes,
    getMyRecipes,
    getRecipeById,
    getRecipesByTime,
    addRecipe,
    updateRecipe,
    deleteRecipe
} from '../controllers/recipe.controller.js';

export const recipeRouter = Router();

// GET http://localhost:5000/recipe
// GET http://localhost:5000/recipe?search=עוגה&limit=5&page=2
recipeRouter.get('/', getAllRecipes);
// GET http://localhost:5000/recipe/time/30
recipeRouter.get('/time/:time', getRecipesByTime);
// GET http://localhost:5000/recipe/:id
recipeRouter.get('/:id', getRecipeById);
// GET http://localhost:5000/recipe/user/mine
recipeRouter.get('/user/mine', auth, getMyRecipes);
// POST http://localhost:5000/recipe
recipeRouter.post('/', auth, addRecipe);
// PUT http://localhost:5000/recipe/6
recipeRouter.put('/:id', auth, updateRecipe);
// DELETE http://localhost:5000/recipe/6
recipeRouter.delete('/:id', auth, deleteRecipe);




// ---------------user----------------
import { getAllUsers, login, register, deleteUser, updateDetails, getUserById } from "../controllers/user.controller.js";

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