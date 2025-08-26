import { useState } from "react";
import { Plus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { mockPlaylists, type Video } from "@/data/mockData";

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: Video;
}

const PlaylistModal = ({ isOpen, onClose, video }: PlaylistModalProps) => {
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({
    name: "",
    description: "",
    coverUrl: ""
  });
  const { toast } = useToast();

  if (!isOpen) return null;

  const handlePlaylistToggle = (playlistId: string) => {
    setSelectedPlaylists(prev => 
      prev.includes(playlistId)
        ? prev.filter(id => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  const handleCreatePlaylist = () => {
    if (!newPlaylist.name) return;
    
    // In real app, this would create playlist in Supabase
    toast({
      title: "Playlist created",
      description: `"${newPlaylist.name}" has been created and video added`,
    });
    
    setNewPlaylist({ name: "", description: "", coverUrl: "" });
    setShowCreateForm(false);
    onClose();
  };

  const handleSave = () => {
    // In real app, this would update playlists in Supabase
    toast({
      title: "Video added to playlists",
      description: `"${video.title}" has been updated in ${selectedPlaylists.length} playlist(s)`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg">Add to Playlist</CardTitle>
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
          {/* Video Preview */}
          <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-16 h-9 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{video.title}</h4>
              <p className="text-xs text-muted-foreground">{video.duration}</p>
            </div>
          </div>

          {/* Existing Playlists */}
          <div className="space-y-2">
            <Label>Add to existing playlists</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {mockPlaylists.map((playlist) => (
                <div key={playlist.id} className="flex items-center space-x-3 p-2 hover:bg-muted/30 rounded">
                  <Checkbox
                    id={playlist.id}
                    checked={selectedPlaylists.includes(playlist.id)}
                    onCheckedChange={() => handlePlaylistToggle(playlist.id)}
                  />
                  <img
                    src={playlist.coverThumbnailUrl}
                    alt={playlist.name}
                    className="w-8 h-[18px] object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={playlist.id}
                      className="text-sm font-medium cursor-pointer truncate block"
                    >
                      {playlist.name}
                    </label>
                    <p className="text-xs text-muted-foreground">{playlist.videoCount} videos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Create New Playlist */}
          <div className="space-y-3">
            {!showCreateForm ? (
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Playlist
              </Button>
            ) : (
              <div className="space-y-3 p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Create New Playlist</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCreateForm(false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="playlist-name" className="text-xs">Name</Label>
                    <Input
                      id="playlist-name"
                      value={newPlaylist.name}
                      onChange={(e) => setNewPlaylist(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter playlist name"
                      className="h-8 text-sm"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="playlist-description" className="text-xs">Description</Label>
                    <Textarea
                      id="playlist-description"
                      value={newPlaylist.description}
                      onChange={(e) => setNewPlaylist(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter description (optional)"
                      className="h-16 text-sm resize-none"
                    />
                  </div>

                  <Button
                    onClick={handleCreatePlaylist}
                    disabled={!newPlaylist.name}
                    size="sm"
                    className="w-full"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Create & Add Video
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaylistModal;
