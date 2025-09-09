import { useLocation } from 'react-router-dom';

export const useAdminMode = () => {
  const location = useLocation();
  
  // Check if current route is /admin or starts with /admin/
  const isAdminRoute = location.pathname === '/admin' || location.pathname.startsWith('/admin/');
  
  return {
    isAdminMode: isAdminRoute,
    isViewerMode: location.pathname === '/viewer' || location.pathname.startsWith('/viewer/')
  };
};