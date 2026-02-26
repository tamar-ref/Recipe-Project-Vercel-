import { Component, OnInit } from '@angular/core';
import { RepeatDirective } from '../../shared/directives/repeat.directive';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../shared/services/recipe.service';
import { Recipe } from '../../shared/models/recipe.model';
import { AuthService } from '../../shared/services/auth.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DurationPipe } from '../../shared/pipes/duration.pipe';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-all-recipes',
  standalone: true,
  imports: [DurationPipe, RepeatDirective, CommonModule, RouterModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule],
  templateUrl: './all-recipes.component.html',
  styleUrl: './all-recipes.component.scss'
})
export class AllRecipesComponent implements OnInit {

  recipes: Recipe[] = [];
  error: string = ''
  filteredRecipes: Recipe[] = [];
  searchTerm: string = '';
  categorySearchTerm: string = '';
  maxTimeInput: number | null = null;

  constructor(private recipeService: RecipeService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes() {
    const userId = this.authService.getUserIdFromToken() ?? undefined;
    this.recipeService.getAllRecipes(userId).subscribe({
      next: (data) => {
        this.recipes = data;
        this.filterRecipes();
      },
      error: () => {
        this.error = 'שגיאה בטעינת מתכונים';
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

    const categoryTerm = this.categorySearchTerm.toLowerCase().trim();
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
