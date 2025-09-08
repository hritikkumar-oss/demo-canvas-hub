import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Mail, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const InviteAccept = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [invite, setInvite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'loading' | 'request-otp' | 'verify-otp' | 'error'>('loading');
  const [formData, setFormData] = useState({
    name: '',
    otpCode: ''
  });
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // If user is already logged in, redirect to appropriate page
      navigate(user.user_metadata?.role === 'admin' ? '/admin' : '/');
      return;
    }

    if (token) {
      loadInvite();
    }
  }, [token, user]);

  const loadInvite = async () => {
    try {
      const { data: inviteData, error } = await supabase
        .from('invites')
        .select('*')
        .eq('token', token)
        .eq('status', 'pending')
        .single();

      if (error || !inviteData) {
        setStep('error');
        return;
      }

      // Check if invite is expired
      if (new Date(inviteData.expires_at) < new Date()) {
        setStep('error');
        toast({
          title: "Invite expired",
          description: "This invitation has expired. Please request a new one.",
          variant: "destructive"
        });
        return;
      }

      setInvite(inviteData);
      setFormData(prev => ({ ...prev, name: inviteData.name || '' }));
      setStep('request-otp');
    } catch (error) {
      console.error('Error loading invite:', error);
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOTP = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive"
      });
      return;
    }

    setOtpLoading(true);
    try {
      const response = await fetch('https://wpkcwzclgnnvrmljeyyz.supabase.co/functions/v1/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: invite.email,
          name: formData.name,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send OTP');
      }

      toast({
        title: "OTP sent",
        description: `Verification code sent to ${invite.email}`,
      });

      // For demo purposes, show the OTP in console (remove in production)
      if (result.otp) {
        console.log('Demo OTP:', result.otp);
        toast({
          title: "Demo Mode",
          description: `Demo OTP: ${result.otp}`,
          variant: "default"
        });
      }

      setStep('verify-otp');
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code",
        variant: "destructive"
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otpCode.trim() || formData.otpCode.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit code",
        variant: "destructive"
      });
      return;
    }

    setVerifyLoading(true);
    try {
      // Verify OTP
      const { data: otpData, error: otpError } = await supabase
        .from('otp_verifications')
        .select('*')
        .eq('email', invite.email)
        .eq('otp_code', formData.otpCode)
        .eq('verified', false)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (otpError || !otpData) {
        toast({
          title: "Invalid code",
          description: "The verification code is invalid or expired",
          variant: "destructive"
        });
        return;
      }

      // Mark OTP as verified
      await supabase
        .from('otp_verifications')
        .update({ verified: true })
        .eq('id', otpData.id);

      // Check if user already exists
      let userId: string;
      const { data: existingUser } = await supabase.auth.admin.getUserById(invite.email);
      
      if (existingUser.user) {
        // Update existing user's metadata
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          existingUser.user.id,
          {
            user_metadata: {
              ...existingUser.user.user_metadata,
              role: invite.invite_type === 'admin' ? 'admin' : 'viewer',
              name: formData.name
            }
          }
        );
        
        if (updateError) {
          console.error('Error updating user metadata:', updateError);
        }
        
        userId = existingUser.user.id;
      } else {
        // Create new user
        const tempPassword = Math.random().toString(36).substring(2, 15);
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: invite.email,
          password: tempPassword,
          user_metadata: {
            role: invite.invite_type === 'admin' ? 'admin' : 'viewer',
            name: formData.name
          },
          email_confirm: true
        });

        if (createError || !newUser.user) {
          throw new Error(createError?.message || 'Failed to create user');
        }
        
        userId = newUser.user.id;
      }

      // Mark invite as accepted
      await supabase
        .from('invites')
        .update({ 
          status: 'accepted', 
          accepted_at: new Date().toISOString() 
        })
        .eq('id', invite.id);

      // Sign in the user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: invite.email,
        password: 'temp' // This won't work, but we'll use magic link
      });

      // Send magic link for login
      const { error: magicLinkError } = await supabase.auth.signInWithOtp({
        email: invite.email,
        options: {
          emailRedirectTo: `${window.location.origin}${invite.invite_type === 'admin' ? '/admin' : '/'}`
        }
      });

      if (magicLinkError) {
        console.error('Magic link error:', magicLinkError);
      }

      toast({
        title: "Account created successfully!",
        description: "Please check your email for a login link.",
      });

      // Redirect based on role
      setTimeout(() => {
        navigate(invite.invite_type === 'admin' ? '/admin' : '/');
      }, 2000);

    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to verify code",
        variant: "destructive"
      });
    } finally {
      setVerifyLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-hero to-primary-hover flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (step === 'error' || !invite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-hero to-primary-hover flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 rounded-lg bg-gradient-to-br from-destructive to-destructive-foreground flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Invalid Invitation</CardTitle>
            <CardDescription>
              This invitation link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-hero to-primary-hover flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-hero flex items-center justify-center mb-4">
            {step === 'request-otp' ? <UserPlus className="h-6 w-6 text-white" /> : <Mail className="h-6 w-6 text-white" />}
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === 'request-otp' ? 'Complete Registration' : 'Verify Your Email'}
          </CardTitle>
          <CardDescription>
            {step === 'request-otp' 
              ? `You've been invited as ${invite.invite_type === 'admin' ? 'an admin' : 'a viewer'}`
              : `Enter the verification code sent to ${invite.email}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'request-otp' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={invite.email}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <Button 
                onClick={handleRequestOTP}
                className="w-full" 
                disabled={otpLoading || !formData.name.trim()}
              >
                {otpLoading ? "Sending..." : "Send Verification Code"}
              </Button>
            </div>
          )}

          {step === 'verify-otp' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  value={formData.otpCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, otpCode: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                  placeholder="Enter 6-digit code"
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => setStep('request-otp')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleVerifyOTP}
                  className="flex-1" 
                  disabled={verifyLoading || formData.otpCode.length !== 6}
                >
                  {verifyLoading ? "Verifying..." : "Verify & Create Account"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteAccept;