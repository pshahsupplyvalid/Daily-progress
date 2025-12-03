import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-quiz',
  standalone: true,
  templateUrl: './start-quiz.html'
})
export class StartQuizComponent {
  constructor(private router: Router) {}

  startQuiz() {
    this.router.navigate(['/quiz']);
  }
}
