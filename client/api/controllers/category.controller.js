import Category from '../models/category.model.js';

export const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    }
    catch (error) {
        next({ message: 'Error loading recipes' });
    }
}

export const getAllCategoriesAndRecipes = async (req, res, next) => {
    try {
        const categories = await Category.find().populate('recipes._id');
        res.json(categories);
    }
    catch (error) {
        next({ message: error.message });
    }
}

export const getCategoryByNameAndRecipes = async (req, res, next) => {
    try {
        const { search } = req.query;
        const category = await Category.findOne({
            name: { $regex: new RegExp(search, 'i') }
        }).populate('recipes._id');

        if (!category)
            return res.status(404).json({ message: 'Category not found' });

        res.json(category);
    }
    catch (error) {
        next({ message: error.message });
    }
}

export const addCategory = async (req, res, next) => {
    try {
        const categoryName = req.body.name.trim();
        let existingCategory = await Category.findOne({ name: categoryName });
        if (!existingCategory) {
            existingCategory = new Category({ name: categoryName, recipes: [] });
            await existingCategory.save();
            res.status(201).json(existingCategory);
        }
        else {
            next({ message: 'Category name already exists' });
        }
    }
    catch (error) {
        next({ message: error.message });
    }
}