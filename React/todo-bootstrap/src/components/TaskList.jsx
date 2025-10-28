import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks = [], onToggle, onDelete, onEdit }) {
  // tasks default to [] to prevent undefined error
  if (!tasks.length)
    return <p className="text-center text-muted">No tasks yet!</p>;

  return (
    <ul className="list-group mb-3">
      {tasks.map((task, index) => (
        <TaskItem
          key={index}
          task={task}
          index={index}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}

export default TaskList;
