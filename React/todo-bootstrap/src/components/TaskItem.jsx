import React, { useState } from 'react';

function TaskItem({ task, index, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleSave = () => {
    onEdit(index, editText);
    setIsEditing(false);
  };

  return (
    <li
      className={`list-group-item d-flex justify-content-between align-items-center ${
        task.completed ? 'list-group-item-success' : ''
      }`}
    >
      <div className="form-check d-flex align-items-center">
        <input
          className="form-check-input me-2"
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(index)}
        />
        {isEditing ? (
          <input
            type="text"
            className="form-control"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            autoFocus
          />
        ) : (
          <span
            style={{
              textDecoration: task.completed ? 'line-through' : 'none',
              fontWeight: task.completed ? 'normal' : 'bold',
            }}
            onDoubleClick={() => setIsEditing(true)}
          >
            {task.text}
          </span>
        )}
      </div>

      <div>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => onDelete(index)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default TaskItem;
