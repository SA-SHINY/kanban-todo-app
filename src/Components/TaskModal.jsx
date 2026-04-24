import React, { useState } from 'react';
import { InlineEdit, Stack } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';  

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

const TaskModal = ({ task, onClose, onEdit, isEditMode = false }) => {
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    tags: task.tags || [],
    deadline: task.deadline
  });
  const [tagInput, setTagInput] = useState('');

  const handleSave = () => {
    onEdit(task.id, editData);
    setIsEditing(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !editData.tags.includes(tagInput.trim())) {
      setEditData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setEditData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? '✏️ Edit Task' : 'Task Details'}
          </h2>
          <div className="flex gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-700 transition-colors p-1"
                title="Edit task"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                  />
                </svg>
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {isEditing ? (
            <Stack direction="column" spacing={16} alignItems="stretch" className="w-full">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <InlineEdit
                  size="lg"
                  value={editData.title}
                  onChange={(value) => setEditData(prev => ({ ...prev, title: value }))}
                  placeholder="Enter task title"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <InlineEdit
                  size="lg"
                  value={editData.description}
                  onChange={(value) => setEditData(prev => ({ ...prev, description: value }))}
                  placeholder="Enter task description"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                <select
                  value={editData.priority}
                  onChange={(e) => setEditData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editData.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Deadline</label>
                <input
                  type="date"
                  value={editData.deadline}
                  onChange={(e) => setEditData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </Stack>
          ) : (
            <div className="space-y-4">
              <div className="border-b pb-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</h3>
                <p className="text-gray-900 mt-1 text-lg font-semibold">{task.title}</p>
              </div>

              <div className="border-b pb-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</h3>
                <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                  {task.description || 'No description provided'}
                </p>
              </div>

              <div className="border-b pb-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</h3>
                <span className={`inline-flex items-center gap-1 mt-1 text-sm px-3 py-1 rounded-full ${priorityColors[task.priority]}`}>
                  {task.priority === 'high' && '🔴'}
                  {task.priority === 'medium' && '🟡'}
                  {task.priority === 'low' && '🟢'}
                  {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)}
                </span>
              </div>

              {task.tags && task.tags.length > 0 && (
                <div className="border-b pb-3">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {task.tags.map((tag, idx) => (
                      <span key={idx} className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {task.deadline && (
                <div className="border-b pb-3">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Deadline</h3>
                  <p className="text-gray-900 mt-1">{new Date(task.deadline).toLocaleDateString()}</p>
                </div>
              )}

              <div className="border-b pb-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</h3>
                <p className="text-gray-900 mt-1 capitalize">
                  {task.status === 'todo' ? 'To Do' : task.status === 'inProgress' ? 'In Progress' : 'Done'}
                </p>
              </div>

              <div className="border-b pb-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</h3>
                <p className="text-gray-600 mt-1 text-sm">{new Date(task.createdAt).toLocaleString()}</p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Updated</h3>
                <p className="text-gray-600 mt-1 text-sm">{new Date(task.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;