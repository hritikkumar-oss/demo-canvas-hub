import { Search, Menu, User, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ShareModal from "@/components/ShareModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const location = useLocation();

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-hero flex items-center justify-center">
              <span className="text-white font-bold text-sm">VP</span>
            </div>
            <span className="font-semibold text-lg text-foreground">VideoPortal</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-colors font-medium ${
                isActivePath('/') ? 'text-primary' : 'text-foreground hover:text-primary'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/new-launches" 
              className={`transition-colors font-medium ${
                isActivePath('/new-launches') ? 'text-primary' : 'text-foreground hover:text-primary'
              }`}
            >
              New Launches
            </Link>
            <Link 
              to="/playlists" 
              className={`transition-colors font-medium ${
                isActivePath('/playlists') ? 'text-primary' : 'text-foreground hover:text-primary'
              }`}
            >
              Playlists
            </Link>
            <Link 
              to="/admin" 
              className={`transition-colors font-medium ${
                isActivePath('/admin') ? 'text-primary' : 'text-foreground hover:text-primary'
              }`}
            >
              Admin
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8 hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products, tutorials..."
                className="pl-10 rounded-full border-input focus:border-primary"
              />
            </div>
          </div>

          {/* Share Button */}
          <div className="hidden md:block">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full"
              onClick={() => setShareModalOpen(true)}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
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
              <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/new-launches" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                New Launches
              </Link>
              <Link to="/playlists" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Playlists
              </Link>
              <Link to="/admin" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Admin
              </Link>
              <div className="pt-2">
                <Input
                  placeholder="Search products, tutorials..."
                  className="rounded-full border-input focus:border-primary"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShareModalOpen(true)}
                className="self-start"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </nav>
          </div>
        )}
      </div>
      
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        type="global"
      />
    </header>
  );
};

export default Header;