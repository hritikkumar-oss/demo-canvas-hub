import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { popFromNavigationStack } from '@/lib/navigationStack';

interface BackButtonProps {
  fallbackPath?: string;
  label?: string;
  className?: string;
  variant?: 'ghost' | 'outline' | 'default';
  size?: 'sm' | 'default' | 'lg';
  overridePath?: string; // Force navigation to a specific path
}

export const BackButton: React.FC<BackButtonProps> = ({
  fallbackPath = '/',
  label = 'Back',
  className = '',
  variant = 'ghost',
  size = 'sm',
  overridePath
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // If overridePath is provided, always use it
    if (overridePath) {
      navigate(overridePath);
      return;
    }

    // Try to get previous route from navigation stack
    const previousPath = popFromNavigationStack();
    
    if (previousPath) {
      // Navigate to previous route from stack
      navigate(previousPath);
    } else if (window.history.length > 1) {
      // Fallback to browser back if no stack but has history
      navigate(-1);
    } else {
      // Final fallback to specified path
      navigate(fallbackPath);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBack}
      className={className}
      aria-label="Go back"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
};

export default BackButton;