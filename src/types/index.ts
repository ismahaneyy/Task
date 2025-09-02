export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface AIInsight {
  id: string;
  type: 'suggestion' | 'pattern' | 'motivation' | 'productivity';
  message: string;
  createdAt: Date;
}

export interface ProductivityMetrics {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  tasksCompletedToday: number;
  averageTasksPerDay: number;
  productivityScore: number;
}

export interface TaskStats {
  date: string;
  completed: number;
  created: number;
}