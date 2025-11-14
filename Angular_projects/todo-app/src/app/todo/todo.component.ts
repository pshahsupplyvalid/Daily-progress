import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [FormsModule, CommonModule],  // ⬅️ Add it here also
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent {

  newTask = '';
  tasks: any[] = [];

  addTask() {
    if (!this.newTask.trim()) return;

    this.tasks.push({
      title: this.newTask,
      completed: false
    });

    this.newTask = '';
  }

  deleteTask(index: number) {
    this.tasks.splice(index, 1);
  }

  toggleTask(index: number) {
    this.tasks[index].completed = !this.tasks[index].completed;
  }
}
