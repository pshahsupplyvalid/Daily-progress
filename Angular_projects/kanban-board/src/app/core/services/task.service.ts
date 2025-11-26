import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../../shared/models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {

  private tasksStore = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksStore.asObservable();

  constructor() {}

  /** Add a new task */
  addTask(task: Task) {
    const updated = [...this.tasksStore.value, task];
    this.tasksStore.next(updated);
  }

  /** Delete a task */
  deleteTask(id: string) {
    const updated = this.tasksStore.value.filter(task => task.id !== id);
    this.tasksStore.next(updated);
  }

  /** Get all tasks */
  getTasks() {
    return this.tasksStore.value;
  }

  /** Get tasks filtered by status */
  getTasksByStatus(status: 'todo' | 'in-progress' | 'done') {
    return this.tasksStore.value.filter(task => task.status === status);
  }
}
