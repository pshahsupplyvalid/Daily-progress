import { Routes } from '@angular/router';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { AddRecipeComponent } from './recipes/add-recipe/add-recipe.component';

export const routes: Routes = [
  { path: '', component: RecipeListComponent },
  { path: 'recipe/:id', component: RecipeDetailComponent },
  { path: 'add', component: AddRecipeComponent }
];
