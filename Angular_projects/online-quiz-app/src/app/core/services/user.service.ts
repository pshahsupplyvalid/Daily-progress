// src/app/core/services/user.service.ts
import { Injectable } from '@angular/core';

export type QuizMode = 'smart' | 'timed' | 'practice' | 'challenge';

export interface Attempt {
  date: string; // ISO
  score: number;
  total: number;
  accuracy: number;
  timeTakenSec: number;
  difficulty?: string;
  mode?: QuizMode;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  sound: boolean;
  timerEnabled: boolean;
  preferredDifficulty: 'easy' | 'medium' | 'hard' | 'mixed';
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private key = 'quiz_user_v2';

  private state = {
    attempts: [] as Attempt[],
    bookmarks: [] as number[], // store question ids
    xp: 0,
    streak: 0,
    bestScore: 0,
    totalTimeSec: 0,
    settings: {
      theme: 'light',
      sound: true,
      timerEnabled: true,
      preferredDifficulty: 'mixed'
    } as UserSettings
  };

  constructor() {
    this.load();
  }

  private load() {
    const raw = localStorage.getItem(this.key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        this.state = { ...this.state, ...parsed };
      } catch (e) {
        console.warn('UserService: could not parse storage, resetting');
        this.save();
      }
    } else {
      this.save();
    }
  }

  private save() {
    localStorage.setItem(this.key, JSON.stringify(this.state));
  }

  // Attempts
  addAttempt(attempt: Attempt) {
    this.state.attempts.unshift(attempt);
    // keep last 50
    this.state.attempts = this.state.attempts.slice(0, 50);
    // stats update
    this.state.totalTimeSec += attempt.timeTakenSec || 0;
    if (attempt.score > this.state.bestScore) this.state.bestScore = attempt.score;
    // XP & streak
    const xpGain = Math.round((attempt.accuracy || 0) / 10) + (attempt.mode === 'challenge' ? 5 : 0);
    this.state.xp += xpGain;
    // streak: if last attempt was yesterday or today, increase; simple rule: increment on every day (for demo)
    const last = this.state.attempts[1];
    if (!last) this.state.streak = 1;
    else {
      const lastDate = new Date(last.date).toDateString();
      const curDate = new Date().toDateString();
      this.state.streak = lastDate === curDate ? this.state.streak : this.state.streak + 1;
    }
    this.save();
  }

  getAttempts(): Attempt[] {
    return this.state.attempts;
  }

  // Bookmarks
  toggleBookmark(questionId: number) {
    const idx = this.state.bookmarks.indexOf(questionId);
    if (idx >= 0) {
      this.state.bookmarks.splice(idx, 1);
    } else {
      this.state.bookmarks.push(questionId);
    }
    this.save();
  }

  isBookmarked(questionId: number): boolean {
    return this.state.bookmarks.indexOf(questionId) >= 0;
  }

  getBookmarks(): number[] {
    return [...this.state.bookmarks];
  }

  // Stats getters
  getTotalQuizzesTaken() {
    return this.state.attempts.length;
  }

  getBestScore() {
    return this.state.bestScore;
  }

  getAverageAccuracy() {
    if (!this.state.attempts.length) return 0;
    const sum = this.state.attempts.reduce((s, a) => s + (a.accuracy || 0), 0);
    return Math.round(sum / this.state.attempts.length);
  }

  getTotalTime() {
    return this.state.totalTimeSec;
  }

  getXP() {
    return this.state.xp;
  }

  getStreak() {
    return this.state.streak;
  }

  // Settings
  getSettings(): UserSettings {
    return this.state.settings;
  }

  updateSettings(partial: Partial<UserSettings>) {
    this.state.settings = { ...this.state.settings, ...partial };
    this.save();
  }

  resetAll() {
    localStorage.removeItem(this.key);
    this.state = {
      attempts: [],
      bookmarks: [],
      xp: 0,
      streak: 0,
      bestScore: 0,
      totalTimeSec: 0,
      settings: {
        theme: 'light',
        sound: true,
        timerEnabled: true,
        preferredDifficulty: 'mixed'
      }
    };
    this.save();
  }
}
