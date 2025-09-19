import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { GoogleButton } from '@/components/auth/GoogleButton';

const Auth = () => {
  const { user, isAdmin, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate('/admin-portal');
      } else {
        navigate('/');
      }
    }
  }, [user, isAdmin, navigate]);

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      console.error('Error signing in with Google:', error);
    }
  };


  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome to Salescode
          </h1>
          <p className="text-gray-600">
            Sign in with Google to access your learning platform
          </p>
        </div>
        
        <GoogleButton onSignIn={handleGoogleSignIn} />
        
        <div className="text-center text-sm text-gray-500">
          Only authorized Google accounts can access this platform
        </div>
      </div>
    </AuthLayout>
  );
};

export default Auth;