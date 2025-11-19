import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private recipes = [
    {
      id: 1,
      name: 'Paneer Butter Masala',
      image: 'https://via.placeholder.com/150',
      ingredients: ['Paneer', 'Butter', 'Tomato', 'Cream'],
      steps: 'Cook until creamy and serve hot.'
    },
    {
      id: 2,
      name: 'Pasta Alfredo',
      image: 'https://via.placeholder.com/150',
      ingredients: ['Pasta', 'Cheese', 'Cream'],
      steps: 'Mix boiled pasta with Alfredo sauce.'
    }
  ];

  getRecipes() {
    return this.recipes;
  }

  getRecipeById(id: number) {
    return this.recipes.find(r => r.id === id);
  }

  addRecipe(recipe: any) {
    this.recipes.push(recipe);
  }
}
