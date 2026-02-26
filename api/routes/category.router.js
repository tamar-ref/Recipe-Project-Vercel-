import { Router } from "express";
import { getAllCategories, getAllCategoriesAndRecipes, getCategoryByCodeOrNameAndRecipes } from "../controllers/category.controller.js";

const router = Router();

// GET http://localhost:3000/categories
router.get('/', getAllCategories);
// GET http://localhost:3000/categories/with-recipes
router.get('/with-recipes', getAllCategoriesAndRecipes);
// GET http://localhost:3000/categories/search?search=ABC123
// GET http://localhost:3000/categories/search?search=קינוח
router.get('/search', getCategoryByCodeOrNameAndRecipes);

export default router;