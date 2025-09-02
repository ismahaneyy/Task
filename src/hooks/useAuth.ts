import { useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      console.log('🔐 Auth state changed:', user ? 'User logged in' : 'No user');
      setUser(user);
      setLoading(false);
    });

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.error('⚠️ Auth loading timeout - forcing loading to false');
      setLoading(false);
    }, 10000); // 10 second timeout

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    return authService.signUp(email, password, name);
  };

  const signIn = async (email: string, password: string) => {
    return authService.signIn(email, password);
  };

  const signOut = async () => {
    await authService.signOut();
    // Clear local user state immediately for faster logout
    setUser(null);
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut
  };
};