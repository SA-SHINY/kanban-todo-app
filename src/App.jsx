import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useTasks } from './contexts/TaskContext';
import TaskCard from './Components/TaskCard';
import EditTaskForm from './Components/EditTaskForm';
import TaskModal from './Components/TaskModal';
import TaskForm from './Components/TaskForm';
import Column from './Components/Column';

function App() {
  const {
    tasks,
    getTasksByStatus,
    addTask,
    updateTask,
    moveTask,
  } = useTasks();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [activeId, setActiveId] = useState(null);

  
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    console.log('Drag started:', event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    console.log('Drag ended - Active:', active?.id, 'Over:', over?.id);

    if (!over) {
      console.log('No drop target');
      return;
    }

    const activeTask = tasks.find(task => task.id === active.id);
    if (!activeTask) {
      console.log('Active task not found');
      return;
    }

    const destinationColumn = over.id;
    const validColumns = ['todo', 'inProgress', 'done'];

    console.log('Active task status:', activeTask.status);
    console.log('Destination column:', destinationColumn);

    if (validColumns.includes(destinationColumn) && 
        activeTask.status !== destinationColumn) {
      console.log(`Moving task from ${activeTask.status} to ${destinationColumn}`);
      moveTask(active.id, destinationColumn);
    } else {
      console.log('Same column or invalid drop target');
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    console.log('Drag cancelled');
  };

  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;
  
  const handleEditTask = (taskToEdit) => {
    console.log('Opening edit form for:', taskToEdit);
    setEditingTask(taskToEdit);
    setShowEditForm(true);
  };

  const handleCreateTask = () => {
    console.log('Opening create form');
    setShowCreateForm(true);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-500 to-gray-200">
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">TaskFlow Kanban App</h1>
              </div>
              <button
                onClick={handleCreateTask}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Task
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <Column
              id="todo"
              title="TO DO"
              tasks={getTasksByStatus('todo')}
              count={getTasksByStatus('todo').length}
            >
              <SortableContext
                items={getTasksByStatus('todo').map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 min-h-[400px]">
                  {getTasksByStatus('todo').map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onView={setViewingTask}
                    />
                  ))}
                </div>
              </SortableContext>
            </Column>

            <Column
              id="inProgress"
              title="IN PROGRESS"
              tasks={getTasksByStatus('inProgress')}
              count={getTasksByStatus('inProgress').length}
            >
              <SortableContext
                items={getTasksByStatus('inProgress').map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 min-h-[400px]">
                  {getTasksByStatus('inProgress').map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onView={setViewingTask}
                    />
                  ))}
                </div>
              </SortableContext>
            </Column>
            <Column
              id="done"
              title="DONE"
              tasks={getTasksByStatus('done')}
              count={getTasksByStatus('done').length}
            >
              <SortableContext
                items={getTasksByStatus('done').map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 min-h-[400px]">
                  {getTasksByStatus('done').map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onView={setViewingTask}
                    />
                  ))}
                </div>
              </SortableContext>
            </Column>
          </div>
        </div>

        <DragOverlay
          dropAnimation={{
            duration: 200,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          }}
        >
          {activeTask ? (
            <div className="transform rotate-3 scale-105 opacity-90 shadow-2xl">
              <TaskCard
                task={activeTask}
                onEdit={() => {}}
                onView={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>

        {showCreateForm && (
          <TaskForm
            initialData={null}
            onSubmit={(taskData) => {
              console.log("Creating task:", taskData);
              addTask(taskData);
              setShowCreateForm(false);
            }}
            onClose={() => setShowCreateForm(false)}
          />
        )}

        {showEditForm && editingTask && (
          <EditTaskForm
            task={editingTask}
            onUpdate={(taskId, updatedData) => {
              console.log("Updating task:", taskId, updatedData);
              updateTask(taskId, updatedData);
              setShowEditForm(false);
              setEditingTask(null);
            }}
            onClose={() => {
              setShowEditForm(false);
              setEditingTask(null);
            }}
          />
        )}

        {viewingTask && (
          <TaskModal
            task={viewingTask}
            onClose={() => setViewingTask(null)}
            onEdit={(taskId, updatedData) => {
              updateTask(taskId, updatedData);
              setViewingTask(null);
            }}
          />
        )}
      </div>
    </DndContext>
  );
}

export default App;
