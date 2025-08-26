import { useState } from "react";
import { Play, Clock, BookOpen, MoreVertical, Plus, Link2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface VideoCardWithMenuProps {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  lessonCount: number;
  category: string;
  isNew?: boolean;
  onClick?: () => void;
  onAddToPlaylist?: () => void;
  viewMode?: 'grid' | 'list';
}

const VideoCardWithMenu = ({ 
  id,
  title, 
  thumbnail, 
  duration, 
  lessonCount, 
  category, 
  isNew, 
  onClick,
  onAddToPlaylist,
  viewMode = 'grid'
}: VideoCardWithMenuProps) => {
  const { toast } = useToast();

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/tutorial/${id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied to clipboard",
      description: "The demo link has been copied successfully.",
    });
  };

  const handleAddToPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToPlaylist?.();
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (viewMode === 'list') {
    return (
      <Card 
        className="group cursor-pointer transition-all duration-300 hover:shadow-md hover:shadow-primary/10 animate-fade-in"
        onClick={() => window.location.href = `/video/${id.split('-')[0]}/${id}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            {/* Small Thumbnail */}
            <div className="relative w-32 aspect-video overflow-hidden rounded-lg flex-shrink-0">
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Play Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Play className="w-3 h-3 text-primary ml-0.5" fill="currentColor" />
                </div>
              </div>

              {isNew && (
                <div className="absolute top-2 left-2">
                  <Badge variant="destructive" className="bg-hero text-hero-foreground text-xs">
                    New
                  </Badge>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{lessonCount} lessons</span>
                    </div>
                  </div>

                  <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
                    {category}
                  </Badge>
                </div>

                {/* Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={handleMenuClick}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleAddToPlaylist}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Playlist
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopyLink}>
                      <Link2 className="w-4 h-4 mr-2" />
                      Copy Demo Link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 animate-fade-in h-full flex flex-col"
      onClick={() => window.location.href = `/video/${id.split('-')[0]}/${id}`}
    >
      <CardContent className="p-0 flex flex-col h-full">
        {/* Thumbnail Container */}
        <div className="relative aspect-video overflow-hidden rounded-t-xl">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
              <Play className="w-6 h-6 text-primary ml-1" fill="currentColor" />
            </div>
          </div>

          {/* New Badge */}
          {isNew && (
            <div className="absolute top-3 left-3">
              <Badge variant="destructive" className="bg-hero text-hero-foreground hover:bg-hero-hover">
                New
              </Badge>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 text-foreground">
              {category}
            </Badge>
          </div>

          {/* Menu Button */}
          <div className="absolute bottom-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={handleMenuClick}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-white/95 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="w-4 h-4 text-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleAddToPlaylist}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Playlist
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyLink}>
                  <Link2 className="w-4 h-4 mr-2" />
                  Copy Demo Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors flex-1">
            {title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>{lessonCount} lessons</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCardWithMenu;