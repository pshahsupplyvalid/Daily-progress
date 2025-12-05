import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {

  // FIX: allow Math.min in template
  math = Math;

  // navigation / categories
  categories = [
    { label: 'Angular', route: '/quiz?cat=angular' },
    { label: 'HTML', route: '/quiz?cat=html' },
    { label: 'CSS', route: '/quiz?cat=css' },
    { label: 'JavaScript', route: '/quiz?cat=javascript' },
    { label: 'TypeScript', route: '/quiz?cat=typescript' },
    { label: 'General Web Dev', route: '/quiz?cat=general' }
  ];

  modes = [
    { value: 'smart', label: 'Smart Mode (AI Adaptive)' },
    { value: 'timed', label: 'Timed Quiz' },
    { value: 'practice', label: 'Practice Mode' },
    { value: 'challenge', label: 'Challenge Mode' }
  ];

  selectedMode = 'smart';
  preferredDifficulty = 'mixed';
  soundOn = true;
  timerEnabled = true;

  // stats
  totalQuizzes = 0;
  bestScore = 0;
  avgAccuracy = 0;
  totalTimeSec = 0;
  xp = 0;
  streak = 0;

  // IMPORTANT FIX: make router and service PUBLIC
  constructor(
    public router: Router,
    public userService: UserService
  ) {
    this.loadStats();

    const s = this.userService.getSettings();
    this.soundOn = s.sound;
    this.timerEnabled = s.timerEnabled;
    this.preferredDifficulty = s.preferredDifficulty;
  }

  navTo(route: string) {
    this.router.navigateByUrl(route);
  }

  startMode(mode: string) {
    this.selectedMode = mode;
    localStorage.setItem('quiz_mode', mode);
    this.router.navigate(['/quiz']);
  }

  toggleBookmark(id: number) {
    this.userService.toggleBookmark(id);
    this.loadStats();
  }

  loadStats() {
    this.totalQuizzes = this.userService.getTotalQuizzesTaken();
    this.bestScore = this.userService.getBestScore();
    this.avgAccuracy = this.userService.getAverageAccuracy();
    this.totalTimeSec = this.userService.getTotalTime();
    this.xp = this.userService.getXP();
    this.streak = this.userService.getStreak();
  }

  formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  }

  saveSettings() {
    this.userService.updateSettings({
      sound: this.soundOn,
      timerEnabled: this.timerEnabled,
      preferredDifficulty: this.preferredDifficulty as any
    });
  }

  clearHistory() {
    if (!confirm('Clear all attempts and stats?')) return;
    this.userService.resetAll();
    this.loadStats();
  }

  openAITutor() {
    alert('AI Tutor placeholder — can be connected to your AI system.');
  }
}
