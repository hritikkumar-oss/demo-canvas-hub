import { useState, useEffect } from 'react';

export type UserRole = 'admin' | 'viewer';

// Mock role check - replace with actual auth logic
export const useUserRole = (): { role: UserRole; isAdmin: boolean } => {
  const [role, setRole] = useState<UserRole>('admin'); // Default to admin for demo

  useEffect(() => {
    // Mock logic - in real app, this would check auth state
    // For demo purposes, defaulting to admin to show all features
    setRole('admin');
  }, []);

  return {
    role,
    isAdmin: role === 'admin'
  };
};