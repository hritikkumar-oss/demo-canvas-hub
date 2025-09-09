import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddToPlaylistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlistId?: string;
  onAddVideos?: (videoIds: string[]) => void;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({ 
  open, 
  onOpenChange,
  playlistId,
  onAddVideos 
}) => {
  const { products, playlists, updatePlaylist } = useData();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);

  // Get all videos from all products
  const allVideos = products.flatMap(product => 
    product.videos.map(video => ({ ...video, productTitle: product.title }))
  );

  // Filter out videos already in the current playlist
  const currentPlaylist = playlists.find(p => p.id === playlistId);
  const currentVideoIds = currentPlaylist?.videos.map(v => v.id) || [];
  
  const availableVideos = allVideos.filter(video => 
    !currentVideoIds.includes(video.id) &&
    (video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     video.productTitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleVideoToggle = (videoId: string) => {
    setSelectedVideos(prev => 
      prev.includes(videoId)
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const handleAddVideos = () => {
    if (selectedVideos.length === 0) return;

    if (playlistId && currentPlaylist) {
      const selectedVideoObjects = allVideos.filter(video => 
        selectedVideos.includes(video.id)
      );
      
      const updatedVideos = [...currentPlaylist.videos, ...selectedVideoObjects];
      updatePlaylist(playlistId, { 
        videos: updatedVideos,
        videoCount: updatedVideos.length 
      });

      toast({
        title: "Videos added",
        description: `${selectedVideos.length} videos added to playlist.`,
      });
    }

    if (onAddVideos) {
      onAddVideos(selectedVideos);
    }

    onOpenChange(false);
    setSelectedVideos([]);
    setSearchQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Videos to Playlist</DialogTitle>
          <DialogDescription>
            Select videos to add to this playlist.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {availableVideos.map((video) => (
              <div key={video.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <Checkbox
                  id={video.id}
                  checked={selectedVideos.includes(video.id)}
                  onCheckedChange={() => handleVideoToggle(video.id)}
                />
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-16 h-9 object-cover rounded aspect-video"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium line-clamp-1">{video.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {video.productTitle} • {video.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {availableVideos.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'No videos found matching your search.' : 'No more videos available to add.'}
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            {selectedVideos.length} videos selected
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddVideos}
            disabled={selectedVideos.length === 0}
          >
            Add Videos ({selectedVideos.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};