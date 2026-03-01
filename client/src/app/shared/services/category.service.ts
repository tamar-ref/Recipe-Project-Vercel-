import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl =  /*'/api/categories' :*/ 'http://localhost:3000/api/categories';
  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }
  getAllCategoriesAndRecipes(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/with-recipes`);
  }

  getCategoryByCodeOrNameAndRecipes(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/search`);
  }
}
