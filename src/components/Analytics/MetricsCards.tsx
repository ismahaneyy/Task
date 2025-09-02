import React from 'react';
import { TrendingUp, Target, Zap, Calendar } from 'lucide-react';
import { ProductivityMetrics } from '../../types';

interface MetricsCardsProps {
  metrics: ProductivityMetrics;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'Completion Rate',
      value: `${metrics.completionRate.toFixed(1)}%`,
      icon: Target,
      color: 'blue',
      description: 'Overall task completion'
    },
    {
      title: 'Current Streak',
      value: `${metrics.currentStreak} days`,
      icon: Zap,
      color: 'green',
      description: 'Consecutive productive days'
    },
    {
      title: 'Productivity Score',
      value: `${metrics.productivityScore.toFixed(0)}/100`,
      icon: TrendingUp,
      color: 'purple',
      description: 'AI-calculated performance'
    },
    {
      title: 'Tasks Today',
      value: `${metrics.tasksCompletedToday}`,
      icon: Calendar,
      color: 'orange',
      description: 'Completed today'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[card.color as keyof typeof colorClasses]}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
              <p className="text-xs text-gray-500">{card.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsCards;