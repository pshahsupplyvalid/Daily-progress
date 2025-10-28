import React, { useState } from 'react';

function TaskInput({ onAddTask }) {
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState('Medium');

  const handleAdd = () => {
    if (!input.trim()) return;
    onAddTask(input, priority);
    setInput('');
    setPriority('Medium');
  };

  return (
    <div className="d-flex mb-3 gap-2">
      <input
        type="text"
        className="form-control"
        placeholder="Enter a task..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <select 
        className="form-select" 
        value={priority} 
        onChange={(e) => setPriority(e.target.value)}
      >
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
      <button 
        className="btn btn-success" 
        onClick={handleAdd} 
        style={{ transition: '0.3s' }}
        onMouseEnter={e => e.target.style.backgroundColor='#28a745cc'}
        onMouseLeave={e => e.target.style.backgroundColor='#198754'}
      >
        Add Task
      </button>
    </div>
  );
}

export default TaskInput;
