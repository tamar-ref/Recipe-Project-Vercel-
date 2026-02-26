import { Recipe } from "./recipe.model";

export interface Category {
    _id: string;
    code: string;
    description: string;
    num: number;
    recipes: Recipe[];
}
