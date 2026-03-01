// --------------category----------------
import { Router } from "express";
import { getAllCategories, getAllCategoriesAndRecipes, getCategoryByCodeOrNameAndRecipes } from "../controllers/category.controller.js";

export const categoryRouter = Router();

// GET http://localhost:3000/categories
categoryRouter.get('/', getAllCategories);
// GET http://localhost:3000/categories/with-recipes
categoryRouter.get('/with-recipes', getAllCategoriesAndRecipes);
// GET http://localhost:3000/categories/search?search=ABC123
// GET http://localhost:3000/categories/search?search=קינוח
categoryRouter.get('/search', getCategoryByCodeOrNameAndRecipes);



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
import { auth, authAdmin } from "../middlewares/auth.middleware.js";

export const recipeRouter = Router();

// GET http://localhost:5000/recipes
// GET http://localhost:5000/recipes?search=עוגה&limit=5&page=2
recipeRouter.get('/', getAllRecipes);
// GET http://localhost:5000/recipes/time/30
recipeRouter.get('/time/:time', getRecipesByTime);
// GET http://localhost:5000/recipes/:id
recipeRouter.get('/:id', getRecipeById);
// GET http://localhost:5000/recipes/user/mine
recipeRouter.get('/user/mine', auth, getMyRecipes);
// POST http://localhost:5000/recipes
recipeRouter.post('/', auth, addRecipe);
// PUT http://localhost:5000/recipes/6
recipeRouter.put('/:id', auth, updateRecipe);
// DELETE http://localhost:5000/recipes/6
recipeRouter.delete('/:id', auth, deleteRecipe);




// ---------------user----------------
import { getAllUsers, login, register, deleteUser, updateDetails, getUserById } from "../controllers/user.controller.js";

export const userRouter = Router();

// GET http://localhost:3000/users
userRouter.get('/', auth, authAdmin, getAllUsers);

userRouter.get('/:id', auth, authAdmin, getUserById);
// POST http://localhost:3000/users/login
userRouter.post('/login', login);
// POST http://localhost:3000/users/register
userRouter.post('/register', register);
// DELETE http://localhost:3000/users/5
userRouter.delete('/:id', auth, deleteUser);
// PUT http://localhost:3000/users/7/password
userRouter.put('/:id', auth, updateDetails);