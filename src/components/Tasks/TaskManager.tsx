import React, { memo } from 'react';
import { User } from '../../types';
import { useTasks } from '../../hooks/useTasks';
import TaskInput from './TaskInput';
import TaskList from './TaskList';

interface TaskManagerProps {
  user: User;
}

const TaskManager: React.FC<TaskManagerProps> = memo(({ user }) => {
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks(user.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TaskInput onCreateTask={createTask} userId={user.id} />
      <TaskList
        tasks={tasks}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
      />
    </div>
  );
});

TaskManager.displayName = 'TaskManager';

export default TaskManager;