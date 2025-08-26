import { useState } from "react";
import { Play, MoreVertical, Share2, Copy, ListPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { type Video } from "@/data/mockData";
import ShareModal from "@/components/ShareModal";
import PlaylistModal from "@/components/PlaylistModal";

interface VideoCardWithMenuProps {
  video: Video;
  isListView?: boolean;
  showProductName?: boolean;
}

const VideoCardWithMenu = ({ video, isListView = false, showProductName = false }: VideoCardWithMenuProps) => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const { toast } = useToast();

  const handleCopyLink = () => {
    const link = `${window.location.origin}/video/${video.productId}/${video.id}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "Video link copied to clipboard",
    });
  };

  if (isListView) {
    return (
      <div className="flex items-center space-x-4 p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
        <Link
          to={`/video/${video.productId}/${video.id}`}
          className="relative flex-shrink-0"
        >
          <div className="w-32 aspect-video bg-muted rounded-lg overflow-hidden">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 text-gray-900 ml-0.5" fill="currentColor" />
              </div>
            </div>
          </div>
          {video.isNew && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              New
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <Link to={`/video/${video.productId}/${video.id}`}>
            <h3 className="font-semibold text-foreground mb-1 line-clamp-2 hover:text-primary transition-colors">
              {video.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {video.description}
          </p>
          <div className="flex items-center text-xs text-muted-foreground space-x-4">
            <span>{video.duration}</span>
            {showProductName && (
              <span>• {video.productId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setShareModalOpen(true)}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyLink}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPlaylistModalOpen(true)}>
              <ListPlus className="w-4 h-4 mr-2" />
              Add to Playlist
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          type="video"
          title={video.title}
          itemId={`${video.productId}/${video.id}`}
        />

        <PlaylistModal
          isOpen={playlistModalOpen}
          onClose={() => setPlaylistModalOpen(false)}
          video={video}
        />
      </div>
    );
  }

  return (
    <div className="group relative bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link to={`/video/${video.productId}/${video.id}`} className="block">
        <div className="relative aspect-video bg-muted">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
              <Play className="w-6 h-6 text-gray-900 ml-0.5" fill="currentColor" />
            </div>
          </div>
          {video.isNew && (
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              New
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <Link to={`/video/${video.productId}/${video.id}`}>
              <h3 className="font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
                {video.title}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {video.description}
            </p>
            <div className="flex items-center text-xs text-muted-foreground space-x-4">
              <span>{video.duration}</span>
              {showProductName && (
                <span>• {video.productId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setShareModalOpen(true)}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyLink}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPlaylistModalOpen(true)}>
                <ListPlus className="w-4 h-4 mr-2" />
                Add to Playlist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        type="video"
        title={video.title}
        itemId={`${video.productId}/${video.id}`}
      />

      <PlaylistModal
        isOpen={playlistModalOpen}
        onClose={() => setPlaylistModalOpen(false)}
        video={video}
      />
    </div>
  );
};

export default VideoCardWithMenu;