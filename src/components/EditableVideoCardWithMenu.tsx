import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoCardWithMenu from '@/components/VideoCard/VideoCardWithMenu';
import EditCardModal, { EditFormData } from '@/components/EditCardModal';
import { useAdminMode } from '@/hooks/useAdminMode';
import { useData } from '@/contexts/DataContext';
import { Video } from '@/data/mockData';

interface EditableVideoCardWithMenuProps {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  lessonCount: number;
  category: string;
  description?: string;
  isNew?: boolean;
  onClick?: () => void;
  onAddToPlaylist?: () => void;
  viewMode?: "grid" | "list";
}

const EditableVideoCardWithMenu: React.FC<EditableVideoCardWithMenuProps> = (props) => {
  const { isAdminMode } = useAdminMode();
  const { updateVideo, products } = useData();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleSave = (data: EditFormData) => {
    // Find the product that contains this video
    const product = products.find(p => 
      p.videos.some(v => v.id === props.id)
    );
    if (product) {
      updateVideo(product.id, props.id, {
        title: data.title,
        description: data.description,
        thumbnail: data.thumbnail,
        duration: data.duration || props.duration,
      });
    }
    setIsEditModalOpen(false);
  };

  return (
    <div className="relative group">
      <VideoCardWithMenu {...props} />
      
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
        type="video"
        initialData={{
          title: props.title,
          description: props.description,
          thumbnail: props.thumbnail,
          duration: props.duration,
          redirectLink: `/video/${props.id}`,
        }}
      />
    </div>
  );
};

export default EditableVideoCardWithMenu;