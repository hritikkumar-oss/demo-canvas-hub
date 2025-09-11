import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const { addProduct } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    category: '',
    lessonCount: 0,
    totalDuration: ''
  });
  
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
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

    if (!formData.thumbnail) {
      toast({
        title: "Validation Error",
        description: "Thumbnail is required",
        variant: "destructive",
      });
      return;
    }

    addProduct({
      title: formData.title,
      slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      description: formData.description,
      thumbnail: formData.thumbnail,
      category: formData.category || 'General',
      lessonCount: formData.lessonCount,
      totalDuration: formData.totalDuration || '0 min',
      videos: []
    });

    toast({
      title: "Product added",
      description: "New product created successfully",
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      thumbnail: '',
      category: '',
      lessonCount: 0,
      totalDuration: ''
    });
    setPreviewImage('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail *</Label>
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
              placeholder="Enter product title"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              placeholder="Enter category (e.g., CRM, E-commerce)"
            />
          </div>

          {/* Lesson Count */}
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

          {/* Total Duration */}
          <div className="space-y-2">
            <Label htmlFor="totalDuration">Total Duration</Label>
            <Input
              id="totalDuration"
              value={formData.totalDuration}
              onChange={(e) => handleInputChange('totalDuration', e.target.value)}
              placeholder="e.g., 2 hours 30 minutes"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Add Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;