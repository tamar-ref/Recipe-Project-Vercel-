import { Category } from './category.model';
import { User } from './user.model';

export interface Recipe {
    _id: string;
    name: string;
    description: string;
    category: {
        _id: { type: Category, ref: 'categories', required: true },
        name: String,
    },
    time: number;
    difficulty: number;
    date: Date;
    layers: { ingredients: string; description: string }[];
    instructions: string[];
    image: string;
    isPrivate: boolean;
    user: User;
}
