import { Task } from '../types';
import { supabase } from '../lib/supabase';

class TaskService {
  async getTasks(userId: string): Promise<Task[]> {
    console.log('🔍 Fetching tasks for user:', userId);
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('userid', userId)  // Changed to userid
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching tasks:', error);
      return [];
    }

    console.log('✅ Tasks fetched successfully:', data?.length || 0, 'tasks');
    return data.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      priority: task.priority,
      category: task.category,
      dueDate: task.due_date ? new Date(task.due_date) : undefined,
      createdAt: new Date(task.created_at),
      updatedAt: new Date(task.updated_at),
      userId: task.userid  // Changed to userid
    }));
  }

  async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    console.log('🚀 Creating task with data:', taskData);
    
    const insertData = {
      title: taskData.title,
      description: taskData.description,
      completed: taskData.completed,
      priority: taskData.priority,
      category: taskData.category,
      due_date: taskData.dueDate?.toISOString() || null,
      userid: taskData.userId  // Changed to userid
    };
    
    console.log('📝 Inserting into database:', insertData);

    const { data, error } = await supabase
      .from('tasks')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating task:', error);
      console.error('❌ Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(`Failed to create task: ${error.message}`);
    }

    console.log('✅ Task created successfully:', data);
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      completed: data.completed,
      priority: data.priority,
      category: data.category,
      dueDate: data.due_date ? new Date(data.due_date) : undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      userId: data.userid  // Fixed to match DB schema
    };
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    const updateData: any = {};
    
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.completed !== undefined) updateData.completed = updates.completed;
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate?.toISOString() || null;
    
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      completed: data.completed,
      priority: data.priority,
      category: data.category,
      dueDate: data.due_date ? new Date(data.due_date) : undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      userId: data.userid
    };
  }

  async deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      throw new Error(`Failed to delete task: ${error.message}`);
    }
  }

  async getTasksByCategory(userId: string, category: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('userid', userId)  // Changed to userid
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks by category:', error);
      return [];
    }

    return data.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      priority: task.priority,
      category: task.category,
      dueDate: task.due_date ? new Date(task.due_date) : undefined,
      createdAt: new Date(task.created_at),
      updatedAt: new Date(task.updated_at),
      userId: task.userid  // Changed to userid
    }));
  }

  async getOverdueTasks(userId: string): Promise<Task[]> {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('userid', userId)  // Changed to userid
      .lt('due_date', now)
      .eq('completed', false)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching overdue tasks:', error);
      return [];
    }

    return data.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      priority: task.priority,
      category: task.category,
      dueDate: task.due_date ? new Date(task.due_date) : undefined,
      createdAt: new Date(task.created_at),
      updatedAt: new Date(task.updated_at),
      userId: task.userid  // Changed to userid
    }));
  }



  // Real-time subscription for tasks
  subscribeToTasks(userId: string, callback: (tasks: Task[]) => void) {
    console.log('🔌 Setting up real-time subscription for user:', userId);
    
    const channel = supabase
      .channel(`tasks:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `userid=eq.${userId}`
        },
        async (payload) => {
          console.log('📡 Real-time update received:', payload);
          // Fetch updated tasks when changes occur
          const tasks = await this.getTasks(userId);
          console.log('🔄 Calling callback with updated tasks:', tasks.length);
          callback(tasks);
        }
      )
      .subscribe((status) => {
        console.log('🔌 Subscription status:', status);
      });

    return channel;
  }
}

export const taskService = new TaskService();