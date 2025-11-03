import React, { useState, useEffect } from 'react';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { FaSun, FaMoon } from 'react-icons/fa';

function App() {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
  });

  const [filter, setFilter] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text, priority) => {
    setTasks([...tasks, { text, completed: false, priority }]);
  };

  const toggleTask = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const editTask = (index, newText, newPriority) => {
    const updated = [...tasks];
    updated[index].text = newText;
    updated[index].priority = newPriority;
    setTasks(updated);
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div
      className={`container mt-5 rounded p-3 transition-all ${
        darkMode ? 'bg-dark text-light' : 'bg-light text-dark'
      }`}
    >
      {/* Navbar */}
      <nav
  className={`navbar mb-4 rounded ${darkMode ? 'bg-dark' : 'bg-primary'}`}
>
  <div className="container-fluid justify-content-between">
    <span
      className={`navbar-brand mb-0 h1 ${
        darkMode ? 'text-white' : 'text-light'
      }`}
    >
      📝 To-Do List
    </span>

    <div className="form-check form-switch d-flex align-items-center gap-2">
      <label className={`form-check-label ${darkMode ? 'text-white' : 'text-light'}`} htmlFor="darkModeSwitch">
        {darkMode ? <FaSun /> : <FaMoon />}
      </label>
      <input
        className="form-check-input"
        type="checkbox"
        id="darkModeSwitch"
        checked={darkMode}
        onChange={() => setDarkMode(!darkMode)}
      />
    </div>
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
          darkMode={darkMode}
        />
      ) : (
        <p className="text-center text-muted">
          {filter ? `No tasks match "${filter}"` : 'No tasks yet!'}
        </p>
      )}

      {/* Clear Completed */}
      {tasks.some((t) => t.completed) && (
        <div className="d-flex justify-content-center mt-3">
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

