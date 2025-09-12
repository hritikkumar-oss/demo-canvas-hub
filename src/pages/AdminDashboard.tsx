import { useState } from "react";
import { Plus, Upload, Edit, Trash2, Play } from "lucide-react";
import Header from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { mockProducts } from "@/data/mockData";
import { BottomAlertDemo } from "@/components/BottomAlert/BottomAlertDemo";

interface AdminProduct {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoCount: number;
  category: string;
}

const AdminDashboard = () => {
  const [products] = useState<AdminProduct[]>(
    mockProducts.map(p => ({
      ...p,
      videoCount: p.videos?.length || 0
    }))
  );
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newProduct, setNewProduct] = useState({ title: '', description: '', category: '' });
  const [newVideo, setNewVideo] = useState({ title: '', description: '', productId: '' });
  const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '' });
  const { toast } = useToast();

  // Mock admin check - would be connected to Supabase auth
  const isAdmin = true; // This would check user role from Supabase

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const handleAddProduct = () => {
    // Would save to Supabase database
    toast({
      title: "Product created",
      description: `"${newProduct.title}" has been added successfully.`,
    });
    setNewProduct({ title: '', description: '', category: '' });
    setShowAddProduct(false);
  };

  const handleAddVideo = () => {
    // Would save to Supabase database
    toast({
      title: "Video added",
      description: `"${newVideo.title}" has been added successfully.`,
    });
    setNewVideo({ title: '', description: '', productId: '' });
    setShowAddVideo(false);
  };

  const handleCreatePlaylist = () => {
    // Would save to Supabase database
    toast({
      title: "Playlist created",
      description: `"${newPlaylist.name}" has been created successfully.`,
    });
    setNewPlaylist({ name: '', description: '' });
    setShowCreatePlaylist(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage products, videos, and playlists</p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Admin Access
          </Badge>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowAddProduct(true)}>
            <CardContent className="p-6 text-center">
              <Plus className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Add Product</h3>
              <p className="text-sm text-muted-foreground">Create a new product category</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowAddVideo(true)}>
            <CardContent className="p-6 text-center">
              <Upload className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Add Video</h3>
              <p className="text-sm text-muted-foreground">Upload a new tutorial</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowCreatePlaylist(true)}>
            <CardContent className="p-6 text-center">
              <Play className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Create Playlist</h3>
              <p className="text-sm text-muted-foreground">Organize videos into collections</p>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Alert Demo */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>BottomAlert Component Demo</CardTitle>
          </CardHeader>
          <CardContent>
            <BottomAlertDemo />
          </CardContent>
        </Card>

        {/* Products Section */}
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No products created yet.</p>
                <Button onClick={() => setShowAddProduct(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Product
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="group hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex space-x-1">
                            <Button size="sm" variant="secondary" className="h-7 w-7 p-0">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="destructive" className="h-7 w-7 p-0">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{product.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                        <span className="text-xs text-muted-foreground">{product.videoCount} videos</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Product Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="product-title">Product Name</Label>
                  <Input
                    id="product-title"
                    value={newProduct.title}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <Label htmlFor="product-description">Description</Label>
                  <Textarea
                    id="product-description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter product description"
                  />
                </div>
                <div>
                  <Label htmlFor="product-category">Category</Label>
                  <Input
                    id="product-category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Sales, Commerce, Design"
                  />
                </div>
                <div>
                  <Label>Thumbnail (16:9)</Label>
                  <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload thumbnail</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleAddProduct} className="flex-1">Create Product</Button>
                  <Button variant="outline" onClick={() => setShowAddProduct(false)} className="flex-1">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Video Modal */}
        {showAddVideo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Add New Video</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="video-product">Target Product</Label>
                  <select
                    id="video-product"
                    value={newVideo.productId}
                    onChange={(e) => setNewVideo(prev => ({ ...prev, productId: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Select a product</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>{product.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="video-title">Video Title</Label>
                  <Input
                    id="video-title"
                    value={newVideo.title}
                    onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter video title"
                  />
                </div>
                <div>
                  <Label htmlFor="video-description">Description</Label>
                  <Textarea
                    id="video-description"
                    value={newVideo.description}
                    onChange={(e) => setNewVideo(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter video description"
                  />
                </div>
                <div>
                  <Label>Video File</Label>
                  <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload video file</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleAddVideo} className="flex-1">Add Video</Button>
                  <Button variant="outline" onClick={() => setShowAddVideo(false)} className="flex-1">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create Playlist Modal */}
        {showCreatePlaylist && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Create New Playlist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="playlist-name">Playlist Name</Label>
                  <Input
                    id="playlist-name"
                    value={newPlaylist.name}
                    onChange={(e) => setNewPlaylist(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter playlist name"
                  />
                </div>
                <div>
                  <Label htmlFor="playlist-description">Description</Label>
                  <Textarea
                    id="playlist-description"
                    value={newPlaylist.description}
                    onChange={(e) => setNewPlaylist(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter playlist description"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleCreatePlaylist} className="flex-1">Create Playlist</Button>
                  <Button variant="outline" onClick={() => setShowCreatePlaylist(false)} className="flex-1">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;