import React from 'react';
import { LogOut, Brain, BarChart3 } from 'lucide-react';
import { User } from '../../types';

interface HeaderProps {
  user: User;
  onSignOut: () => void;
  activeTab: 'tasks' | 'analytics';
  onTabChange: (tab: 'tasks' | 'analytics') => void;
}

const Header: React.FC<HeaderProps> = ({ user, onSignOut, activeTab, onTabChange }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">TaskFlow AI</h1>
            <p className="text-sm text-gray-600">Intelligent Task Management</p>
          </div>
        </div>

        <nav className="flex items-center space-x-1">
          <button
            onClick={() => onTabChange('tasks')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'tasks'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => onTabChange('analytics')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              activeTab === 'analytics'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-600">{user.email}</p>
          </div>
          <button
            onClick={onSignOut}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;