import { useState } from "react";
import { createPortal } from "react-dom";
import { UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useToast } from "@/hooks/use-toast";

import { supabase } from "@/integrations/supabase/client";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "global" | "product" | "video" | "playlist";
  title?: string;
  itemId?: string;
}

const InviteModal = ({ isOpen, onClose, type, title, itemId }: InviteModalProps) => {
  const [inviteForm, setInviteForm] = useState({
    email: "",
    name: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  

  if (!isOpen) return null;

  const handleInvite = async () => {
    if (!inviteForm.email) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      const response = await fetch('https://wpkcwzclgnnvrmljeyyz.supabase.co/functions/v1/send-invite-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          email: inviteForm.email,
          name: inviteForm.name || undefined,
          inviteType: "viewer",
          resourceType: type === "global" ? undefined : type,
          resourceId: type === "global" ? undefined : itemId,
          resourceTitle: title,
          message: inviteForm.message || undefined,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send invite');
      }

      toast({
        title: "Invite sent",
        description: `Invitation sent to ${inviteForm.email}`,
      });

      setInviteForm({ email: "", name: "", message: "" });
      onClose();
    } catch (error: any) {
      console.error("Error sending invite:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send invite",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getInviteTitle = () => {
    switch (type) {
      case "global":
        return "Invite to Portal";
      case "product":
        return `Invite to "${title}" Product`;
      case "video":
        return `Invite to "${title}" Video`;
      case "playlist":
        return `Invite to "${title}" Playlist`;
      default:
        return "Send Invitation";
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in bg-background shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg">{getInviteTitle()}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email Address *</Label>
            <Input
              id="invite-email"
              type="email"
              value={inviteForm.email}
              onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="invite-name">Name (Optional)</Label>
            <Input
              id="invite-name"
              value={inviteForm.name}
              onChange={(e) => setInviteForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter full name"
            />
          </div>


          <div className="space-y-2">
            <Label htmlFor="invite-message">Message (Optional)</Label>
            <Textarea
              id="invite-message"
              value={inviteForm.message}
              onChange={(e) => setInviteForm(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Add a personal message..."
              rows={3}
            />
          </div>

          <Button 
            onClick={handleInvite}
            className="w-full"
            disabled={loading || !inviteForm.email}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {loading ? "Sending..." : "Send Invitation"}
          </Button>
        </CardContent>
      </Card>
    </div>,
    document.body
  );
};

export default InviteModal;