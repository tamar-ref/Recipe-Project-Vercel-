import { Routes } from '@angular/router';
import { AllRecipesComponent } from './pages/all-recipes/all-recipes.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { RecipeFormComponent } from './pages/recipe-form/recipe-form.component';
import { MyRecipesComponent } from './components/my-recipes/my-recipes.component';
import { RecipeDetailsComponent } from './pages/recipe-details/recipe-details.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { UpdateDetailsComponent } from './components/update-details/update-details.component';

export const routes: Routes = [
    { path: '', component: AllRecipesComponent },
    { path: 'all-recipes', component: AllRecipesComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'add-recipe', component: RecipeFormComponent },
    { path: 'my-recipes', component: MyRecipesComponent },
    { path: 'recipe/:id', component: RecipeDetailsComponent },
    { path: 'edit-recipe/:id', component: RecipeFormComponent },
    { path: 'users', component: AllUsersComponent },
    { path: 'update-details', component: UpdateDetailsComponent },
];
