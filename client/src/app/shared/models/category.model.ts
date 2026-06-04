import { Recipe } from "./recipe.model";

export interface Category {
    _id: string;
    name: string;
    num: number;
    recipes: {
        _id: Recipe,
        name: string;
    }[];
}
