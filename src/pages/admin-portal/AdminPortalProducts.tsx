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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, VideoIcon, GripVertical, Undo2 } from 'lucide-react';
import AddProductModal from '@/components/AddProductModal';
import EditCardModal from '@/components/EditCardModal';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/data/mockData';
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
const SortableRow: React.FC<{ product: Product; onEdit: (product: Product) => void; onDelete: (id: string) => void }> = ({ product, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style} className={isDragging ? 'bg-muted/50' : ''}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div {...attributes} {...listeners} className="cursor-grab p-1 text-muted-foreground hover:text-foreground">
            <GripVertical className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted">
              <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-medium">{product.title}</div>
              <div className="text-sm text-muted-foreground">{product.description}</div>
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell><Badge variant="secondary">{product.category}</Badge></TableCell>
      <TableCell>{product.videos.length}</TableCell>
      <TableCell>{product.totalDuration}</TableCell>
      <TableCell>
        <Badge variant={product.isNew ? 'default' : 'secondary'}>
          {product.isNew ? 'new' : 'published'}
        </Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(product)}>
              <Edit className="mr-2 h-4 w-4" />Edit
            </DropdownMenuItem>
            <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View Videos</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(product.id)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

const AdminPortalProducts: React.FC = () => {
  const { products, deleteProduct, reorderProducts } = useData();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId);
    toast({ title: "Product deleted", description: "Product has been removed from your catalog." });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = products.findIndex((product) => product.id === active.id);
      const newIndex = products.findIndex((product) => product.id === over.id);
      reorderProducts(oldIndex, newIndex);
      toast({
        title: "Order updated successfully",
        description: "Product order has been updated. This will reflect on the Home page.",
      });
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your product catalog and tutorials - drag to reorder</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />Add Product
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Videos</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SortableContext items={filteredProducts.map(p => p.id)} strategy={verticalListSortingStrategy}>
                  {filteredProducts.map((product) => (
                    <SortableRow
                      key={product.id}
                      product={product}
                      onEdit={handleEditProduct}
                      onDelete={handleDeleteProduct}
                    />
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </CardContent>
      </Card>

      <AddProductModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
      {editingProduct && (
        <EditCardModal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={(data) => {
            // Handle save logic here
            setEditingProduct(null);
          }}
          initialData={{
            title: editingProduct.title,
            description: editingProduct.description,
            thumbnail: editingProduct.thumbnail,
            category: editingProduct.category,
            duration: editingProduct.totalDuration,
            lessonCount: editingProduct.lessonCount,
            redirectLink: `/product/${editingProduct.id}`,
          }}
          type="product"
        />
      )}
    </div>
  );
};

export default AdminPortalProducts;