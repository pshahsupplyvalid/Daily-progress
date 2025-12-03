import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/start-quiz/start-quiz')
        .then(m => m.StartQuizComponent)
  },
  {
    path: 'quiz',
    loadComponent: () =>
      import('./features/quiz/quiz')
        .then(m => m.QuizComponent)
  },
  {
    path: 'result',
    loadComponent: () =>
      import('./features/result/result')
        .then(m => m.ResultComponent)
  }
];
