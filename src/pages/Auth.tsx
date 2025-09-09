import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { EmailForm } from '@/components/auth/EmailForm';
import { OtpForm } from '@/components/auth/OtpForm';
import { SuccessState } from '@/components/auth/SuccessState';

type AuthStep = 'email' | 'otp' | 'success';

interface AuthProps {
  onSuccess?: () => string;
}

const Auth = ({ onSuccess }: AuthProps = {}) => {
  const { isAdmin: mockIsAdmin } = useUserRole();
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

  const handleEmailSubmit = async (emailAddress: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: emailAddress,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setEmail(emailAddress);
      setStep('otp');
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${emailAddress}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification code",
        variant: "destructive"
      });
    }
  };

  const handleOtpVerify = async (otp: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      });

      if (error) {
        throw new Error(error.message);
      }

      setStep('success');
    } catch (error) {
      throw error; // Re-throw to be handled by OtpForm
    }
  };

  const handleOtpResend = async () => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "OTP Sent",
        description: `New verification code sent to ${email}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend verification code",
        variant: "destructive"
      });
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setEmail('');
  };

  const handleSuccessRedirect = () => {
    const redirectPath = onSuccess ? onSuccess() : (mockIsAdmin ? "/admin" : "/viewer");
    navigate(redirectPath);
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

              <EmailForm onSubmit={handleEmailSubmit} />
            </div>
          </div>
        );

      case 'otp':
        return (
          <OtpForm
            email={email}
            onVerify={handleOtpVerify}
            onBack={handleBackToEmail}
            onResend={handleOtpResend}
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