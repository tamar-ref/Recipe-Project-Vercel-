import Recipe from '../models/recipe.model.js';
import Category from '../models/category.model.js';
import mongoose from 'mongoose';

// קבלת כל המתכונים עם חיפוש, עמודים, וסינון לפי משתמש
export const getAllRecipes = async (req, res, next) => {
    try {
        const { search = '', limit = 10, page = 1, userId } = req.query;
        const regexFilter = search
            ? { name: { $regex: search, $options: 'i' } }
            : {};

        const orCondition = userId && mongoose.Types.ObjectId.isValid(userId)
            ? [
                { isPrivate: false },
                { 'user._id': new mongoose.Types.ObjectId(userId) }
            ]
            : [
                { isPrivate: false }
            ];

        const filter = {
            ...regexFilter,
            $or: orCondition
        };

        const recipes = await Recipe.find(filter)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .populate('user', 'username');

        res.json(recipes);
    }
    catch (error) {
        next({ message: error.message });
    }
};

// קבלת מתכונים לפי משתמש מחובר
export const getMyRecipes = async (req, res, next) => {
    try {
        const recipes = await Recipe.find({ 'user._id': req.myUser._id });
        res.json(recipes);
    }
    catch (error) {
        next({ message: error.message });
    }
};

export const getRecipeById = async (req, res, next) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('user', 'username');
        if (!recipe) return next({ status: 404, message: 'Recipe not found' });
        res.json(recipe);
    }
    catch (error) {
        next({ message: error.message });
    }
};

// קבלת מתכונים לפי זמן הכנה
export const getRecipesByTime = async (req, res, next) => {
    try {
        const maxTime = parseInt(req.params.time);
        const recipes = await Recipe.find({ time: { $lte: maxTime } });
        res.json(recipes);
    } catch (error) {
        next({ message: error.message });
    }
};

export const addRecipe = async (req, res, next) => {
    try {
        const categoryName = req.body.category;
        let existingCategory = await Category.findOne({ description: categoryName });

        if (!existingCategory) {
            existingCategory = new Category({ description: categoryName, num: 1, recipes: [] });
            await existingCategory.save();
        }
        else {
            existingCategory.num += 1;
            await existingCategory.save();
        }
        const recipeData = {
            ...req.body,
            user: { _id: req.myUser._id },
            category: { _id: existingCategory._id, name: existingCategory.description }
        };
        const recipe = new Recipe(recipeData);
        await recipe.save();

        existingCategory.recipes.push({
            _id: recipe._id,
            name: recipe.name
        });

        await existingCategory.save();

        res.status(201).json(recipe);
    }
    catch (error) {
        next({ message: error.message });
    }
};


export const updateRecipe = async (req, res, next) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return next({ status: 404, message: 'Recipe not found' });

        const recipeUserId = recipe.user?._id?.toString();
        const myUserId = req.myUser?._id?.toString();

        if (recipeUserId !== myUserId && req.myUser.role !== 'admin') {
            return next({ status: 403, message: 'Not authorized to update this recipe' });
        }

        const oldName = recipe.name;
        const oldCategoryId = recipe.category?._id;

        // 👇 הכנה לקטגוריה חדשה (שם כטקסט)
        const categoryName = req.body.category.trim();
        let existingCategory = await Category.findOne({ description: categoryName });

        if (!existingCategory) {
            existingCategory = new Category({ description: categoryName, num: 1, recipes: [] });
            await existingCategory.save();
        }
        else {
            existingCategory.num += 1;
            await existingCategory.save();
        }

        // 👇 המרת המחרוזת לאובייקט קטגוריה
        req.body.category = {
            _id: existingCategory._id,
            name: existingCategory.description
        };

        // 👇 עדכון בפועל
        Object.assign(recipe, req.body);
        await recipe.save();

        // 👇 עדכון שם המתכון ברשימת הקטגוריה
        await Category.updateOne(
            { _id: existingCategory._id, 'recipes._id': recipe._id },
            { $set: { 'recipes.$.name': recipe.name } }
        );

        // 👇 אם זו קטגוריה חדשה, להסיר מהישנה
        if (oldCategoryId && oldCategoryId.toString() !== existingCategory._id.toString()) {
            const oldCategory = await Category.findById(oldCategoryId);
            if (oldCategory) {
                oldCategory.num -= 1;
                oldCategory.recipes = oldCategory.recipes.filter(r => r._id.toString() !== recipe._id.toString());
                await oldCategory.save();

                if (oldCategory.num <= 0) {
                    await Category.findByIdAndDelete(oldCategory._id);
                }
            }
        }

        res.json(recipe);
    }
    catch (error) {
        next({ message: error.message });
    }
};


export const deleteRecipe = async (req, res, next) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return next({ status: 404, message: 'Recipe not found' });

        const recipeUserId = recipe.user?._id?.toString() || recipe.user?.toString();
        const myUserId = req.myUser?._id?.toString();
        // רק הבעלים או מנהל יכולים למחוק
        if (recipeUserId !== myUserId && req.myUser.role !== 'admin') {
            return next({ status: 403, message: 'Not authorized to delete this recipe' });
        }

        if (recipe.category?._id) {
            const updatedCategory = await Category.findByIdAndUpdate(
                recipe.category._id,
                {
                    $inc: { num: -1 },
                    $pull: { recipes: { _id: recipe._id } }
                },
                { new: true }
            );
            if (updatedCategory && updatedCategory.num <= 0) {
                await Category.findByIdAndDelete(updatedCategory._id);
            }
        }
        await recipe.deleteOne();
        res.status(204).end();
    }
    catch (error) {
        next({ message: error.message });
    }
};
