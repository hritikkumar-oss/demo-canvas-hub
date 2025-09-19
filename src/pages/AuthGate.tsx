import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, LogIn, UserPlus, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AuthGate = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signIn } = useAuth();
  
  const [invite, setInvite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'check' | 'login' | 'signup' | 'otp'>('check');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    otpCode: ''
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (user) {
      // User already authenticated, proceed to validate invite
      if (token) {
        validateAndAcceptInvite();
      } else {
        navigate(user.user_metadata?.role === 'admin' ? '/admin' : '/');
      }
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
        toast({
          title: "Invalid invite",
          description: "This invitation link is invalid or has expired.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      // Check if invite is expired
      if (new Date(inviteData.expires_at) < new Date()) {
        toast({
          title: "Invite expired",
          description: "This invitation has expired. Please request a new one.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      setInvite(inviteData);
      setFormData(prev => ({ ...prev, email: inviteData.email, name: inviteData.name || '' }));
      setMode('login');
    } catch (error) {
      console.error('Error loading invite:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const validateAndAcceptInvite = async () => {
    if (!token || !user) return;

    try {
      // Get the invite
      const { data: inviteData, error: inviteError } = await supabase
        .from('invites')
        .select('*')
        .eq('token', token)
        .eq('status', 'pending')
        .single();

      if (inviteError || !inviteData || new Date(inviteData.expires_at) < new Date()) {
        toast({
          title: "Invalid invite",
          description: "This invitation link is invalid or has expired.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      // Check if the authenticated user's email matches the invite
      if (user.email !== inviteData.email) {
        toast({
          title: "Email mismatch",
          description: "Please log in with the email address that received the invitation.",
          variant: "destructive"
        });
        return;
      }

      // Update user metadata with role from invite
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          role: inviteData.invite_type === 'admin' ? 'admin' : 'viewer',
          name: inviteData.name || user.user_metadata?.name
        }
      });

      if (updateError) {
        console.error('Error updating user metadata:', updateError);
      }

      // Mark invite as accepted
      await supabase
        .from('invites')
        .update({ 
          status: 'accepted', 
          accepted_at: new Date().toISOString() 
        })
        .eq('id', inviteData.id);

      toast({
        title: "Invite accepted",
        description: "Welcome! Your account has been activated.",
      });

      // Redirect based on resource or role
      if (inviteData.resource_type && inviteData.resource_id) {
        const basePath = inviteData.resource_type === 'product' ? '/products' : 
                        inviteData.resource_type === 'video' ? '/videos' : 
                        inviteData.resource_type === 'playlist' ? '/playlists' : '';
        navigate(`${basePath}/${inviteData.resource_id}`);
      } else {
        navigate(inviteData.invite_type === 'admin' ? '/admin' : '/');
      }

    } catch (error: any) {
      console.error('Error validating invite:', error);
      toast({
        title: "Error",
        description: "Failed to accept invitation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message || "Invalid credentials",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSendOTP = async () => {
    setOtpLoading(true);
    try {
      const response = await fetch('https://wpkcwzclgnnvrmljeyyz.supabase.co/functions/v1/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send OTP');
      }

      toast({
        title: "OTP sent",
        description: `Verification code sent to ${formData.email}`,
      });

      // For demo purposes, show the OTP in console
      if (result.otp) {
        console.log('Demo OTP:', result.otp);
        toast({
          title: "Demo Mode",
          description: `Demo OTP: ${result.otp}`,
          variant: "default"
        });
      }

      setMode('otp');
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

    setAuthLoading(true);
    try {
      // Verify OTP
      const { data: otpData, error: otpError } = await supabase
        .from('otp_verifications')
        .select('*')
        .eq('email', formData.email)
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

      // Create user account
      const { data: newUser, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: Math.random().toString(36).substring(2, 15), // Temporary password
        options: {
          data: {
            role: invite.invite_type === 'admin' ? 'admin' : 'viewer',
            name: formData.name
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      toast({
        title: "Account created!",
        description: "Please check your email to complete the setup.",
      });

      // The user will be redirected after email confirmation
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to verify code",
        variant: "destructive"
      });
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-hero to-primary-hover flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!invite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-hero to-primary-hover flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Invalid Invitation</CardTitle>
            <CardDescription>
              This invitation link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
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
            {mode === 'login' ? <LogIn className="h-6 w-6 text-white" /> : 
             mode === 'signup' ? <UserPlus className="h-6 w-6 text-white" /> : 
             <Mail className="h-6 w-6 text-white" />}
          </div>
          <CardTitle className="text-2xl font-bold">
            {mode === 'login' ? 'Sign In to Continue' : 
             mode === 'signup' ? 'Create Your Account' : 
             'Verify Your Email'}
          </CardTitle>
          <CardDescription>
            You've been invited as {invite.invite_type === 'admin' ? 'an admin' : 'a viewer'}
            {invite.resource_type && ` to access ${invite.resource_type}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === 'login' && (
            <div className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    required
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={authLoading}>
                  {authLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              
              <div className="text-center text-sm">
                <p className="text-muted-foreground mb-2">
                  Don't have an account?
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setMode('signup')} 
                  className="w-full"
                >
                  Create Account with OTP
                </Button>
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
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
                onClick={handleSendOTP}
                className="w-full" 
                disabled={otpLoading || !formData.name.trim()}
              >
                {otpLoading ? "Sending..." : "Send Verification Code"}
              </Button>
              
              <div className="text-center">
                <Button 
                  variant="ghost" 
                  onClick={() => setMode('login')}
                  className="text-sm"
                >
                  Already have an account? Sign in
                </Button>
              </div>
            </div>
          )}

          {mode === 'otp' && (
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
                <p className="text-xs text-muted-foreground text-center">
                  Sent to {formData.email}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => setMode('signup')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleVerifyOTP}
                  className="flex-1" 
                  disabled={authLoading || formData.otpCode.length !== 6}
                >
                  {authLoading ? "Creating..." : "Create Account"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthGate;