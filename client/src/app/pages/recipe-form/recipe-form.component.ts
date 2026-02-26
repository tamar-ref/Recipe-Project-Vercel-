import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../shared/services/category.service';
import { Category } from '../../shared/models/category.model';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../shared/services/recipe.service';
import { Router } from '@angular/router';
import { Recipe } from '../../shared/models/recipe.model';
import { ActivatedRoute } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatRadioModule, MatIconModule],
  templateUrl: './recipe-form.component.html',
  styleUrl: './recipe-form.component.scss'
})
export class RecipeFormComponent implements OnInit {
  @Input() recipeToEdit: Recipe | null = null;
  isEditMode: boolean = false;

  name: string = '';
  description: string = '';
  selectedCategory: string = '';
  newCategory: string = '';
  time: number | null = null;
  difficulty: number | null = null;
  layers: { ingredients: string; description: string }[] = [
    { ingredients: '', description: '' }
  ];
  image: File | null = null;
  src: string = '';
  instructions: string[] = [''];
  isPrivate: boolean = false;

  constructor(private categoryService: CategoryService, private recipeService: RecipeService, private router: Router, private route: ActivatedRoute,) { }

  categories: Category[] = [];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!id;
    if (id) {
      this.recipeService.getRecipeById(id).subscribe({
        next: (data) => {
          this.recipeToEdit = data;

          this.name = this.recipeToEdit.name;
          this.description = this.recipeToEdit.description;
          this.selectedCategory = String(this.recipeToEdit.category.name);
          this.time = this.recipeToEdit.time;
          this.difficulty = this.recipeToEdit.difficulty;
          this.layers = [...this.recipeToEdit.layers];
          this.instructions = [...this.recipeToEdit.instructions];
          this.isPrivate = this.recipeToEdit.isPrivate;
        },
        error: () => console.error('שגיאה בטעינת מתכון לעריכה')
      });
    }

    this.categoryService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => {
        //console.error('שגיאה בטעינת קטגוריות', err.message)
        alert('שגיאה בטעינת קטגוריות')
      }
    });
  }

  imagePreview: string | ArrayBuffer | null = null;

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.image = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.src = reader.result as string;
      };
      reader.readAsDataURL(this.image);
    }
  }

  removeImage(fileInput: HTMLInputElement): void {
    this.image = null;
    this.imagePreview = null;
    this.src = '';
    fileInput.value = '';
  }

  addLayer(): void {
    this.layers.push({ ingredients: '', description: '' });
  }

  removeLayer(index: number): void {
    this.layers.splice(index, 1);
  }

  updateLayer(index: number, field: 'ingredients' | 'description', event: Event): void {
    const input = event.target as HTMLInputElement;
    this.layers[index][field] = input.value;
  }

  addInstruction(): void {
    this.instructions.push('');
  }

  removeInstruction(index: number): void {
    this.instructions.splice(index, 1);
  }

  trackByIndex(index: number, item: string): number {
    return index;
  }



  addRecipe(): void {
    const filteredInstructions = this.instructions.filter(text => text.trim() !== '');
    const filteredLayers = this.layers.filter(obj => {
      return obj.ingredients.trim() !== '' || obj.description.trim() !== '';
    });

    const formData = {
      name: this.name,
      description: this.description,
      category: this.selectedCategory === 'other' ? this.newCategory.trim() : this.selectedCategory,
      time: this.time || 0,
      difficulty: this.difficulty || 0,
      date: new Date(),
      layers: filteredLayers,
      instructions: filteredInstructions,
      image: this.src,
      isPrivate: this.isPrivate
    }

    if (this.recipeToEdit) {
      this.recipeService.updateRecipe(this.recipeToEdit._id, formData).subscribe({
        next: (res) => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error adding recipe:', err);
          alert(err.error.error)
        }
      });
    }
    else {
      this.recipeService.addRecipe(formData).subscribe({
        next: (res) => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error adding recipe:', err);
          alert(err.error.error)
        }
      });
    }

  }

}
