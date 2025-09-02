import React, { useState } from 'react';
import { Plus, Sparkles, Calendar, Tag, AlertCircle } from 'lucide-react';
import { Task } from '../../types';
import { aiService } from '../../services/aiService';
import { taskService } from '../../services/taskService';

interface TaskInputProps {
  onCreateTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  userId: string;
}

const TaskInput: React.FC<TaskInputProps> = ({ onCreateTask, userId }) => {
  const [input, setInput] = useState('');
  const [isAIMode, setIsAIMode] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualTask, setManualTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    category: 'Personal',
    dueDate: ''
  });

  const handleAISubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    try {
      const parsed = await aiService.parseNaturalLanguageTask(input);
      
      await onCreateTask({
        title: parsed.title,
        description: parsed.description,
        completed: false,
        priority: parsed.priority,
        category: parsed.category,
        dueDate: parsed.dueDate,
        userId
      });

      setInput('');
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTask.title.trim()) return;

    await onCreateTask({
      title: manualTask.title,
      description: manualTask.description || undefined,
      completed: false,
      priority: manualTask.priority,
      category: manualTask.category,
      dueDate: manualTask.dueDate ? new Date(manualTask.dueDate) : undefined,
      userId
    });

    setManualTask({
      title: '',
      description: '',
      priority: 'medium',
      category: 'Personal',
      dueDate: ''
    });
    setShowManualForm(false);
  };

  if (showManualForm) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Create Task</h3>
          <button
            onClick={() => setShowManualForm(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={manualTask.title}
              onChange={(e) => setManualTask(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What needs to be done?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={manualTask.description}
              onChange={(e) => setManualTask(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add more details..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={manualTask.priority}
                onChange={(e) => setManualTask(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={manualTask.category}
                onChange={(e) => setManualTask(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Study">Study</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date (Optional)
            </label>
            <input
              type="datetime-local"
              value={manualTask.dueDate}
              onChange={(e) => setManualTask(prev => ({ ...prev, dueDate: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create Task
            </button>
            <button
              type="button"
              onClick={() => setShowManualForm(false)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Task</h2>
      


      <form onSubmit={handleAISubmit}>
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            placeholder={
              isAIMode 
                ? "Try: 'Finish project report by Friday 3pm' or 'Study for math exam tomorrow'"
                : "What needs to be done?"
            }
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>

      {isAIMode && (
        <div className="mt-3 flex items-start space-x-2 text-sm text-gray-600">
          <AlertCircle className="w-4 h-4 mt-0.5 text-blue-500" />
          <p>
            AI will automatically detect priority, category, and due dates from your natural language input.
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskInput;