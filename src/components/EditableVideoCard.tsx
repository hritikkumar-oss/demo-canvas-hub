import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoCard from '@/components/VideoCard/VideoCard';
import EditCardModal, { EditFormData } from '@/components/EditCardModal';
import { useAdminMode } from '@/hooks/useAdminMode';
import { useData } from '@/contexts/DataContext';

interface EditableVideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  lessonCount: number;
  category: string;
  description?: string;
  isNew?: boolean;
  onClick?: () => void;
  viewMode?: "grid" | "list";
}

const EditableVideoCard: React.FC<EditableVideoCardProps> = (props) => {
  const { isAdminMode } = useAdminMode();
  const { updateProduct } = useData();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleSave = (data: EditFormData) => {
    updateProduct(props.id, {
      title: data.title,
      description: data.description,
      thumbnail: data.thumbnail,
      category: data.category || props.category,
      totalDuration: data.duration || props.duration,
      lessonCount: data.lessonCount || props.lessonCount,
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="relative group">
      <VideoCard {...props} />
      
      {isAdminMode && (
        <Button
          size="sm"
          variant="secondary"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 shadow-lg"
          onClick={handleEdit}
        >
          <Edit className="w-4 h-4" />
        </Button>
      )}

      <EditCardModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        type="product"
        initialData={{
          title: props.title,
          description: props.description,
          thumbnail: props.thumbnail,
          category: props.category,
          duration: props.duration,
          lessonCount: props.lessonCount,
          redirectLink: `/product/${props.id}`,
        }}
      />
    </div>
  );
};

export default EditableVideoCard;