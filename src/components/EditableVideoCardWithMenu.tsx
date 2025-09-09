import { useState } from 'react';
import { Edit2 } from 'lucide-react';
import VideoCardWithMenu from '@/components/VideoCard/VideoCardWithMenu';
import { Button } from '@/components/ui/button';
import EditCardModal from '@/components/EditCardModal';
import { useData } from '@/contexts/DataContext';
import { useUserRole } from '@/hooks/useUserRole';

interface EditableVideoCardWithMenuProps {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  lessonCount: number;
  category: string;
  isNew?: boolean;
  onClick?: () => void;
  onAddToPlaylist?: () => void;
  viewMode?: 'grid' | 'list';
}

const EditableVideoCardWithMenu = (props: EditableVideoCardWithMenuProps) => {
  const { isAdmin } = useUserRole();
  const { updateVideo } = useData();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleSave = (data: any) => {
    const productId = props.id.split('-')[0];
    updateVideo(productId, props.id, data);
  };

  return (
    <div className="relative group">
      <VideoCardWithMenu {...props} />
      
      {isAdmin && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 left-2 h-8 w-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-white/95 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={handleEdit}
        >
          <Edit2 className="w-4 h-4 text-foreground" />
        </Button>
      )}

      <EditCardModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        initialData={{
          title: props.title,
          description: `Learn about ${props.title}`,
          thumbnail: props.thumbnail,
          duration: props.duration
        }}
        type="video"
      />
    </div>
  );
};

export default EditableVideoCardWithMenu;