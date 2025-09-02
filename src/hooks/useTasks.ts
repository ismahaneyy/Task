import { useState, useEffect, useCallback } from 'react';
import { Task } from '../types';
import { taskService } from '../services/taskService';

export const useTasks = (userId: string | null) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false); // Start as false, only true when actually loading

  const fetchTasks = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const fetchedTasks = await taskService.getTasks(userId);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Set up real-time subscription
  useEffect(() => {
    if (!userId) return;

    console.log('🔌 Setting up real-time subscription in useTasks for user:', userId);
    
    const subscription = taskService.subscribeToTasks(userId, (updatedTasks) => {
      console.log('🔄 useTasks received real-time update:', updatedTasks.length, 'tasks');
      setTasks(updatedTasks);
    });

    return () => {
      console.log('🔌 Cleaning up subscription for user:', userId);
      subscription.unsubscribe();
    };
  }, [userId]);

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('🚀 Creating task in useTasks:', taskData);
      const newTask = await taskService.createTask(taskData);
      console.log('✅ Task created successfully in useTasks:', newTask);
      
      // Optimistically update the UI immediately
      setTasks(prev => [newTask, ...prev]);
      
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      console.log('🔄 Updating task in useTasks:', taskId, updates);
      const updatedTask = await taskService.updateTask(taskId, updates);
      console.log('✅ Task updated successfully in useTasks:', updatedTask);
      
      // Optimistically update the UI immediately
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      console.log('🗑️ Deleting task in useTasks:', taskId);
      await taskService.deleteTask(taskId);
      console.log('✅ Task deleted successfully in useTasks');
      
      // Optimistically update the UI immediately
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks: fetchTasks
  };
};