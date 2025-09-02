import { Task, ProductivityMetrics, TaskStats } from '../types';

class AnalyticsService {
  calculateProductivityMetrics(tasks: Task[]): ProductivityMetrics {
    const completedTasks = tasks.filter(task => task.completed);
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

    // Calculate streak
    const currentStreak = this.calculateCurrentStreak(tasks);
    const longestStreak = this.calculateLongestStreak(tasks);

    // Tasks completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tasksCompletedToday = completedTasks.filter(task => {
      const taskDate = new Date(task.updatedAt);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    }).length;

    // Average tasks per day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentTasks = tasks.filter(task => new Date(task.createdAt) >= thirtyDaysAgo);
    const averageTasksPerDay = recentTasks.length / 30;

    // Productivity score (0-100)
    const productivityScore = Math.min(100, 
      (completionRate * 0.4) + 
      (Math.min(currentStreak * 5, 30)) + 
      (Math.min(tasksCompletedToday * 10, 30))
    );

    return {
      totalTasks,
      completedTasks: completedTasks.length,
      completionRate,
      currentStreak,
      longestStreak,
      tasksCompletedToday,
      averageTasksPerDay,
      productivityScore
    };
  }

  getTaskStats(tasks: Task[], days: number = 7): TaskStats[] {
    const stats: TaskStats[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate >= date && taskDate < nextDay;
      });

      const completedToday = tasks.filter(task => {
        if (!task.completed) return false;
        const completedDate = new Date(task.updatedAt);
        return completedDate >= date && completedDate < nextDay;
      });

      stats.push({
        date: date.toISOString().split('T')[0],
        created: dayTasks.length,
        completed: completedToday.length
      });
    }

    return stats;
  }

  private calculateCurrentStreak(tasks: Task[]): number {
    const completedDates = new Set<string>(
      tasks
      .filter(task => task.completed)
        .map(task => {
          const d = new Date(task.updatedAt);
          d.setHours(0, 0, 0, 0);
          return d.toISOString().split('T')[0];
        })
    );

    if (completedDates.size === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const toDateStr = (d: Date) => d.toISOString().split('T')[0];

    // Current streak should include today. If no completion today, streak is 0.
    if (!completedDates.has(toDateStr(today))) {
      return 0;
    }

    let streak = 0;
    const cursor = new Date(today);
    while (true) {
      const key = toDateStr(cursor);
      if (completedDates.has(key)) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
      // Safety cap to avoid infinite loops in extreme cases
      if (streak > 3650) break; // ~10 years
    }

    return streak;
  }

  private calculateLongestStreak(tasks: Task[]): number {
    const completedDays: number[] = Array.from(
      new Set(
        tasks
          .filter(task => task.completed)
          .map(task => {
            const d = new Date(task.updatedAt);
            d.setHours(0, 0, 0, 0);
            return Math.floor(d.getTime() / 86400000); // days since epoch
          })
      )
    ).sort((a, b) => a - b);

    if (completedDays.length === 0) return 0;

    let longest = 1;
    let current = 1;

    for (let i = 1; i < completedDays.length; i++) {
      if (completedDays[i] === completedDays[i - 1] + 1) {
        current++;
      } else {
        if (current > longest) longest = current;
        current = 1;
      }
    }

    if (current > longest) longest = current;
    return longest;
  }
}

export const analyticsService = new AnalyticsService();