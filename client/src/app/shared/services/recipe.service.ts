import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class RecipeService {
    private baseUrl = 'http://localhost:3000/recipes';

    constructor(private http: HttpClient) { }

    getAllRecipes(userId?: string | null | undefined, search: string = ''): Observable<Recipe[]> {
        let params = new HttpParams();
        if (userId) {
            params = params.set('userId', userId);
        }
        if (search) {
            params = params.set('search', search);
        }
        return this.http.get<Recipe[]>(this.baseUrl, { params });
    }

    getRecipesByTime(time: number): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(`${this.baseUrl}/time/${time}`);
    }

    getRecipeById(id: string): Observable<Recipe> {
        return this.http.get<Recipe>(`${this.baseUrl}/${id}`);
    }

    getMyRecipes(): Observable<Recipe[]> {
        const user = localStorage.getItem('user');
        const token = user ? JSON.parse(user).token : null;
        const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
        return this.http.get<Recipe[]>(`${this.baseUrl}/user/mine`, { headers });
    }

    addRecipe(recipeData: {
        name: string,
        description: string,
        category: string,
        time: number,
        difficulty: number,
        date: Date,
        layers: { ingredients: string, description: string }[],
        instructions: string[],
        image: string,
        isPrivate: boolean
    }): Observable<Recipe> {
        const user = localStorage.getItem('user');
        const token = user ? JSON.parse(user).token : null;
        const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
        return this.http.post<Recipe>(this.baseUrl, recipeData, { headers });
    }

    updateRecipe(id: string, recipeData: {
        name: string,
        description: string,
        category: string,
        time: number,
        difficulty: number,
        date: Date,
        layers: { ingredients: string, description: string }[],
        instructions: string[],
        image: string,
        isPrivate: boolean
    }): Observable<Recipe> {
        const user = localStorage.getItem('user');
        const token = user ? JSON.parse(user).token : null;
        const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
        return this.http.put<Recipe>(`${this.baseUrl}/${id}`, recipeData, { headers });
    }

    deleteRecipe(id: string): Observable<void> {
        const user = localStorage.getItem('user');
        const token = user ? JSON.parse(user).token : null;
        const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
        return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers });
    }
}