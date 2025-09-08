import { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessStateProps {
  onRedirect: () => void;
}

export const SuccessState = ({ onRedirect }: SuccessStateProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRedirect();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onRedirect]);

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          Verified ✓
        </h3>
        <p className="text-sm text-gray-600">
          Redirecting to your learning hub...
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      </div>
    </div>
  );
};