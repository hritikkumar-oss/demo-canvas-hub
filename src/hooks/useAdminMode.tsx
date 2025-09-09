import { useLocation } from 'react-router-dom';

export const useAdminMode = () => {
  const location = useLocation();
  
  // Check if current route starts with /admin/
  const isAdminRoute = location.pathname.startsWith('/admin/');
  
  return {
    isAdminMode: isAdminRoute,
    isViewerMode: location.pathname.startsWith('/viewer/')
  };
};