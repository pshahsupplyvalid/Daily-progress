import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Todo {
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit {

  newTask = '';
  tasks: Todo[] = [];
  editIndex: number | null = null;
  filter: 'all' | 'completed' | 'pending' = 'all';
  darkMode = false;

  storageKey = 'todo-storage-v1';

  ngOnInit() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      this.tasks = JSON.parse(saved);
    }
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
  }

  addTask() {
    const text = this.newTask.trim();
    if (!text) return;

    if (this.editIndex !== null) {
      this.tasks[this.editIndex].title = text;
      this.editIndex = null;
    } else {
      this.tasks.unshift({ title: text, completed: false });
    }

    this.newTask = '';
    this.save();
  }

  editTask(index: number) {
    this.newTask = this.tasks[index].title;
    this.editIndex = index;
  }

  deleteTask(index: number) {
    this.tasks.splice(index, 1);
    this.save();
  }

  toggleTask(index: number) {
    this.tasks[index].completed = !this.tasks[index].completed;
    this.save();
  }

  clearAll() {
    if (confirm('Clear all tasks?')) {
      this.tasks = [];
      this.save();
    }
  }

  setFilter(f: 'all' | 'completed' | 'pending') {
    this.filter = f;
  }

  get filteredTasks() {
    if (this.filter === 'completed') return this.tasks.filter(t => t.completed);
    if (this.filter === 'pending') return this.tasks.filter(t => !t.completed);
    return this.tasks;
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }
}
