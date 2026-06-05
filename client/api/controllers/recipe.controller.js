import Recipe from '../models/recipe.model.js';
import Category from '../models/category.model.js';
import User from '../models/user.model.js';
import cloudinary from '../config/cloudinary.js';
import mongoose from 'mongoose';

const uploadCloudinaryImage = async (imageData) => {
    if (!imageData || typeof imageData !== 'string' || !imageData.startsWith('data:')) {
        return null;
    }
    const uploadResult = await cloudinary.uploader.upload(imageData, {
        folder: 'recipes',
        resource_type: 'image'
    });
    return {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id
    };
};

const extractPublicIdFromUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    const match = url.match(/upload(?:\/v\d+)?\/(.+)\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i);
    return match ? match[1] : null;
};

const deleteCloudinaryImage = async (publicId, imageUrl) => {
    const effectivePublicId = publicId || extractPublicIdFromUrl(imageUrl);
    if (!effectivePublicId) return;
    await cloudinary.uploader.destroy(effectivePublicId, { resource_type: 'image' });
};

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
        let category = await Category.findOne({ name: categoryName });
        const user = await User.findById(req.myUser._id);

        let image = req.body.image;
        let imagePublicId = null;
        const uploadResult = await uploadCloudinaryImage(req.body.image);
        if (uploadResult) {
            image = uploadResult.url;
            imagePublicId = uploadResult.publicId;
        }

        const recipeData = {
            ...req.body,
            image,
            imagePublicId,
            user: { _id: req.myUser._id, username: user.username },
            category: { _id: category._id, name: category.name }
        };
        const recipe = new Recipe(recipeData);
        await recipe.save();

        category.recipes.push({
            _id: recipe._id,
            name: recipe.name,
        });
        category.num += 1;
        await category.save();

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

        const oldCategoryId = recipe.category?._id;

        // הכנה לקטגוריה חדשה (שם כטקסט)
        const categoryName = req.body.category.trim();
        let category = await Category.findOne({ name: categoryName });

        // Image handling
        const newImage = req.body.image;
        const isNewImageUpload = typeof newImage === 'string' && newImage.startsWith('data:');
        const isImageRemoved = newImage === '';

        if (isNewImageUpload || isImageRemoved) {
            await deleteCloudinaryImage(recipe.imagePublicId, recipe.image);
        }

        if (isNewImageUpload) {
            const uploadResult = await uploadCloudinaryImage(newImage);
            req.body.image = uploadResult?.url;
            req.body.imagePublicId = uploadResult?.publicId;
        } else if (isImageRemoved) {
            req.body.image = undefined;
            req.body.imagePublicId = undefined;
        } else {
            // Keep existing image fields if unchanged
            req.body.image = recipe.image;
            req.body.imagePublicId = recipe.imagePublicId;
        }

        // המרת המחרוזת לאובייקט קטגוריה
        req.body.category = {
            _id: category._id,
            name: category.name
        };

        // עדכון בפועל
        Object.assign(recipe, req.body);
        await recipe.save();

        // עדכון שם המתכון ברשימת הקטגוריה
        await Category.updateOne(
            { _id: category._id, 'recipes._id': recipe._id },
            { $set: { 'recipes.$.name': recipe.name } }
        );

        // אם זו קטגוריה חדשה, להסיר מהישנה
        if (oldCategoryId && oldCategoryId.toString() !== category._id.toString()) {
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

        if (recipe.imagePublicId || recipe.image) {
            await deleteCloudinaryImage(recipe.imagePublicId, recipe.image);
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
        }
        await recipe.deleteOne();
        res.status(204).end();
    }
    catch (error) {
        next({ message: error.message });
    }
};
