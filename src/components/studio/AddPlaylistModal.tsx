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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddPlaylistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddPlaylistModal: React.FC<AddPlaylistModalProps> = ({ open, onOpenChange }) => {
  const { products } = useData();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coverThumbnail: '',
  });
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);

  // Get all videos from all products
  const allVideos = products.flatMap(product => 
    product.videos.map(video => ({ ...video, productTitle: product.title }))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Please enter a playlist name.",
        variant: "destructive",
      });
      return;
    }

    const selectedVideoObjects = allVideos.filter(video => 
      selectedVideos.includes(video.id)
    );

    // In a real app, this would call addPlaylist from DataContext
    toast({
      title: "Playlist created",
      description: `"${formData.name}" has been created with ${selectedVideoObjects.length} videos.`,
    });

    onOpenChange(false);
    setFormData({ name: '', description: '', coverThumbnail: '' });
    setThumbnailPreview('');
    setSelectedVideos([]);
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setThumbnailPreview(result);
        setFormData(prev => ({ ...prev, coverThumbnail: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoToggle = (videoId: string) => {
    setSelectedVideos(prev => 
      prev.includes(videoId)
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Playlist</DialogTitle>
          <DialogDescription>
            Create a collection of videos for easy organization and sharing.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Playlist Name *</Label>
            <Input
              id="name"
              placeholder="Enter playlist name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter playlist description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Cover Thumbnail (16:9)</Label>
            <div className="space-y-3">
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                <input
                  type="file"
                  id="thumbnail"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                />
                <label
                  htmlFor="thumbnail"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload cover image
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Recommended: 16:9 aspect ratio
                  </span>
                </label>
              </div>

              {thumbnailPreview && (
                <div className="relative">
                  <img
                    src={thumbnailPreview}
                    alt="Cover preview"
                    className="w-full h-40 object-cover rounded-lg aspect-video"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0 bg-black/50 hover:bg-black/70"
                    onClick={() => {
                      setThumbnailPreview('');
                      setFormData(prev => ({ ...prev, coverThumbnail: '' }));
                    }}
                  >
                    <X className="h-4 w-4 text-white" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Select Videos</Label>
            <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-3">
              {allVideos.map((video) => (
                <div key={video.id} className="flex items-center gap-3">
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
            <p className="text-sm text-muted-foreground">
              {selectedVideos.length} videos selected
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Playlist</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};