import { Component } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html'
})
export class AddRecipeComponent {
  name = '';
  image = '';
  ingredients = '';
  steps = '';

  constructor(private recipeService: RecipeService, private router: Router) {}

  addRecipe() {
    this.recipeService.addRecipe({
      id: Date.now(),
      name: this.name,
      image: this.image,
      ingredients: this.ingredients.split(','),
      steps: this.steps
    });

    this.router.navigate(['/']);
  }
}
