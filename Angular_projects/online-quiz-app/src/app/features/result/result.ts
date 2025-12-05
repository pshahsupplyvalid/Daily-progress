import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Question } from '../../shared/models/question.model';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule], // Required for *ngIf, *ngFor
  templateUrl: './result.html'
})
export class ResultComponent {

  // FIX: Allow using Object.keys in HTML template
  objectKeys = Object.keys;

  // Load stored data
  answers: (number | undefined)[] = JSON.parse(localStorage.getItem('answers') || '[]');
  questions: Question[] = JSON.parse(localStorage.getItem('questions') || '[]');
  times: number[] = JSON.parse(localStorage.getItem('times') || '[]');

  score = 0;
  total = 0;
  accuracy = 0;
  avgTime = 0;
  attempted = 0;

  // Difficulty performance storage
  perDifficulty: Record<string, { total: number, correct: number, avgTime: number }> = {};

  feedbackText = '';
  suggestions: string[] = [];

  constructor(private router: Router) {
    this.total = this.questions.length || 0;
    this.computeStats();
    this.generateFeedback();
  }

  // -------------------------------
  // STEP 1: Compute performance stats
  // -------------------------------
  private computeStats() {
    if (!this.questions || !this.questions.length) return;

    this.perDifficulty = {};

    this.questions.forEach((q, idx) => {
      const ans = this.answers[idx];
      const time = this.times[idx] || 0;
      const diff = (q as any).difficulty || 'standard';

      // Score
      if (ans !== undefined && ans === q.correctAnswer) {
        this.score++;
      }

      // Attempt counting
      if (ans !== undefined) {
        this.attempted++;
      }

      // Difficulty group initialization
      if (!this.perDifficulty[diff]) {
        this.perDifficulty[diff] = {
          total: 0,
          correct: 0,
          avgTime: 0
        };
      }

      // Increment total questions per difficulty
      this.perDifficulty[diff].total++;

      // Correct answers count
      if (ans !== undefined && ans === q.correctAnswer) {
        this.perDifficulty[diff].correct++;
      }

      // Add time for averaging
      (this.perDifficulty[diff] as any).sumTime =
        ((this.perDifficulty[diff] as any).sumTime || 0) + time;
    });

    // Compute averages
    const totalTime = this.times.reduce((sum, t) => sum + (t || 0), 0);
    this.avgTime = this.questions.length ? Math.round(totalTime / this.questions.length) : 0;

    this.accuracy =
      this.total ? Math.round((this.score / this.total) * 100) : 0;

    // Difficulty averages
    Object.keys(this.perDifficulty).forEach(diff => {
      const entry: any = this.perDifficulty[diff];

      entry.avgTime = entry.total
        ? Math.round((entry.sumTime || 0) / entry.total)
        : 0;

      delete entry.sumTime;
    });
  }

  // -------------------------------
  // STEP 2: Generate ChatGPT-style feedback
  // -------------------------------
  private generateFeedback() {
    const passMark = 60;
    const passed = this.accuracy >= passMark;

    let header = `You scored ${this.score} out of ${this.total} (${this.accuracy}%). `;
    header += passed ? 'Great job — you passed the quiz.' : 'You did not pass this time.';
    header += ` You attempted ${this.attempted} of ${this.total} questions.`;

    // Speed remark
    const speedRemark =
      this.avgTime <= 8 ? 'fast' : this.avgTime <= 20 ? 'moderate' : 'slow';
    header += ` Average time per question: ${this.avgTime}s — ${speedRemark}.`;

    // Strengths & Weaknesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    Object.keys(this.perDifficulty).forEach(diff => {
      const e = this.perDifficulty[diff];
      const pct = Math.round((e.correct / e.total) * 100);

      if (pct >= 70) strengths.push(`${diff} (${pct}% correct)`);
      if (pct < 50) weaknesses.push(`${diff} (${pct}% correct)`);
    });

    if (strengths.length) {
      header += ` Strengths: ${strengths.join(', ')}.`;
    }
    if (weaknesses.length) {
      header += ` Weak areas: ${weaknesses.join(', ')}.`;
    }

    // Suggestions
    this.suggestions = [];

    if (this.attempted < this.total) {
      this.suggestions.push(
        'Try to attempt all questions — skipping reduces your chance to score higher.'
      );
    }

    if (this.accuracy < 60) {
      this.suggestions.push('Review basics for the weak areas and try again.');
    } else {
      this.suggestions.push(
        'Great accuracy — try increasing speed to improve overall score.'
      );
    }

    if (this.avgTime > 20) {
      this.suggestions.push(
        'Your average time per question is high. Practice timed quizzes to improve speed.'
      );
    } else if (this.avgTime < 6) {
      this.suggestions.push(
        'You answered very quickly — slow down slightly to avoid mistakes.'
      );
    }

    // Difficulty-based suggestions
    Object.keys(this.perDifficulty).forEach(diff => {
      const e = this.perDifficulty[diff];
      const pct = Math.round((e.correct / e.total) * 100);

      if (pct < 50) {
        this.suggestions.push(
          `Focus on ${diff} level questions — strengthen fundamentals and medium-level practice.`
        );
      } else if (pct >= 80 && diff !== 'hard') {
        this.suggestions.push(
          `You're strong in ${diff} level — try moving up to more challenging questions.`
        );
      }
    });

    // Compose readable feedback text
    const lines: string[] = [];
    lines.push(header);
    lines.push('');
    lines.push('Detailed Analysis:');

    Object.keys(this.perDifficulty).forEach(diff => {
      const e = this.perDifficulty[diff];
      const pct = Math.round((e.correct / e.total) * 100);

      lines.push(
        `• ${diff.toUpperCase()}: ${pct}% correct — avg time ${e.avgTime}s (${e.total} questions).`
      );
    });

    lines.push('');
    if (this.suggestions.length > 0) {
      lines.push('Recommendations:');
      this.suggestions.forEach((suggestion, i) => {
        lines.push(`  ${i + 1}. ${suggestion}`);
      });
    }

    this.feedbackText = lines.join('\n');
  }

  // Navigation
  review() {
    this.router.navigate(['/review']);
  }

  restart() {
    this.router.navigate(['/']);
  }
}
