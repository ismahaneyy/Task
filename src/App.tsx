import { useState, useMemo } from 'react';
import { useAuth } from './hooks/useAuth';
import AuthForm from './components/Auth/AuthForm';
import Header from './components/Layout/Header';
import TaskManager from './components/Tasks/TaskManager';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import { useTasks } from './hooks/useTasks';

function App() {
  const { user, loading: authLoading, signUp, signIn, signOut } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [authIsLoading, setAuthIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'analytics'>('tasks');
  
  // Get tasks for analytics when user is authenticated
  const { tasks, loading: tasksLoading } = useTasks(user?.id || null);

  // Memoize loading states to prevent unnecessary re-renders
  // Only consider tasks loading if user is authenticated
  const isLoading = useMemo(() => authLoading || (user && tasksLoading), [authLoading, user, tasksLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading TaskFlow AI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    const handleAuthSubmit = async (email: string, password: string, name?: string) => {
      setAuthIsLoading(true);
      try {
        if (isLogin) {
          await signIn(email, password);
        } else {
          if (!name) throw new Error('Name is required for signup');
          await signUp(email, password, name);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        // You could add error state handling here
      } finally {
        setAuthIsLoading(false);
      }
    };

    return (
      <AuthForm
        isLogin={isLogin}
        onSubmit={handleAuthSubmit}
        onToggleMode={() => setIsLogin(!isLogin)}
        isLoading={authIsLoading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        onSignOut={signOut}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'tasks' ? (
          <TaskManager user={user} />
        ) : (
          <AnalyticsDashboard tasks={tasks} />
        )}
      </main>
    </div>
  );
}

export default App;