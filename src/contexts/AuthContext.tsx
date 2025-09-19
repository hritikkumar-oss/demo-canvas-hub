import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type AuthUser = User & {
  user_metadata?: {
    role?: 'admin' | 'viewer';
  };
};

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user as AuthUser || null;
      if (user) {
        // Check if user is the admin
        const isAdminUser = user.email === 'Business@salescode.ai';
        const updatedUser = {
          ...user,
          user_metadata: { ...user.user_metadata, role: isAdminUser ? 'admin' : 'viewer' }
        } as AuthUser;
        setUser(updatedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user as AuthUser || null;
      if (user) {
        // Check if user is the admin
        const isAdminUser = user.email === 'Business@salescode.ai';
        const updatedUser = {
          ...user,
          user_metadata: { ...user.user_metadata, role: isAdminUser ? 'admin' : 'viewer' }
        } as AuthUser;
        setUser(updatedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth`
      }
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
    }
  };

  const isAdmin = user?.user_metadata?.role === 'admin';

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};