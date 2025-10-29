import React from 'react';
import { FaTrash, FaEdit, FaCheck } from 'react-icons/fa';

function TaskList({ tasks, onToggle, onDelete, onEdit, darkMode }) {
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div className="d-flex flex-column gap-2">
      {tasks.map((task, index) => (
        <div 
          key={index} 
          className={`card shadow-sm ${darkMode ? 'bg-secondary text-light' : 'bg-light text-dark'}`} 
          style={{ transition: 'all 0.3s', opacity: task.completed ? 0.6 : 1 }}
        >
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h6 style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.text} 
                <span className={`badge bg-${getPriorityColor(task.priority)} ms-2`}>
                  {task.priority}
                </span>
              </h6>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-success" onClick={() => onToggle(index)}>
                <FaCheck />
              </button>
              <button className="btn btn-sm btn-primary" onClick={() => {
                const newText = prompt("Edit task", task.text);
                const newPriority = prompt("Priority: High, Medium, Low", task.priority);
                if(newText) onEdit(index, newText, newPriority || task.priority);
              }}>
                <FaEdit />
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => onDelete(index)}>
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
