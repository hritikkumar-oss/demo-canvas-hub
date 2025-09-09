import { useState } from 'react';
import { Edit2 } from 'lucide-react';
import VideoCard from '@/components/VideoCard/VideoCard';
import { Button } from '@/components/ui/button';
import EditCardModal from '@/components/EditCardModal';
import { useData } from '@/contexts/DataContext';
import { useUserRole } from '@/hooks/useUserRole';

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
}

const EditableVideoCard = (props: EditableVideoCardProps) => {
  const { isAdmin } = useUserRole();
  const { updateProduct } = useData();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleSave = (data: any) => {
    updateProduct(props.id, data);
  };

  return (
    <div className="relative group">
      <VideoCard {...props} />
      
      {isAdmin && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-white/95 opacity-0 group-hover:opacity-100 transition-opacity"
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
          category: props.category,
          duration: props.duration,
          lessonCount: props.lessonCount
        }}
        type="product"
      />
    </div>
  );
};

export default EditableVideoCard;