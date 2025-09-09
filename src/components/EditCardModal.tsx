import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface EditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EditFormData) => void;
  initialData: {
    title: string;
    description?: string;
    thumbnail: string;
    redirectUrl?: string;
  };
  type: 'product' | 'video' | 'playlist';
}

export interface EditFormData {
  title: string;
  description: string;
  thumbnail: string;
  redirectUrl: string;
}

const EditCardModal = ({ isOpen, onClose, onSave, initialData, type }: EditCardModalProps) => {
  const [formData, setFormData] = useState<EditFormData>({
    title: initialData.title || '',
    description: initialData.description || '',
    thumbnail: initialData.thumbnail || '',
    redirectUrl: initialData.redirectUrl || ''
  });
  const { toast } = useToast();

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    toast({
      title: "Changes saved",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`
    });
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      title: initialData.title || '',
      description: initialData.description || '',
      thumbnail: initialData.thumbnail || '',
      redirectUrl: initialData.redirectUrl || ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Edit {type.charAt(0).toUpperCase() + type.slice(1)}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title / Header Text</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter title"
            />
          </div>

          <div>
            <Label htmlFor="description">Body / Description Text</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="thumbnail">Thumbnail (URL)</Label>
            <Input
              id="thumbnail"
              value={formData.thumbnail}
              onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
              placeholder="Enter thumbnail URL"
            />
          </div>

          <div>
            <Label htmlFor="redirectUrl">Redirect Link (URL)</Label>
            <Input
              id="redirectUrl"
              value={formData.redirectUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, redirectUrl: e.target.value }))}
              placeholder="Enter redirect URL"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCardModal;