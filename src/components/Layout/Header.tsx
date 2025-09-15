import { Search, Menu, User, Share2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useAdminMode } from "@/hooks/useAdminMode";
import InviteModal from "@/components/InviteModal";

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const Header = ({ searchQuery = "", onSearchChange }: HeaderProps = {}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const { isAdminMode, isViewerMode } = useAdminMode();

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img 
              src="/lovable-uploads/e034b324-e49a-4ea8-9cb1-9222a945fe38.png" 
              alt="salescode.ai Demo" 
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to={isAdminMode ? "/admin/home" : isViewerMode ? "/viewer/home" : "/"} 
              className={`transition-colors font-medium ${
                isActivePath('/') || isActivePath('/admin/home') || isActivePath('/viewer/home') ? 'text-primary' : 'text-foreground hover:text-primary'
              }`}
            >
              Home
            </Link>
            <Link 
              to={isAdminMode ? "/admin/demo-videos" : isViewerMode ? "/viewer/demo-videos" : "/demo-videos"} 
              className={`transition-colors font-medium ${
                isActivePath('/demo-videos') || isActivePath('/admin/demo-videos') || isActivePath('/viewer/demo-videos') ? 'text-primary' : 'text-foreground hover:text-primary'
              }`}
            >
              Demo Videos
            </Link>
            <Link 
              to={isAdminMode ? "/admin/new-launches" : isViewerMode ? "/viewer/new-launches" : "/new-launches"} 
              className={`transition-colors font-medium ${
                isActivePath('/new-launches') || isActivePath('/admin/new-launches') || isActivePath('/viewer/new-launches') ? 'text-primary' : 'text-foreground hover:text-primary'
              }`}
            >
              New Launches
            </Link>
            {isAdmin && !isViewerMode && (
              <Link 
                to="/admin/playlists" 
                className={`transition-colors font-medium ${
                  isActivePath('/admin/playlists') ? 'text-primary' : 'text-foreground hover:text-primary'
                }`}
              >
                Playlists
              </Link>
            )}
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8 hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products, tutorials..."
                className="pl-10 rounded-full border-input focus:border-primary"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </div>
          </div>

          {/* Share Button */}
          {isAdmin && !isViewerMode && (
            <div className="hidden md:block">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full"
                onClick={() => setInviteModalOpen(true)}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Invite
              </Button>
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Search className="h-4 w-4" />
            </Button>
            {user ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={async () => {
                  await signOut();
                  navigate('/');
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/auth')}
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t animate-slide-up">
            <nav className="flex flex-col space-y-4">
              <Link to={isAdminMode ? "/admin/home" : isViewerMode ? "/viewer/home" : "/"} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to={isAdminMode ? "/admin/demo-videos" : isViewerMode ? "/viewer/demo-videos" : "/demo-videos"} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Demo Videos
              </Link>
              <Link to={isAdminMode ? "/admin/new-launches" : isViewerMode ? "/viewer/new-launches" : "/new-launches"} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                New Launches
              </Link>
              {isAdmin && !isViewerMode && (
                <Link to="/admin/playlists" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  Playlists
                </Link>
              )}
              <div className="pt-2">
                <Input
                  placeholder="Search products, tutorials..."
                  className="rounded-full border-input focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                />
              </div>
              {isAdmin && !isViewerMode && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setInviteModalOpen(true)}
                  className="self-start"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Invite
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
      
      <InviteModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        type="global"
      />
    </header>
  );
};

export default Header;