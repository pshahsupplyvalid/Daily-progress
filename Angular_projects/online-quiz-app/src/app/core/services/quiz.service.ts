import { Injectable } from '@angular/core';
import { Question } from '../../shared/models/question.model';

@Injectable({ providedIn: 'root' })
export class QuizService {

  private key = 'quiz_questions';

  private defaultQuestions: Question[] = [
    {
      id: 1,
      question: 'What is Angular?',
      options: ['Framework', 'Library', 'Language', 'Database'],
      correctAnswer: 0
    },
    {
      id: 2,
      question: 'Which language is used in Angular?',
      options: ['PHP', 'Java', 'TypeScript', 'Python'],
      correctAnswer: 2
    },
    {
      id: 3,
      question: 'What does HTML stand for?',
      options: [
        'Hyper Text Markup Language',
        'High Text Machine Language',
        'Hyper Tool Multi Language',
        'Hyperlinks Text Mark Language'
      ],
      correctAnswer: 0
    },
    {
      id: 4,
      question: 'Which tag is used for CSS?',
      options: ['<css>', '<style>', '<script>', '<link>'],
      correctAnswer: 1
    },
    {
      id: 5,
      question: 'Which company developed Angular?',
      options: ['Facebook', 'Microsoft', 'Google', 'Amazon'],
      correctAnswer: 2
    }
  ];

  constructor() {

    if (!localStorage.getItem(this.key)) {
      localStorage.setItem(this.key, JSON.stringify(this.defaultQuestions));
    }
  }

  
  getQuestions(): Question[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  
  addQuestion(question: Question) {
    const list = this.getQuestions();
    list.push(question);
    localStorage.setItem(this.key, JSON.stringify(list));
  }

  
  deleteQuestion(id: number) {
    const list = this.getQuestions().filter(q => q.id !== id);
    localStorage.setItem(this.key, JSON.stringify(list));
  }

  
  resetQuestions() {
    localStorage.setItem(this.key, JSON.stringify(this.defaultQuestions));
  }
}
