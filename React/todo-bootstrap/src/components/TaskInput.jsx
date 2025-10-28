import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function TaskInput({ onAddTask }) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim() === '') return;
    onAddTask(input);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Enter a new task"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button className="btn btn-success" onClick={handleAdd}>
        Add Task
      </button>
    </div>
  );
}

export default TaskInput;
