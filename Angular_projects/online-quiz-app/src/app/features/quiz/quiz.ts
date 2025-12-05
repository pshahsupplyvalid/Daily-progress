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

  // Timing
  timeLeft = 30;
  private timer: any;
  private questionStartTs = 0;       // timestamp when current question shown (ms)
  private times: number[] = [];      // seconds taken per question

  constructor(
    private quizService: QuizService,
    private router: Router
  ) {}

  ngOnInit() {
    this.questions = this.quizService.getQuestions();

    // If you use AI engine that pushes new questions, ensure times array starts empty
    this.times = [];

    // Show first question and start timer
    this.startQuestion();
  }

  // call when a question becomes active
  private startQuestion() {
    this.timeLeft = 30;
    this.startTimer();

    // start timestamp
    this.questionStartTs = Date.now();
    // ensure array slot for this question exists
    if (this.times.length <= this.currentIndex) {
      this.times[this.currentIndex] = 0;
    }
  }

  startTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.autoNext();
      }
    }, 1000);
  }

  private recordTimeForCurrentQuestion() {
    if (!this.questionStartTs) return;
    const ms = Date.now() - this.questionStartTs;
    const seconds = Math.round(ms / 1000);
    // store seconds taken for this question (overwrite if existing)
    this.times[this.currentIndex] = seconds;
    // reset start ts
    this.questionStartTs = 0;
  }

  autoNext() {
    // record time spent
    this.recordTimeForCurrentQuestion();
    clearInterval(this.timer);
    // if last question -> submit
    if (this.currentIndex >= this.questions.length - 1) {
      this.submit();
      return;
    }
    this.currentIndex++;
    this.startQuestion();
  }

  selectOption(index: number) {
    // record selection
    this.selectedAnswers[this.currentIndex] = index;
    // record time now for this question (user answered)
    this.recordTimeForCurrentQuestion();
    // optional: auto-move to next after small delay — commented out; uncomment if desired:
    // setTimeout(() => this.next(), 300);
  }

  // Previous (user navigates back) — keep times as-is, but restart timer for previous question
  prev() {
    if (this.currentIndex > 0) {
      // record current (if timer running)
      this.recordTimeForCurrentQuestion();
      clearInterval(this.timer);
      this.currentIndex--;
      this.startQuestion();
    }
  }

  // Next: user explicitly presses Next (we record current time, then go next)
  next() {
    // if user hasn't answered, still record time (they skipped)
    this.recordTimeForCurrentQuestion();
    clearInterval(this.timer);

    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.startQuestion();
    } else {
      this.submit();
    }
  }

  // Submit: ensure last question time is recorded and persist answers/questions/times
  submit() {
    // if question still running, record its time
    this.recordTimeForCurrentQuestion();
    clearInterval(this.timer);

    // save to localStorage (strings)
    localStorage.setItem('answers', JSON.stringify(this.selectedAnswers));
    localStorage.setItem('questions', JSON.stringify(this.questions));
    localStorage.setItem('times', JSON.stringify(this.times));
    this.router.navigate(['/result']);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
