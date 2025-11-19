import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recipe-detail.component.html'
})
export class RecipeDetailComponent {
  recipe: any;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.recipe = this.recipeService.getRecipeById(id);
  }
}
