import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuizService } from '../../core/services/quiz.service';
import { Question } from '../../shared/models/question.model';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.html'
})
export class QuizComponent implements OnInit, OnDestroy {

  questions: Question[] = [];
  currentIndex = 0;
  selectedAnswers: number[] = [];

  // ✅ Timer
  timeLeft = 30;
  private timer: any;

  constructor(
    private quizService: QuizService,
    private router: Router
  ) {}

  ngOnInit() {
    this.questions = this.quizService.getQuestions();
    this.startTimer();
  }

  // ✅ Timer Logic
  startTimer() {
    this.timeLeft = 30;
    this.timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft === 0) {
        this.autoNext();
      }
    }, 1000);
  }

  autoNext() {
    clearInterval(this.timer);
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.startTimer();
    } else {
      this.submit();
    }
  }

  // ✅ Option Select
  selectOption(index: number) {
    this.selectedAnswers[this.currentIndex] = index;
  }

  // ✅ PREVIOUS (THIS WAS MISSING)
  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.restartTimer();
    }
  }

  // ✅ NEXT (THIS WAS MISSING)
  next() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.restartTimer();
    }
  }

  // ✅ Restart Timer on Navigation
  restartTimer() {
    clearInterval(this.timer);
    this.startTimer();
  }

  // ✅ Submit
  submit() {
    clearInterval(this.timer);
    localStorage.setItem('answers', JSON.stringify(this.selectedAnswers));
    localStorage.setItem('questions', JSON.stringify(this.questions));
    this.router.navigate(['/result']);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
