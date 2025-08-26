import { useState } from "react";
import { UserPlus, Eye, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface ShareModalProps {
  children: React.ReactNode;
  type?: "global" | "product" | "video" | "playlist";
  itemId?: string;
  itemTitle?: string;
}

const ShareModal = ({ children, type = "global", itemId, itemTitle }: ShareModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    message: "",
    expiry: ""
  });
  const [linkCopied, setLinkCopied] = useState(false);
  const { toast } = useToast();

  const generateViewOnlyLink = () => {
    const baseUrl = window.location.origin;
    switch (type) {
      case "product":
        return `${baseUrl}/product/${itemId}?shared=true`;
      case "video":
        return `${baseUrl}/video/${itemId}?shared=true`;
      case "playlist":
        return `${baseUrl}/playlist/${itemId}?shared=true`;
      default:
        return `${baseUrl}?shared=true`;
    }
  };

  const handleInviteAdmin = async () => {
    // Here you would integrate with Supabase to send invitation
    toast({
      title: "Admin invitation sent",
      description: `Invitation sent to ${adminForm.email}`,
    });
    setAdminForm({ name: "", email: "", message: "", expiry: "" });
    setIsOpen(false);
  };

  const handleCopyLink = async () => {
    const link = generateViewOnlyLink();
    await navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
    toast({
      title: "Link copied to clipboard",
      description: type === "global" ? "Share this link for view-only access" : `Link to ${itemTitle} copied`,
    });
  };

  const getShareTitle = () => {
    switch (type) {
      case "product":
        return `Share "${itemTitle}"`;
      case "video":
        return `Share "${itemTitle}"`;
      case "playlist":
        return `Share "${itemTitle}"`;
      default:
        return "Share Platform Access";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getShareTitle()}</DialogTitle>
        </DialogHeader>

        {type === "global" ? (
          <Tabs defaultValue="view-only" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="admin">Admin Access</TabsTrigger>
              <TabsTrigger value="view-only">View-Only</TabsTrigger>
            </TabsList>
            
            <TabsContent value="admin" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="invitee-name">Invitee Name</Label>
                  <Input
                    id="invitee-name"
                    value={adminForm.name}
                    onChange={(e) => setAdminForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="invitee-email">Email Address</Label>
                  <Input
                    id="invitee-email"
                    type="email"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="access-message">Access Message (Optional)</Label>
                  <Textarea
                    id="access-message"
                    value={adminForm.message}
                    onChange={(e) => setAdminForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Add a personal message..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="access-expiry">Access Expiry (Optional)</Label>
                  <Input
                    id="access-expiry"
                    type="date"
                    value={adminForm.expiry}
                    onChange={(e) => setAdminForm(prev => ({ ...prev, expiry: e.target.value }))}
                  />
                </div>
                <Button 
                  onClick={handleInviteAdmin} 
                  className="w-full"
                  disabled={!adminForm.name || !adminForm.email}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Send Admin Invitation
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="view-only" className="space-y-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Share this link to give view-only access to the entire platform
                </p>
                <div className="flex items-center space-x-2">
                  <Input
                    value={generateViewOnlyLink()}
                    readOnly
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleCopyLink}
                    size="sm"
                    variant={linkCopied ? "default" : "outline"}
                  >
                    {linkCopied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Share this view-only link to {itemTitle}
            </p>
            <div className="flex items-center space-x-2">
              <Input
                value={generateViewOnlyLink()}
                readOnly
                className="flex-1"
              />
              <Button 
                onClick={handleCopyLink}
                size="sm"
                variant={linkCopied ? "default" : "outline"}
              >
                {linkCopied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;