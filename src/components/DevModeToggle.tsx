import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Eye, Shield } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const DevModeToggle: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const isAdminMode = location.pathname.startsWith('/admin');
  const isViewerMode = location.pathname.startsWith('/viewer');

  const toggleMode = () => {
    const currentPath = location.pathname.replace(/^\/(?:admin|viewer)/, '') || '/';
    
    if (isAdminMode) {
      navigate(`/viewer${currentPath}`);
    } else if (isViewerMode) {
      navigate(`/admin${currentPath}`);
    } else {
      navigate(`/admin${currentPath}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={toggleMode}
        variant="outline"
        size="sm"
        className="bg-background/95 backdrop-blur shadow-lg"
      >
        {isAdminMode ? (
          <>
            <Shield className="w-4 h-4 mr-2" />
            Admin Mode
          </>
        ) : isViewerMode ? (
          <>
            <Eye className="w-4 h-4 mr-2" />
            Viewer Mode
          </>
        ) : (
          <>
            <Settings className="w-4 h-4 mr-2" />
            Switch Mode
          </>
        )}
      </Button>
    </div>
  );
};

export default DevModeToggle;