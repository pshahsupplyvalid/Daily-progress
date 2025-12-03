import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  standalone: true,
  templateUrl: './result.html'
})
export class ResultComponent {

  answers: number[] = JSON.parse(localStorage.getItem('answers') || '[]');
  questions: any[] = JSON.parse(localStorage.getItem('questions') || '[]');

  score = 0;
  total = 0; // ✅ THIS WAS MISSING

  constructor(private router: Router) {
    this.total = this.questions.length;

    this.questions.forEach((q, i) => {
      if (q.correctAnswer === this.answers[i]) {
        this.score++;
      }
    });
  }

  restart() {
    this.router.navigate(['/']);
  }
}
