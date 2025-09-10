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
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  GripVertical, 
  Trash2, 
  Copy, 
  ChevronUp, 
  ChevronDown,
  Plus 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Playlist, Video } from '@/data/mockData';
import { AddToPlaylistModal } from './AddToPlaylistModal';

interface PlaylistDetailModalProps {
  playlist: Playlist | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PlaylistDetailModal: React.FC<PlaylistDetailModalProps> = ({ 
  playlist, 
  open, 
  onOpenChange 
}) => {
  const { updatePlaylist } = useData();
  const { toast } = useToast();
  const [showAddVideosModal, setShowAddVideosModal] = useState(false);
  const [playlistVideos, setPlaylistVideos] = useState<Video[]>(playlist?.videos || []);

  React.useEffect(() => {
    if (playlist) {
      setPlaylistVideos(playlist.videos);
    }
  }, [playlist]);

  if (!playlist) return null;

  const handleRemoveVideo = (videoId: string) => {
    const updatedVideos = playlistVideos.filter(video => video.id !== videoId);
    setPlaylistVideos(updatedVideos);
    updatePlaylist(playlist.id, { 
      videos: updatedVideos,
      videoCount: updatedVideos.length 
    });
    
    toast({
      title: "Video removed",
      description: "Video has been removed from the playlist.",
    });
  };

  const handleCopyLink = (video: Video) => {
    const url = `${window.location.origin}/viewer/video/${video.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "Video link has been copied to clipboard.",
    });
  };

  const handleMoveVideo = (index: number, direction: 'up' | 'down') => {
    const newVideos = [...playlistVideos];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newVideos.length) {
      [newVideos[index], newVideos[targetIndex]] = [newVideos[targetIndex], newVideos[index]];
      setPlaylistVideos(newVideos);
      updatePlaylist(playlist.id, { videos: newVideos });
    }
  };

  const handleAddVideos = (videoIds: string[]) => {
    // This would be implemented to add selected videos to the playlist
    toast({
      title: "Videos added",
      description: `${videoIds.length} videos added to playlist.`,
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Playlist: {playlist.name}</DialogTitle>
            <DialogDescription>
              Reorder, add, or remove videos from this playlist.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Videos ({playlistVideos.length})</h3>
              <Button onClick={() => setShowAddVideosModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Videos
              </Button>
            </div>

            <div className="space-y-3">
              {playlistVideos.map((video, index) => (
                <Card key={video.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveVideo(index, 'up')}
                        disabled={index === 0}
                        className="h-6 w-6 p-0"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveVideo(index, 'down')}
                        disabled={index === playlistVideos.length - 1}
                        className="h-6 w-6 p-0"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="text-sm text-muted-foreground w-8 text-center">
                      {index + 1}
                    </div>

                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-24 h-14 object-cover rounded aspect-video"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium line-clamp-2">{video.title}</h4>
                      <p className="text-sm text-muted-foreground">{video.duration}</p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleCopyLink(video)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleRemoveVideo(video.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              ))}
            </div>

            {playlistVideos.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No videos in this playlist.</p>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddVideosModal(true)}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Videos
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddToPlaylistModal
        open={showAddVideosModal}
        onOpenChange={setShowAddVideosModal}
        playlistId={playlist.id}
        onAddVideos={handleAddVideos}
      />
    </>
  );
};