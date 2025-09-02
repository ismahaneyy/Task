import { Task, AIInsight } from '../types';

interface ParsedTask {
  title: string;
  description?: string;
  priority: Task['priority'];
  category: string;
  dueDate?: Date;
}

class AIService {
  async parseNaturalLanguageTask(input: string): Promise<ParsedTask> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 800));

    const words = input.toLowerCase();
    
    // Extract title (main content)
    let title = input;
    
    // Extract due date
    let dueDate: Date | undefined;
    const timePatterns = [
      { pattern: /tomorrow/i, hours: 24 },
      { pattern: /today/i, hours: 0 },
      { pattern: /next week/i, hours: 168 },
      { pattern: /(\d{1,2})(am|pm)/i, hours: 0 } // same day with time
    ];

    for (const { pattern, hours } of timePatterns) {
      if (pattern.test(words)) {
        dueDate = new Date();
        dueDate.setHours(dueDate.getHours() + hours);
        
        // Extract specific time if mentioned
        const timeMatch = words.match(/(\d{1,2})(am|pm)/i);
        if (timeMatch) {
          let hour = parseInt(timeMatch[1]);
          if (timeMatch[2] === 'pm' && hour !== 12) hour += 12;
          if (timeMatch[2] === 'am' && hour === 12) hour = 0;
          dueDate.setHours(hour, 0, 0, 0);
        }
        break;
      }
    }

    // Determine priority based on keywords
    let priority: Task['priority'] = 'medium';
    if (/urgent|asap|emergency|critical/i.test(words)) {
      priority = 'urgent';
    } else if (/important|high|priority/i.test(words)) {
      priority = 'high';
    } else if (/low|minor|when possible/i.test(words)) {
      priority = 'low';
    }

    // Determine category
    let category = 'Personal';
    if (/work|meeting|project|client|deadline/i.test(words)) {
      category = 'Work';
    } else if (/study|learn|read|exam|assignment|notes/i.test(words)) {
      category = 'Study';
    } else if (/home|family|personal|buy|shop/i.test(words)) {
      category = 'Personal';
    }

    // Clean up title by removing time-related words
    title = title.replace(/(tomorrow|today|next week|\d{1,2}(am|pm))/gi, '').trim();
    
    return {
      title: title || 'New Task',
      priority,
      category,
      dueDate
    };
  }

  async generateSuggestions(tasks: Task[]): Promise<AIInsight[]> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const insights: AIInsight[] = [];
    const now = new Date();
    
    // Check for overdue tasks
    const overdueTasks = tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < now && !task.completed
    );
    
    if (overdueTasks.length > 0) {
      insights.push({
        id: `insight_${Date.now()}`,
        type: 'suggestion',
        message: `You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}. Consider prioritizing: "${overdueTasks[0].title}"`,
        createdAt: new Date()
      });
    }

    // Check for upcoming deadlines
    const upcomingTasks = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      const timeDiff = new Date(task.dueDate).getTime() - now.getTime();
      return timeDiff > 0 && timeDiff <= 24 * 60 * 60 * 1000; // Next 24 hours
    });

    if (upcomingTasks.length > 0) {
      insights.push({
        id: `insight_${Date.now()}_1`,
        type: 'suggestion',
        message: `You have ${upcomingTasks.length} task${upcomingTasks.length > 1 ? 's' : ''} due tomorrow. Plan your time accordingly!`,
        createdAt: new Date()
      });
    }

    // Productivity pattern analysis
    const completedTasks = tasks.filter(task => task.completed);
    const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

    if (completionRate > 80) {
      insights.push({
        id: `insight_${Date.now()}_2`,
        type: 'motivation',
        message: `Excellent work! You've completed ${completionRate.toFixed(0)}% of your tasks. You're on fire! 🔥`,
        createdAt: new Date()
      });
    } else if (completionRate < 50) {
      insights.push({
        id: `insight_${Date.now()}_3`,
        type: 'productivity',
        message: `Your completion rate is ${completionRate.toFixed(0)}%. Try breaking large tasks into smaller, manageable chunks.`,
        createdAt: new Date()
      });
    }

    return insights;
  }

  async sortTasksByPriority(tasks: Task[]): Promise<Task[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    return [...tasks].sort((a, b) => {
      // Priority weights
      const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
      
      // Due date weight (sooner = higher priority)
      const getDueDateWeight = (task: Task) => {
        if (!task.dueDate) return 0;
        const now = new Date().getTime();
        const dueTime = new Date(task.dueDate).getTime();
        const timeDiff = dueTime - now;
        
        if (timeDiff < 0) return 10; // Overdue
        if (timeDiff < 24 * 60 * 60 * 1000) return 8; // Due today
        if (timeDiff < 3 * 24 * 60 * 60 * 1000) return 6; // Due in 3 days
        if (timeDiff < 7 * 24 * 60 * 60 * 1000) return 4; // Due this week
        return 2; // Due later
      };

      const aScore = priorityWeight[a.priority] + getDueDateWeight(a);
      const bScore = priorityWeight[b.priority] + getDueDateWeight(b);
      
      return bScore - aScore;
    });
  }
}

export const aiService = new AIService();