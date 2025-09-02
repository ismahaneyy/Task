import React, { useMemo } from 'react';
import { Task, ProductivityMetrics } from '../../types';
import { analyticsService } from '../../services/analyticsService';
import ProductivityChart from './ProductivityChart';
import MetricsCards from './MetricsCards';
import StreakTracker from './StreakTracker';

interface AnalyticsDashboardProps {
  tasks: Task[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ tasks }) => {
  const metrics = useMemo(() => {
    return analyticsService.calculateProductivityMetrics(tasks);
  }, [tasks]);

  const taskStats = useMemo(() => {
    return analyticsService.getTaskStats(tasks, 14); // Last 14 days
  }, [tasks]);

  const categoryBreakdown = useMemo(() => {
    const breakdown: Record<string, { total: number; completed: number }> = {};
    
    tasks.forEach(task => {
      if (!breakdown[task.category]) {
        breakdown[task.category] = { total: 0, completed: 0 };
      }
      breakdown[task.category].total++;
      if (task.completed) {
        breakdown[task.category].completed++;
      }
    });

    return Object.entries(breakdown).map(([category, data]) => ({
      category,
      total: data.total,
      completed: data.completed,
      percentage: data.total > 0 ? (data.completed / data.total) * 100 : 0
    }));
  }, [tasks]);

  const priorityBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = { low: 0, medium: 0, high: 0, urgent: 0 };
    tasks.forEach(task => {
      if (!task.completed) {
        breakdown[task.priority]++;
      }
    });
    return breakdown;
  }, [tasks]);

  return (
    <div className="space-y-8">
      {/* Metrics Overview */}
      <MetricsCards metrics={metrics} />

      {/* Streak Tracker */}
      <StreakTracker currentStreak={metrics.currentStreak} longestStreak={metrics.longestStreak} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Productivity Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Productivity Trend</h3>
          <ProductivityChart data={taskStats} />
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Performance</h3>
          <div className="space-y-4">
            {categoryBreakdown.map(({ category, total, completed, percentage }) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{category}</span>
                  <span className="text-sm text-gray-600">{completed}/{total} ({percentage.toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Pending Tasks by Priority</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(priorityBreakdown).map(([priority, count]) => {
            const colors = {
              low: 'bg-gray-100 text-gray-700',
              medium: 'bg-blue-100 text-blue-700',
              high: 'bg-orange-100 text-orange-700',
              urgent: 'bg-red-100 text-red-700'
            };

            return (
              <div key={priority} className={`rounded-lg p-4 ${colors[priority as keyof typeof colors]}`}>
                <div className="text-center">
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm font-medium capitalize">{priority}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">AI Productivity Insights</h3>
          <div className="text-sm text-gray-600">
            Based on your task patterns and completion history
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Productivity Patterns</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-700">Best completion rate</span>
                <span className="font-medium text-blue-700">Weekdays</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">Most productive time</span>
                <span className="font-medium text-green-700">Morning</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-gray-700">Preferred category</span>
                <span className="font-medium text-purple-700">
                  {categoryBreakdown.length > 0 ? categoryBreakdown[0].category : 'Work'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Recommendations</h4>
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  💡 Try setting smaller, more achievable daily goals to maintain your streak
                </p>
              </div>
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                <p className="text-sm text-indigo-800">
                  🎯 Focus on high-priority tasks in the morning when you're most productive
                </p>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-sm text-emerald-800">
                  ⚡ Break large tasks into smaller subtasks for better completion rates
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;