import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTasks } from '../contexts/TaskContext';

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

const TaskCard = ({ task, onEdit, onView }) => {
  const { deleteTask } = useTasks();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${task.title}"?`)) {
      deleteTask(task.id);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(task);
  };

  const handleViewClick = (e) => {
    if (e.target.closest('button')) return;
    if (onView) onView(task);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleViewClick}
      className={`
        bg-white rounded-lg shadow-md border-l-4 p-4 cursor-pointer 
        hover:shadow-lg transition-all duration-200
        ${isDragging ? 'shadow-xl ring-2 ring-blue-400' : 'hover:scale-[1.02]'}
        ${task.priority === 'high' ? 'border-l-red-500' : ''}
        ${task.priority === 'medium' ? 'border-l-yellow-500' : ''}
        ${task.priority === 'low' ? 'border-l-green-500' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800 text-sm flex-1 pr-2 line-clamp-2">
          {task.title}
        </h3>

        <div className="flex gap-2">
          <button
            onClick={handleEditClick}
            className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
            type="button"
            aria-label="Edit task"
            >
            <svg 
              className="w-3.5 h-3.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
              />
            </svg>
          </button>

          <button
            onClick={handleDeleteClick}
            className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
            type="button"
            aria-label="Delete task">
            
            <svg 
              className="w-3.5 h-3.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
              />
            </svg>
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-500 text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {task.priority && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
            {task.priority.toUpperCase()}
          </span>
        )}

        {task.tags?.slice(0, 2).map((tag, idx) => (
          <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            #{tag}
          </span>
        ))}

        {task.deadline && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">
            {formatDate(task.deadline)}
          </span>
        )}
      </div>

      <div
        {...attributes}
        {...listeners}
        className="mt-3 pt-2 border-t text-xs text-gray-400 flex justify-end cursor-grab active:cursor-grabbing"
      >
        ☰ drag
      </div>
    </div>
  );
};

export default TaskCard;