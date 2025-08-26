import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Layout/Header";
import VideoCardWithMenu from "@/components/VideoCard/VideoCardWithMenu";
import PlaylistModal from "@/components/PlaylistModal/PlaylistModal";
import { Button } from "@/components/ui/button";
import { mockProducts } from "@/data/mockData";
import { ArrowLeft, Share2, Play, Grid3X3, List, LayoutGrid } from "lucide-react";

const ProductDetail = () => {
  const { productId } = useParams();
  const product = mockProducts.find(p => p.id === productId);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [selectedVideoForPlaylist, setSelectedVideoForPlaylist] = useState<{id: string, title: string} | null>(null);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-hero/10 py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-6">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share Product
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in">
                  {product.title}
                </h1>
                <p className="text-xl text-muted-foreground mb-6 animate-fade-in delay-200">
                  {product.description}
                </p>
                <div className="flex items-center space-x-6 text-sm text-muted-foreground animate-fade-in delay-300">
                  <span>{product.totalDuration}</span>
                  <span>{product.lessonCount} lessons</span>
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
              </div>
              
              <div className="relative animate-fade-in delay-400">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full aspect-video object-cover rounded-xl shadow-lg"
                />
                <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center group hover:bg-black/30 transition-colors cursor-pointer">
                  <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-primary ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lessons Grid */}
      <main className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-foreground">
              Lessons & Tutorials
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="w-4 h-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </Button>
            </div>
          </div>
          
          {product.videos.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {product.videos.map((video, index) => (
                <div
                  key={video.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100 + 200}ms` }}
                >
                  <VideoCardWithMenu
                    video={video}
                    viewMode={viewMode}
                    productSlug={product.id}
                    videoSlug={video.id}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 animate-fade-in">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Coming Soon
                </h3>
                <p className="text-muted-foreground">
                  We're working hard to bring you amazing tutorials for {product.title}. 
                  Check back soon for updates!
                </p>
                <Button variant="outline" className="mt-4">
                  Notify Me
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Playlist Modal */}
      {selectedVideoForPlaylist && (
        <PlaylistModal
          isOpen={playlistModalOpen}
          onClose={() => {
            setPlaylistModalOpen(false);
            setSelectedVideoForPlaylist(null);
          }}
          videoId={selectedVideoForPlaylist.id}
          videoTitle={selectedVideoForPlaylist.title}
        />
      )}
    </div>
  );
};

export default ProductDetail;