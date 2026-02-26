import { Component, OnInit } from '@angular/core';
import { DurationPipe } from '../../shared/pipes/duration.pipe';
import { RepeatDirective } from '../../shared/directives/repeat.directive';
import { Recipe } from '../../shared/models/recipe.model';
import { RecipeService } from '../../shared/services/recipe.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [DurationPipe, RepeatDirective, CommonModule, MatCardModule, MatButtonModule, MatDividerModule],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.scss'
})
export class RecipeDetailsComponent implements OnInit {
  recipeUserId: string | null = null;
  recipe: Recipe | null = null;
  error: string = '';

  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private userService: UserService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    const token = userStr ? JSON.parse(userStr).token : null;
    this.recipeUserId = this.authService.getUserIdFromToken();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recipeService.getRecipeById(id).subscribe({
        next: (data) => this.recipe = data,
        error: (err) => this.error = 'שגיאה בטעינת המתכון'
      });
    }
    else {
      this.error = 'מתכון לא נמצא';
    }
  }

  update() {
    if (this.recipe && this.recipe._id) {
      this.router.navigate(['/edit-recipe', this.recipe._id]);
    }
  }

  delete() {
    if (this.recipe && this.recipe._id) {
      this.recipeService.deleteRecipe(this.recipe._id).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          alert(err.error.error)
        }
      });
    }
  }

}