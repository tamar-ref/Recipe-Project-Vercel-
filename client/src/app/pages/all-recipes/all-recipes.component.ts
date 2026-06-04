import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../shared/services/recipe.service';
import { Recipe } from '../../shared/models/recipe.model';
import { AuthService } from '../../shared/services/auth.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DurationPipe } from '../../shared/pipes/duration.pipe';
import { LoaderComponent } from '../../components/loader/loader.component';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CategoryService } from '../../shared/services/category.service';
import { Category } from '../../shared/models/category.model';

@Component({
  selector: 'app-all-recipes',
  standalone: true,
  imports: [DurationPipe, CommonModule, RouterModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, LoaderComponent],
  templateUrl: './all-recipes.component.html',
  styleUrl: './all-recipes.component.scss'
})
export class AllRecipesComponent implements OnInit {

  recipes: Recipe[] = [];
  categories: Category[] = [];
  selectedCategory: string = '';
  error: string = ''
  filteredRecipes: Recipe[] = [];
  searchTerm: string = '';
  maxTimeInput: number | null = null;
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
    const userId = this.authService.getUserIdFromToken() ?? undefined;
    this.recipeService.getAllRecipes(userId).subscribe({
      next: (data) => {
        this.recipes = data;
        this.filterRecipes();
        this.isDataLoading = false;
      },
      error: (e) => {
        this.error = 'שגיאה בטעינת מתכונים';
        this.isDataLoading = false;
      }
    });
  }

  onSearchChange(): void {
    this.filterRecipes();
  }

  filterRecipes(): void {
    if (this.recipes.length === 0) {
      this.filteredRecipes = [];
      this.error = 'אין מתכונים';
      return;
    }

    const selectedCategory = this.selectedCategory?.trim();
    const nameTerm = this.searchTerm.toLowerCase().trim();
    const selectedRecipes = this.categories.find(cat => cat.name === selectedCategory)?.recipes.map(recipe => recipe._id) || this.recipes;
    this.filteredRecipes = selectedRecipes.filter(recipe => {
      const matchesName = recipe.name?.toLowerCase().includes(nameTerm);
      const matchesTime = this.maxTimeInput == null || recipe.time <= this.maxTimeInput;
      return matchesName && matchesTime;
    });

    this.error = this.filteredRecipes.length === 0 ? 'אין מתכונים תואמים לחיפוש' : '';
  }

  onMaxTimeChange(): void {
    this.filterRecipes();
  }

}
