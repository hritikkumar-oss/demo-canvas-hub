import { useState } from "react";
import { Copy, UserPlus, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "global" | "product" | "video" | "playlist";
  title?: string;
  itemId?: string;
}

const ShareModal = ({ isOpen, onClose, type, title, itemId }: ShareModalProps) => {
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    message: "",
    expiry: ""
  });
  const { toast } = useToast();

  if (!isOpen) return null;

  const generateViewOnlyLink = () => {
    const baseUrl = window.location.origin;
    const token = Math.random().toString(36).substring(2, 15);
    
    let shareUrl = "";
    switch (type) {
      case "global":
        shareUrl = `${baseUrl}?share=${token}`;
        break;
      case "product":
        shareUrl = `${baseUrl}/product/${itemId}?share=${token}`;
        break;
      case "video":
        shareUrl = `${baseUrl}/video/${itemId}?share=${token}`;
        break;
      case "playlist":
        shareUrl = `${baseUrl}/playlists/${itemId}?share=${token}`;
        break;
    }
    
    return shareUrl;
  };

  const handleCopyLink = () => {
    const link = generateViewOnlyLink();
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "View-only link copied to clipboard",
    });
  };

  const handleAdminInvite = () => {
    // In real app, this would send invitation via Supabase
    toast({
      title: "Admin access invitation sent",
      description: `Invitation sent to ${adminForm.email}`,
    });
    setAdminForm({ name: "", email: "", message: "", expiry: "" });
    onClose();
  };

  const getShareTitle = () => {
    switch (type) {
      case "global":
        return "Share Portal Access";
      case "product":
        return `Share "${title}" Product`;
      case "video":
        return `Share "${title}" Video`;
      case "playlist":
        return `Share "${title}" Playlist`;
      default:
        return "Share Content";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg">{getShareTitle()}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="view-only" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="view-only" className="text-xs">View-Only</TabsTrigger>
              {type === "global" && (
                <TabsTrigger value="admin" className="text-xs">Admin Access</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="view-only" className="space-y-4">
              <div className="space-y-2">
                <Label>View-Only Link</Label>
                <p className="text-sm text-muted-foreground">
                  Anyone with this link can view the content but cannot make changes.
                </p>
                <div className="flex space-x-2">
                  <Input
                    value={generateViewOnlyLink()}
                    readOnly
                    className="text-xs"
                  />
                  <Button onClick={handleCopyLink} size="sm">
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            </TabsContent>

            {type === "global" && (
              <TabsContent value="admin" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="invitee-name">Invitee Name</Label>
                    <Input
                      id="invitee-name"
                      value={adminForm.name}
                      onChange={(e) => setAdminForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="invitee-email">Email Address</Label>
                    <Input
                      id="invitee-email"
                      type="email"
                      value={adminForm.email}
                      onChange={(e) => setAdminForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="access-message">Message (Optional)</Label>
                    <Textarea
                      id="access-message"
                      value={adminForm.message}
                      onChange={(e) => setAdminForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Add a personal message..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="access-expiry">Access Expiry (Optional)</Label>
                    <Input
                      id="access-expiry"
                      type="date"
                      value={adminForm.expiry}
                      onChange={(e) => setAdminForm(prev => ({ ...prev, expiry: e.target.value }))}
                    />
                  </div>

                  <Button 
                    onClick={handleAdminInvite}
                    className="w-full"
                    disabled={!adminForm.name || !adminForm.email}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Send Admin Invitation
                  </Button>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShareModal;