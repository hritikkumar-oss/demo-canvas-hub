import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { MagicLinkForm } from '@/components/auth/MagicLinkForm';
import { MagicLinkSentState } from '@/components/auth/MagicLinkSentState';
import { SuccessState } from '@/components/auth/SuccessState';

type AuthStep = 'email' | 'magic-link-sent' | 'success';

// Analytics helper
const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  // Placeholder for analytics tracking
  console.log('Analytics:', eventName, properties);
};

const Auth = () => {
  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Reset scroll position
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, isAdmin, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        toast({
          title: "Sign-in Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate Google sign-in",
        variant: "destructive"
      });
    }
  };

  const handleMagicLinkSubmit = async (emailAddress: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: emailAddress,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        trackEvent('auth_magiclink_failed', { email: emailAddress, error: error.message });
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setEmail(emailAddress);
      setStep('magic-link-sent');
      trackEvent('auth_magiclink_sent', { email: emailAddress });
    } catch (error) {
      trackEvent('auth_magiclink_failed', { email: emailAddress, error: 'Unknown error' });
      toast({
        title: "Error",
        description: "Failed to send magic link",
        variant: "destructive"
      });
    }
  };

  const handleMagicLinkResend = async () => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        trackEvent('auth_magiclink_failed', { email, error: error.message });
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      trackEvent('auth_magiclink_resend', { email });
      toast({
        title: "Magic link sent",
        description: "Check your inbox for the new magic link",
      });
    } catch (error) {
      trackEvent('auth_magiclink_failed', { email, error: 'Resend failed' });
      toast({
        title: "Error",
        description: "Failed to resend magic link",
        variant: "destructive"
      });
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setEmail('');
  };

  const handleSuccessRedirect = () => {
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'email':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome to Salescode
              </h1>
              <p className="text-gray-600">
                Access learning & demo hub (invite-only)
              </p>
            </div>

            <div className="space-y-6">
              <GoogleButton onSignIn={handleGoogleSignIn} />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
                </div>
              </div>

              <MagicLinkForm onSubmit={handleMagicLinkSubmit} />
            </div>
          </div>
        );

      case 'magic-link-sent':
        return (
          <MagicLinkSentState
            email={email}
            onResend={handleMagicLinkResend}
            onChangeEmail={handleBackToEmail}
          />
        );

      case 'success':
        return (
          <SuccessState onRedirect={handleSuccessRedirect} />
        );

      default:
        return null;
    }
  };

  return (
    <AuthLayout>
      {renderContent()}
    </AuthLayout>
  );
};

export default Auth;