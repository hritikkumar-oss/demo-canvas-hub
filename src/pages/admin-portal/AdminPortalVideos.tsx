import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Play, GripVertical, ArrowUpDown } from 'lucide-react';
import { AddVideoModal } from '@/components/admin-portal/AddVideoModal';
import EditCardModal from '@/components/EditCardModal';
import { useToast } from '@/hooks/use-toast';
import { Video } from '@/data/mockData';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Row Component
const SortableRow: React.FC<{ 
  video: Video & { productTitle: string }; 
  onEdit: (video: Video) => void; 
  onDelete: (productId: string, videoId: string) => void;
}> = ({ video, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: video.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style} key={video.id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div
            className="cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="relative">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-16 h-9 object-cover rounded aspect-video"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                <Play className="w-3 h-3 text-white fill-white" />
              </div>
            </div>
          </div>
          <div>
            <div className="font-medium line-clamp-1">{video.title}</div>
            <div className="text-sm text-muted-foreground line-clamp-1">
              {video.description}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{video.productTitle}</Badge>
      </TableCell>
      <TableCell>{video.duration}</TableCell>
      <TableCell>
        {new Date(video.createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell>
        {video.isNew && <Badge>New</Badge>}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(video)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Play className="h-4 w-4 mr-2" />
              Play
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(video.productId, video.id)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

const AdminPortalVideos: React.FC = () => {
  const { products, deleteVideo, reorderVideos } = useData();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [productSortOrder, setProductSortOrder] = useState<'asc' | 'desc' | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get all videos from all products
  const allVideos = products.flatMap(product => 
    product.videos.map(video => ({ ...video, productTitle: product.title }))
  );

  let filteredVideos = allVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProduct = selectedProduct === 'all' || video.productId === selectedProduct;
    return matchesSearch && matchesProduct;
  });

  // Apply product sorting
  if (productSortOrder) {
    filteredVideos = [...filteredVideos].sort((a, b) => {
      const comparison = a.productTitle.localeCompare(b.productTitle);
      return productSortOrder === 'asc' ? comparison : -comparison;
    });
  }

  const handleDeleteVideo = (productId: string, videoId: string) => {
    deleteVideo(productId, videoId);
    toast({
      title: "Video deleted",
      description: "Video has been removed successfully.",
    });
  };

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const activeVideo = filteredVideos.find(v => v.id === active.id);
      if (activeVideo) {
        const oldIndex = filteredVideos.findIndex(v => v.id === active.id);
        const newIndex = filteredVideos.findIndex(v => v.id === over?.id);
        
        reorderVideos(activeVideo.productId, oldIndex, newIndex);
        toast({
          title: "Video reordered",
          description: "Video order has been updated successfully.",
        });
      }
    }
  };

  const handleProductSort = () => {
    if (productSortOrder === null) {
      setProductSortOrder('asc');
    } else if (productSortOrder === 'asc') {
      setProductSortOrder('desc');
    } else {
      setProductSortOrder(null);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Videos</h1>
          <p className="text-muted-foreground mt-1">Manage all your video content</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Video
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by product" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Videos Table */}
      <Card>
        <CardContent className="p-0">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Video</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      Product
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleProductSort}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                      {productSortOrder && (
                        <span className="text-xs text-muted-foreground">
                          {productSortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SortableContext
                  items={filteredVideos.map(v => v.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredVideos.map((video) => (
                    <SortableRow
                      key={video.id}
                      video={video}
                      onEdit={handleEditVideo}
                      onDelete={handleDeleteVideo}
                    />
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddVideoModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal} 
      />
      
      {editingVideo && (
        <EditCardModal
          isOpen={true}
          onClose={() => setEditingVideo(null)}
          onSave={() => {}}
          initialData={editingVideo}
          type="video"
        />
      )}
    </div>
  );
};

export default AdminPortalVideos;