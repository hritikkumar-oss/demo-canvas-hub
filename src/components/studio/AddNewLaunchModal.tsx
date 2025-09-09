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
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Package, VideoIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddNewLaunchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddNewLaunchModal: React.FC<AddNewLaunchModalProps> = ({ open, onOpenChange }) => {
  const { products } = useData();
  const { toast } = useToast();
  const [contentType, setContentType] = useState<'product' | 'video'>('product');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState('');

  // Get all videos from all products
  const allVideos = products.flatMap(product => 
    product.videos.map(video => ({ ...video, productTitle: product.title }))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (contentType === 'product' && !selectedProductId) {
      toast({
        title: "Error",
        description: "Please select a product.",
        variant: "destructive",
      });
      return;
    }

    if (contentType === 'video' && !selectedVideoId) {
      toast({
        title: "Error", 
        description: "Please select a video.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would update the isNew flag
    const selectedItem = contentType === 'product' 
      ? products.find(p => p.id === selectedProductId)
      : allVideos.find(v => v.id === selectedVideoId);

    toast({
      title: "Added to New Launches",
      description: `"${selectedItem?.title}" has been added to New Launches.`,
    });

    onOpenChange(false);
    setSelectedProductId('');
    setSelectedVideoId('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add to New Launches</DialogTitle>
          <DialogDescription>
            Select content to feature on the New Launches page.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label>Content Type</Label>
            <RadioGroup 
              value={contentType} 
              onValueChange={(value: 'product' | 'video') => setContentType(value)}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-4">
                <RadioGroupItem value="product" id="product" />
                <Label htmlFor="product" className="flex items-center gap-2 cursor-pointer">
                  <Package className="h-4 w-4" />
                  Product
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-4">
                <RadioGroupItem value="video" id="video" />
                <Label htmlFor="video" className="flex items-center gap-2 cursor-pointer">
                  <VideoIcon className="h-4 w-4" />
                  Video
                </Label>
              </div>
            </RadioGroup>
          </div>

          {contentType === 'product' && (
            <div className="space-y-2">
              <Label htmlFor="product-select">Select Product</Label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.filter(p => !p.isNew).map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      <div className="flex items-center gap-2">
                        <img 
                          src={product.thumbnail} 
                          alt={product.title}
                          className="w-8 h-5 object-cover rounded aspect-video"
                        />
                        {product.title}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {contentType === 'video' && (
            <div className="space-y-2">
              <Label htmlFor="video-select">Select Video</Label>
              <Select value={selectedVideoId} onValueChange={setSelectedVideoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a video" />
                </SelectTrigger>
                <SelectContent>
                  {allVideos.filter(v => !v.isNew).map((video) => (
                    <SelectItem key={video.id} value={video.id}>
                      <div className="flex items-center gap-2">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-8 h-5 object-cover rounded aspect-video"
                        />
                        <div>
                          <div className="font-medium">{video.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {video.productTitle} • {video.duration}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add to New Launches</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};