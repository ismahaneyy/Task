import React, { useState, memo, useCallback, useMemo } from 'react';
import { Check, Calendar, Tag, AlertTriangle, Edit2, Trash2, Clock } from 'lucide-react';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = memo(({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const priorityColors = useMemo(() => ({
    low: 'bg-gray-100 text-gray-700 border-gray-200',
    medium: 'bg-blue-100 text-blue-700 border-blue-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    urgent: 'bg-red-100 text-red-700 border-red-200'
  }), []);

  const categoryColors = useMemo(() => ({
    Work: 'bg-purple-100 text-purple-700',
    Study: 'bg-green-100 text-green-700',
    Personal: 'bg-indigo-100 text-indigo-700'
  }), []);

  const isOverdue = useMemo(() => 
    task.dueDate && new Date(task.dueDate) < new Date() && !task.completed, 
    [task.dueDate, task.completed]
  );
  
  const isDueSoon = useMemo(() => 
    task.dueDate && !task.completed && 
    new Date(task.dueDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000,
    [task.dueDate, task.completed]
  );

  const formatDueDate = useCallback((date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `In ${diffDays} days`;
  }, []);

  const handleToggleComplete = useCallback(() => {
    onUpdate(task.id, { completed: !task.completed });
  }, [task.id, task.completed, onUpdate]);

  const handleSaveEdit = useCallback(() => {
    if (editTitle.trim()) {
      onUpdate(task.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  }, [editTitle, task.id, onUpdate]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  }, [handleSaveEdit, task.title]);

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleDeleteClick = useCallback(() => {
    onDelete(task.id);
  }, [task.id, onDelete]);

  return (
    <div className={`bg-white rounded-xl border transition-all duration-200 hover:shadow-md ${
      task.completed ? 'opacity-75' : ''
    } ${isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <button
              onClick={handleToggleComplete}
              className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                task.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-blue-500'
              }`}
            >
              {task.completed && <Check className="w-4 h-4" />}
            </button>

            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={handleSaveEdit}
                  onKeyDown={handleKeyPress}
                  className="w-full text-lg font-medium text-gray-900 bg-transparent border-none outline-none focus:ring-0"
                  autoFocus
                />
              ) : (
                <h3
                  onClick={handleEditClick}
                  className={`text-lg font-medium cursor-pointer hover:text-blue-600 transition-colors ${
                    task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}
                >
                  {task.title}
                </h3>
              )}

              {task.description && (
                <p className="text-gray-600 mt-1">{task.description}</p>
              )}

              <div className="flex items-center space-x-4 mt-3">
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[task.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-700'}`}>
                  <Tag className="w-3 h-3 inline mr-1" />
                  {task.category}
                </div>

                {task.dueDate && (
                  <div className={`flex items-center space-x-1 text-xs ${
                    isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : 'text-gray-600'
                  }`}>
                    {isOverdue ? (
                      <AlertTriangle className="w-3 h-3" />
                    ) : (
                      <Calendar className="w-3 h-3" />
                    )}
                    <span>{formatDueDate(new Date(task.dueDate))}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={handleEditClick}
              className="p-2 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
              title="Edit task"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';

export default TaskCard;