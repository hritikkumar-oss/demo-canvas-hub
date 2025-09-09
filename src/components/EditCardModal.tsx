import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EditFormData) => void;
  initialData: {
    title: string;
    description?: string;
    thumbnail: string;
    redirectLink?: string;
    duration?: string;
    category?: string;
    lessonCount?: number;
  };
  type: 'product' | 'video' | 'playlist';
}

export interface EditFormData {
  title: string;
  description: string;
  thumbnail: string;
  redirectLink: string;
  duration?: string;
  category?: string;
  lessonCount?: number;
}

const EditCardModal: React.FC<EditCardModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  type
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<EditFormData>({
    title: initialData.title,
    description: initialData.description || '',
    thumbnail: initialData.thumbnail,
    redirectLink: initialData.redirectLink || '',
    duration: initialData.duration,
    category: initialData.category,
    lessonCount: initialData.lessonCount
  });
  
  const [previewImage, setPreviewImage] = useState<string>(initialData.thumbnail);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleInputChange = (field: keyof EditFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
        setFormData(prev => ({ ...prev, thumbnail: result }));
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    onSave(formData);
    toast({
      title: "Changes saved",
      description: `${type} updated successfully`,
    });
    onClose();
  };

  const resetForm = () => {
    setFormData({
      title: initialData.title,
      description: initialData.description || '',
      thumbnail: initialData.thumbnail,
      redirectLink: initialData.redirectLink || '',
      duration: initialData.duration,
      category: initialData.category,
      lessonCount: initialData.lessonCount
    });
    setPreviewImage(initialData.thumbnail);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {type.charAt(0).toUpperCase() + type.slice(1)}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail</Label>
            <div 
              className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
                isDragOver ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {previewImage ? (
                <div className="relative">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="w-full aspect-video object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setPreviewImage('');
                      setFormData(prev => ({ ...prev, thumbnail: '' }));
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="mt-2 text-sm text-muted-foreground">
                    16:9 aspect ratio recommended
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop an image here, or click to select
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Recommended: 16:9 aspect ratio, JPG or PNG
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter title"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter description"
              rows={3}
            />
          </div>

          {/* Category */}
          {formData.category !== undefined && (
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="Enter category"
              />
            </div>
          )}

          {/* Duration */}
          {formData.duration !== undefined && (
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="e.g., 5:30 or 5 hours 30 minutes"
              />
            </div>
          )}

          {/* Lesson Count */}
          {formData.lessonCount !== undefined && (
            <div className="space-y-2">
              <Label htmlFor="lessonCount">Lesson Count</Label>
              <Input
                id="lessonCount"
                type="number"
                value={formData.lessonCount}
                onChange={(e) => handleInputChange('lessonCount', parseInt(e.target.value) || 0)}
                placeholder="Number of lessons"
                min="0"
              />
            </div>
          )}

          {/* Redirect Link */}
          <div className="space-y-2">
            <Label htmlFor="redirectLink">Redirect Link</Label>
            <Input
              id="redirectLink"
              value={formData.redirectLink}
              onChange={(e) => handleInputChange('redirectLink', e.target.value)}
              placeholder="e.g., /product/example or https://example.com"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCardModal;