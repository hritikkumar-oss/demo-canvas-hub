import { useState } from "react";
import { Plus, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface Playlist {
  id: string;
  name: string;
  description?: string;
  videoCount: number;
  isVideoIncluded: boolean;
}

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  videoTitle: string;
}

// Mock playlists data - replace with actual data from Supabase
const mockPlaylists: Playlist[] = [
  { id: '1', name: 'Sales Training', description: 'Essential sales techniques', videoCount: 12, isVideoIncluded: false },
  { id: '2', name: 'Product Demos', description: 'Customer-facing demonstrations', videoCount: 8, isVideoIncluded: true },
  { id: '3', name: 'Onboarding Series', description: 'New user tutorials', videoCount: 15, isVideoIncluded: false },
];

const PlaylistModal = ({ isOpen, onClose, videoId, videoTitle }: PlaylistModalProps) => {
  const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const { toast } = useToast();

  const handlePlaylistToggle = (playlistId: string) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId) {
        const wasIncluded = playlist.isVideoIncluded;
        return {
          ...playlist,
          isVideoIncluded: !wasIncluded,
          videoCount: wasIncluded ? playlist.videoCount - 1 : playlist.videoCount + 1
        };
      }
      return playlist;
    }));
  };

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a playlist name.",
        variant: "destructive",
      });
      return;
    }

    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: newPlaylistName.trim(),
      description: newPlaylistDescription.trim(),
      videoCount: 1,
      isVideoIncluded: true,
    };

    setPlaylists(prev => [...prev, newPlaylist]);
    setNewPlaylistName('');
    setNewPlaylistDescription('');
    setIsCreatingNew(false);

    toast({
      title: "Playlist created",
      description: `"${newPlaylist.name}" has been created and the video added.`,
    });
  };

  const handleSave = () => {
    // Here you would save the changes to Supabase
    const addedTo = playlists.filter(p => p.isVideoIncluded).map(p => p.name);
    
    toast({
      title: "Changes saved",
      description: addedTo.length > 0 
        ? `Video added to ${addedTo.length} playlist${addedTo.length > 1 ? 's' : ''}.`
        : "Video removed from all playlists.",
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save to playlist</DialogTitle>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {videoTitle}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Existing Playlists */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={`playlist-${playlist.id}`}
                  checked={playlist.isVideoIncluded}
                  onCheckedChange={() => handlePlaylistToggle(playlist.id)}
                />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor={`playlist-${playlist.id}`}
                    className="text-sm font-medium text-foreground cursor-pointer"
                  >
                    {playlist.name}
                  </label>
                  {playlist.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {playlist.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {playlist.videoCount} video{playlist.videoCount !== 1 ? 's' : ''}
                  </p>
                </div>
                {playlist.isVideoIncluded && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </div>
            ))}
          </div>

          {/* Create New Playlist */}
          {isCreatingNew ? (
            <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
              <div>
                <Label htmlFor="playlist-name">Playlist name</Label>
                <Input
                  id="playlist-name"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Enter playlist name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="playlist-description">Description (optional)</Label>
                <Input
                  id="playlist-description"
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  placeholder="Enter description"
                  className="mt-1"
                />
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleCreatePlaylist}>
                  Create
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIsCreatingNew(false);
                    setNewPlaylistName('');
                    setNewPlaylistDescription('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setIsCreatingNew(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create new playlist
            </Button>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlaylistModal;
