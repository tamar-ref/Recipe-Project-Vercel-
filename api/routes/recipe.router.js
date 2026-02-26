import express from 'express';
import {
    getAllRecipes,
    getMyRecipes,
    getRecipeById,
    getRecipesByTime,
    addRecipe,
    updateRecipe,
    deleteRecipe
} from '../controllers/recipe.controller.js';
import { auth } from '../middlewares/auth.middleware.js'; // לדוגמה

const router = express.Router();

// GET http://localhost:5000/recipes
// GET http://localhost:5000/recipes?search=עוגה&limit=5&page=2
router.get('/', getAllRecipes);
// GET http://localhost:5000/recipes/time/30
router.get('/time/:time', getRecipesByTime);
// GET http://localhost:5000/recipes/:id
router.get('/:id', getRecipeById);
// GET http://localhost:5000/recipes/user/mine
router.get('/user/mine', auth, getMyRecipes);
// POST http://localhost:5000/recipes
router.post('/', auth, addRecipe);
// PUT http://localhost:5000/recipes/6
router.put('/:id', auth, updateRecipe);
// DELETE http://localhost:5000/recipes/6
router.delete('/:id', auth, deleteRecipe);

export default router;