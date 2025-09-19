import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AuthGate = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Store the invitation token in localStorage for use after authentication
    if (token) {
      localStorage.setItem('pendingInvite', token);
    }
    
    // Redirect to main auth page - Google login only
    navigate('/auth');
  }, [token, navigate]);

  useEffect(() => {
    if (user) {
      // Handle invitation after authentication
      const pendingInvite = localStorage.getItem('pendingInvite');
      if (pendingInvite) {
        localStorage.removeItem('pendingInvite');
        // Process invitation here if needed
      }
      
      // Redirect based on role
      if (user.user_metadata?.role === 'admin') {
        navigate('/admin-portal');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};

export default AuthGate;