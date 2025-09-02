import React from 'react';
import { Flame, Trophy } from 'lucide-react';

interface StreakTrackerProps {
  currentStreak: number;
  longestStreak: number;
}

const StreakTracker: React.FC<StreakTrackerProps> = ({ currentStreak, longestStreak }) => {
  const motivationalMessage = () => {
    if (currentStreak === 0) {
      return "Start your productivity streak today! 💪";
    } else if (currentStreak < 3) {
      return `Great start! Keep going to build momentum! 🚀`;
    } else if (currentStreak < 7) {
      return `Excellent! You're building a strong habit! ⭐`;
    } else if (currentStreak < 14) {
      return `Amazing consistency! You're on fire! 🔥`;
    } else {
      return `Incredible dedication! You're a productivity champion! 🏆`;
    }
  };

  const getStreakEmoji = (streak: number) => {
    if (streak === 0) return '🌱';
    if (streak < 3) return '🔥';
    if (streak < 7) return '💪';
    if (streak < 14) return '⚡';
    return '🏆';
  };

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Flame className="w-5 h-5 text-orange-600" />
          <span>Productivity Streak</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="text-6xl mb-4">{getStreakEmoji(currentStreak)}</div>
            <p className="text-4xl font-bold text-orange-600 mb-2">{currentStreak}</p>
            <p className="text-gray-600">Current Streak</p>
            <p className="text-sm text-gray-500 mt-2">
              {currentStreak === 1 ? 'day' : 'days'} of productivity
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center space-x-3">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-gray-700">Best Streak</span>
            </div>
            <span className="text-xl font-bold text-yellow-600">{longestStreak} days</span>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-gray-800 font-medium mb-2">🎯 Motivation</p>
            <p className="text-gray-600">{motivationalMessage()}</p>
          </div>

          {currentStreak > 0 && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-gray-800 font-medium mb-2">📊 Streak Insights</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Complete at least one task daily to maintain your streak</li>
                <li>• Your streak resets at midnight if no tasks are completed</li>
                <li>• Consistency is more important than quantity</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreakTracker;