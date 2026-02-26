import Cetegory from '../models/category.model.js';

export const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Cetegory.find();
        res.json(categories);
    }
    catch (error) {
        next({ message: 'Error loading recipes' });
    }
}

export const getAllCategoriesAndRecipes = async (req, res, next) => {
    try {
        const categories = await Cetegory.find().populate('recipes._id');
        res.json(categories);
    }
    catch (error) {
        next({ message: error.message });
    }
}

export const getCategoryByCodeOrNameAndRecipes = async (req, res, next) => {
    try {
        const { search } = req.query;
        const category = await Cetegory.findOne({
            $or: [
                { code: search },
                { description: { $regex: new RegExp(search, 'i') } }
            ]
        }).populate('recipes._id');

        if (!category)
            return res.status(404).json({ message: 'Category not found' });

        res.json(category);
    }
    catch (error) {
        next({ message: error.message });
    }
}