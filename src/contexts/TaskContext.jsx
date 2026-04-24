import React, { createContext, useContext, useState, useEffect } from 'react';

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTasks = localStorage.getItem('kanban-tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
        setTasks([]);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
    }
  }, [tasks, loading]);

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      tags: taskData.tags || [],
      deadline: taskData.deadline || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
    return newTask;
  };

  const updateTask = (taskId, updatedData) => {
    setTasks(prevTasks => prevTasks.map(task =>
      task.id === taskId
        ? { ...task, ...updatedData, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  const deleteTask = (taskId) => {
    console.log('Deleting task with ID:', taskId);
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.filter(task => task.id !== taskId);
      console.log('Tasks remaining:', updatedTasks.length);
      return updatedTasks;
    });
  };

  const moveTask = (taskId, newStatus) => {
    setTasks(prevTasks => prevTasks.map(task =>
      task.id === taskId
        ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  const getTaskStats = () => {
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'inProgress').length,
      done: tasks.filter(t => t.status === 'done').length,
      highPriority: tasks.filter(t => t.priority === 'high').length,
      mediumPriority: tasks.filter(t => t.priority === 'medium').length,
      lowPriority: tasks.filter(t => t.priority === 'low').length
    };
  };

  const value = {
    tasks,
    loading,
    getTasksByStatus,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTaskStats
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};