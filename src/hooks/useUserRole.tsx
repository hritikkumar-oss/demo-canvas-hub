import { useState, useEffect } from 'react';

export type UserRole = 'admin' | 'viewer';

// Mock role check - replace with actual auth logic
export const useUserRole = (): { role: UserRole; isAdmin: boolean; toggleRole: () => void } => {
  const [role, setRole] = useState<UserRole>(() => {
    // Check URL to determine initial role
    if (window.location.pathname.startsWith('/admin')) return 'admin';
    if (window.location.pathname.startsWith('/viewer')) return 'viewer';
    return 'admin'; // Default to admin for demo
  });

  useEffect(() => {
    // Update role based on current path
    if (window.location.pathname.startsWith('/admin')) {
      setRole('admin');
    } else if (window.location.pathname.startsWith('/viewer')) {
      setRole('viewer');
    }
  }, []);

  const toggleRole = () => {
    setRole(prev => prev === 'admin' ? 'viewer' : 'admin');
  };

  return {
    role,
    isAdmin: role === 'admin',
    toggleRole
  };
};