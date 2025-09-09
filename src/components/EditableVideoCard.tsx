import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoCard from '@/components/VideoCard/VideoCard';
import EditCardModal, { EditFormData } from '@/components/EditCardModal';
import { useData } from '@/contexts/DataContext';

interface EditableVideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  lessonCount: number;
  category: string;
  isNew?: boolean;
  onClick?: () => void;
  viewMode?: "grid" | "list";
  isAdmin?: boolean;
}

const EditableVideoCard = (props: EditableVideoCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { updateProduct } = useData();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleSave = (data: EditFormData) => {
    updateProduct(props.id, {
      title: data.title,
      description: data.description,
      thumbnail: data.thumbnail
    });
  };

  return (
    <div className="relative group">
      <VideoCard {...props} />
      
      {props.isAdmin && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-white/95 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={handleEdit}
        >
          <Pencil className="w-4 h-4 text-foreground" />
        </Button>
      )}

      <EditCardModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        initialData={{
          title: props.title,
          description: '',
          thumbnail: props.thumbnail,
          redirectUrl: `/product/${props.id}`
        }}
        type="product"
      />
    </div>
  );
};

export default EditableVideoCard;