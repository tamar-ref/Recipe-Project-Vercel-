import { Router } from "express";
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
