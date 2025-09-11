import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, UserPlus } from 'lucide-react';
import { sendAdminInvite } from '@/lib/adminInviteApi';
import { useToast } from '@/hooks/use-toast';

export const AdminInvitePanel: React.FC = () => {
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const { toast } = useToast();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setLastResult(null);

    try {
      let data: Record<string, any> | undefined;
      
      if (userData.trim()) {
        try {
          data = JSON.parse(userData);
        } catch (err) {
          toast({
            title: "Invalid JSON",
            description: "User data must be valid JSON",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
      }

      const result = await sendAdminInvite(email.trim(), data);
      setLastResult(result);

      if (result.ok) {
        toast({
          title: "Invite sent",
          description: `Successfully sent invite to ${email}`,
        });
        setEmail('');
        setUserData('');
      } else {
        toast({
          title: "Invite failed",
          description: result.details || result.error || "Unknown error",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send invite",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl" data-testid="admin-invite-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Send Admin Invite
        </CardTitle>
        <CardDescription>
          Send Supabase authentication invites to new users using the admin API
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userData">User Metadata (Optional)</Label>
            <Textarea
              id="userData"
              value={userData}
              onChange={(e) => setUserData(e.target.value)}
              placeholder='{"role": "admin", "department": "sales"}'
              rows={3}
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              Optional JSON metadata to include with the user account
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Invite...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send Invite
              </>
            )}
          </Button>
        </form>

        {lastResult && (
          <div className="mt-4">
            <Alert variant={lastResult.ok ? "default" : "destructive"}>
              <AlertDescription>
                {lastResult.ok ? (
                  <div>
                    <strong>✅ Success:</strong> {lastResult.message}
                    {lastResult.invite?.user?.id && (
                      <div className="mt-1 text-sm">
                        User ID: {lastResult.invite.user.id}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <strong>❌ Error:</strong> {lastResult.error}
                    {lastResult.details && (
                      <div className="mt-1 text-sm">{lastResult.details}</div>
                    )}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
};