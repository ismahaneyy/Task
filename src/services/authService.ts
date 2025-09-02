import { User } from '../types';
import { supabase } from '../lib/supabase';

class AuthService {
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];
  private isInitialized = false;

  constructor() {
    // Set up auth state listener
    this.setupAuthListener();
  }

  private async setupAuthListener() {
    try {
      console.log('🔐 Setting up auth listener...');
      
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Error getting session:', error);
        this.notifyListeners();
        return;
      }
      
      if (session?.user) {
        console.log('👤 Found existing session for user:', session.user.email);
        await this.setCurrentUser(session.user);
      } else {
        console.log('👤 No existing session found');
      }
      
      // Mark as initialized and notify listeners
      this.isInitialized = true;
      this.notifyListeners();

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('🔄 Auth state change event:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          await this.setCurrentUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          this.currentUser = null;
          this.notifyListeners();
        }
      });
    } catch (error) {
      console.error('❌ Error in setupAuthListener:', error);
      this.isInitialized = true;
      this.notifyListeners();
    }
  }

  private async setCurrentUser(supabaseUser: any) {
    try {
      console.log('👤 Setting current user:', supabaseUser.email);
      
      // Get or create user profile
      let userProfile = await this.getUserProfile(supabaseUser.id);
      
      if (!userProfile) {
        console.log('📝 Creating new user profile...');
        // Create profile if it doesn't exist
        userProfile = await this.createUserProfile(supabaseUser);
      }

      this.currentUser = userProfile;
      this.notifyListeners();
    } catch (error) {
      console.error('❌ Error setting current user:', error);
      // Still notify listeners to prevent infinite loading
      this.notifyListeners();
    }
  }

  private async getUserProfile(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      createdAt: new Date(data.created_at)
    };
  }

  private async createUserProfile(supabaseUser: any): Promise<User> {
    const userProfile: User = {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      name: supabaseUser.user_metadata?.name || 'User',
      createdAt: new Date()
    };

    const { error } = await supabase
      .from('users')
      .insert({
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        created_at: userProfile.createdAt.toISOString()
      });

    if (error) {
      console.error('Error creating user profile:', error);
    }

    return userProfile;
  }

  async signUp(email: string, password: string, name: string): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Signup failed');
    }

    // User profile will be created in the auth listener
    return {
      id: data.user.id,
      email: data.user.email!,
      name: name,
      createdAt: new Date()
    };
  }

  async signIn(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Signin failed');
    }

    // User profile will be set in the auth listener
    return {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name || 'User',
      createdAt: new Date()
    };
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    this.listeners.push(callback);
    
    // Only call immediately if we're already initialized
    if (this.isInitialized) {
      callback(this.currentUser);
    }
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }
}

export const authService = new AuthService();