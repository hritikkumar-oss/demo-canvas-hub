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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadThumbnail, uploadVideo } from '@/lib/supabaseStorage';

interface AddVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddVideoModal: React.FC<AddVideoModalProps> = ({ open, onOpenChange }) => {
  const { products, addVideo } = useData();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    productId: '',
    title: '',
    description: '',
    duration: '',
    videoUrl: '',
    thumbnailUrl: '',
  });
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || !formData.title) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      let thumbnailUrl = formData.thumbnailUrl;
      let videoUrl = formData.videoUrl;

      // Upload thumbnail if file is selected
      if (thumbnailFile) {
        const thumbnailResult = await uploadThumbnail(thumbnailFile);
        if (thumbnailResult.error) {
          throw new Error(`Thumbnail upload failed: ${thumbnailResult.error}`);
        }
        thumbnailUrl = thumbnailResult.url;
      }

      // Upload video if file is selected
      if (videoFile) {
        const videoResult = await uploadVideo(videoFile);
        if (videoResult.error) {
          throw new Error(`Video upload failed: ${videoResult.error}`);
        }
        videoUrl = videoResult.url;
      }

      // Create video record
      await addVideo(formData.productId, {
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        description: formData.description,
        duration: formData.duration || "0:00",
        thumbnailUrl: thumbnailUrl || '/placeholder.svg',
        videoUrl: videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        productId: formData.productId,
        isNew: true,
        orderIndex: 0,
      });

      // Reset form
      onOpenChange(false);
      setFormData({
        productId: '',
        title: '',
        description: '',
        duration: '',
        videoUrl: '',
        thumbnailUrl: '',
      });
      setThumbnailPreview('');
      setThumbnailFile(null);
      setVideoFile(null);
    } catch (error) {
      console.error('Video creation failed:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to create video",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setThumbnailPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setFormData(prev => ({ ...prev, videoUrl: '' })); // Clear URL if file is selected
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Video</DialogTitle>
          <DialogDescription>
            Create a new video and assign it to a product.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product">Product *</Label>
              <Select 
                value={formData.productId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, productId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                placeholder="e.g. 5:30"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter video title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter video description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video URL</Label>
            <Input
              id="videoUrl"
              placeholder="https://www.youtube.com/embed/... or upload file below"
              value={formData.videoUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
              disabled={!!videoFile}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoFile">Or Upload Video File</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4">
              <input
                type="file"
                id="videoFile"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
              <label
                htmlFor="videoFile"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  {videoFile ? videoFile.name : "Click to upload video file"}
                </span>
                {videoFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setVideoFile(null);
                      const fileInput = document.getElementById('videoFile') as HTMLInputElement;
                      if (fileInput) fileInput.value = '';
                    }}
                  >
                    Remove file
                  </Button>
                )}
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail (16:9)</Label>
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
                    Click to upload thumbnail
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
                    alt="Thumbnail preview"
                    className="w-full h-40 object-cover rounded-lg aspect-video"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0 bg-black/50 hover:bg-black/70"
                    onClick={() => {
                      setThumbnailPreview('');
                      setThumbnailFile(null);
                      setFormData(prev => ({ ...prev, thumbnailUrl: '' }));
                    }}
                  >
                    <X className="h-4 w-4 text-white" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Add Video'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};