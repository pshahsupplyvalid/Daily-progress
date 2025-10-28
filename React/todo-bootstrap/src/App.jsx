import React, { useState, useEffect } from 'react';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

function App() {
  // Tasks state
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
  });

  // Filter for search
  const [filter, setFilter] = useState('');

  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Task operations
  const addTask = (text) => {
    setTasks([...tasks, { text, completed: false }]);
  };

  const toggleTask = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const editTask = (index, newText) => {
    const updated = [...tasks];
    updated[index].text = newText;
    setTasks(updated);
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  // Filtered tasks based on search
  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className={darkMode ? "container bg-dark text-light mt-5" : "container bg-light text-dark mt-5"}>
      
      {/* Navbar with Dark Mode Button */}
      <nav className="navbar navbar-dark bg-primary mb-4 rounded">
        <div className="container-fluid justify-content-between">
          <span className="navbar-brand mb-0 h1">📝 To-Do List App</span>
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="btn btn-light btn-sm"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </nav>

      {/* Search Bar */}
      <input
        type="text"
        className="form-control mb-3 search-bar"
        placeholder="🔍 Search tasks..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {/* Add Task */}
      <TaskInput onAddTask={addTask} />

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        <TaskList
          tasks={filteredTasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={editTask}
        />
      ) : (
        <p className="text-center text-muted">
          {filter ? `No tasks match "${filter}"` : 'No tasks yet!'}
        </p>
      )}

      {/* Clear Completed */}
      {tasks.some((t) => t.completed) && (
        <div className="d-flex justify-content-center">
          <button className="btn btn-warning" onClick={clearCompleted}>
            Clear Completed
          </button>
        </div>
      )}

      {/* Task Count */}
      <p className="text-center text-muted mt-3">
        {tasks.filter((t) => t.completed).length} / {tasks.length} tasks completed
      </p>
    </div>
  );
}

export default App;
