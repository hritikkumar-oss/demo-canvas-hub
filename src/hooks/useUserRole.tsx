import { useState, useEffect } from 'react';

export type UserRole = 'admin' | 'viewer';

// Mock role check with dev toggle functionality
export const useUserRole = (): { 
  role: UserRole; 
  isAdmin: boolean; 
  toggleRole: () => void;
} => {
  const [role, setRole] = useState<UserRole>(() => {
    // Check localStorage for persisted role, default to admin
    const savedRole = localStorage.getItem('userRole') as UserRole;
    return savedRole || 'admin';
  });

  useEffect(() => {
    // Persist role to localStorage
    localStorage.setItem('userRole', role);
  }, [role]);

  const toggleRole = () => {
    setRole(prevRole => prevRole === 'admin' ? 'viewer' : 'admin');
  };

  return {
    role,
    isAdmin: role === 'admin',
    toggleRole
  };
};