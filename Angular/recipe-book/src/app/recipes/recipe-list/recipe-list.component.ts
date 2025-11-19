import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recipe-list.component.html'
})
export class RecipeListComponent {
  recipes = [];

  constructor(private recipeService: RecipeService) {
    this.recipes = this.recipeService.getRecipes();
  }
}
