import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../shared/models/task.model';


@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './board.html',
  styleUrls: ['./board.scss']
})
export class BoardComponent {

  newTask: Task = {
    id: '',
    title: '',
    description: '',
    status: 'todo',
    priority: 'low'
  };

  tasks: Task[] = [];

  constructor(private taskService: TaskService) {
    this.taskService.tasks$.subscribe(data => this.tasks = data);
  }

  getTasks(status: Task['status']) {
    return this.tasks.filter(task => task.status === status);
  }

  saveTask() {
    if (!this.newTask.title.trim()) return;

    const taskToAdd: Task = {
      ...this.newTask,
      id: Date.now().toString()
    };

    this.taskService.addTask(taskToAdd);

    // Reset form
    this.newTask = {
      id: '',
      title: '',
      description: '',
      status: 'todo',
      priority: 'low'
    };
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id);
  }
}
