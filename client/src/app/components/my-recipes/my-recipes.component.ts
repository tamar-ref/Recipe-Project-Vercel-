import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../shared/services/recipe.service';
import { Recipe } from '../../shared/models/recipe.model';
import { AuthService } from '../../shared/services/auth.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DurationPipe } from '../../shared/pipes/duration.pipe';
import { LoaderComponent } from "../../components/loader/loader.component";

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Category } from '../../shared/models/category.model';
import { CategoryService } from '../../shared/services/category.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-my-recipes',
  standalone: true,
  imports: [FormsModule, DurationPipe, CommonModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, LoaderComponent, MatSelectModule],
  templateUrl: '../../pages/all-recipes/all-recipes.component.html',
  styleUrl: '../../pages/all-recipes/all-recipes.component.scss'
})
export class MyRecipesComponent implements OnInit {

  recipes: Recipe[] = [];
  error: string = '';
  filteredRecipes: Recipe[] = [];
  searchTerm: string = '';
  categories: Category[] = [];
  selectedCategory: string | null = null; maxTimeInput: number | null = null;
  isDataLoading: boolean = false;

  constructor(private recipeService: RecipeService, private authService: AuthService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadRecipes();
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAllCategoriesAndRecipes().subscribe({
      next: (data) => {
        this.categories = data || [];
      },
      error: (e) => {
        this.error = 'שגיאה בטעינת קטגוריות';
      }
    });
  }

  loadRecipes() {
    this.isDataLoading = true;
    this.recipeService.getMyRecipes().subscribe({
      next: (data) => {
        this.recipes = data;
        this.filterRecipes();
        this.isDataLoading = false;
      },
      error: (err) => {
        this.error = 'שגיאה בטעינת מתכונים';
        this.isDataLoading = false;
      }
    });
  }

  onSearchChange(): void {
    this.loadRecipes();
  }

  filterRecipes(): void {
    if (this.recipes.length === 0) {
      this.filteredRecipes = [];
      this.error = 'אין מתכונים';
      return;
    }
    const categoryTerm = (this.selectedCategory || '').toLowerCase().trim();
    const nameTerm = this.searchTerm.toLowerCase().trim();

    this.filteredRecipes = this.recipes.filter(recipe => {
      const matchesName = recipe.name?.toLowerCase().includes(nameTerm);
      const matchesCategory = recipe.category?.name?.toLowerCase().includes(categoryTerm);
      const matchesTime = this.maxTimeInput == null || recipe.time <= this.maxTimeInput;
      return matchesName && matchesCategory && matchesTime;
    });

    this.error = this.filteredRecipes.length === 0 ? 'אין מתכונים תואמים לחיפוש' : '';
  }

  onMaxTimeChange(): void {
    this.filterRecipes();
  }

}
