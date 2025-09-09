import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface EditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData: {
    title: string;
    description: string;
    thumbnail: string;
    category?: string;
    duration?: string;
    lessonCount?: number;
    videoCount?: number;
  };
  type: 'product' | 'video' | 'playlist';
}

const EditCardModal = ({ isOpen, onClose, onSave, initialData, type }: EditCardModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleSave = () => {
    onSave(formData);
    toast({
      title: "Changes saved",
      description: `${type} has been updated successfully.`,
    });
    onClose();
  };

  const handleCancel = () => {
    setFormData(initialData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {type}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter title"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input
              id="thumbnail"
              value={formData.thumbnail}
              onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
              placeholder="Enter thumbnail URL"
            />
          </div>

          {formData.category && (
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Enter category"
              />
            </div>
          )}

          {formData.duration && (
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g., 5:30"
              />
            </div>
          )}

          {formData.lessonCount !== undefined && (
            <div>
              <Label htmlFor="lessonCount">Lesson Count</Label>
              <Input
                id="lessonCount"
                type="number"
                value={formData.lessonCount}
                onChange={(e) => setFormData(prev => ({ ...prev, lessonCount: parseInt(e.target.value) || 0 }))}
                placeholder="Enter lesson count"
              />
            </div>
          )}

          {formData.videoCount !== undefined && (
            <div>
              <Label htmlFor="videoCount">Video Count</Label>
              <Input
                id="videoCount"
                type="number"
                value={formData.videoCount}
                onChange={(e) => setFormData(prev => ({ ...prev, videoCount: parseInt(e.target.value) || 0 }))}
                placeholder="Enter video count"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCardModal;