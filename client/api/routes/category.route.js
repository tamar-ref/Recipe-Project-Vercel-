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