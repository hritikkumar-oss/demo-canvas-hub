import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid3X3, List, Search, Filter, Play } from 'lucide-react';
import Header from '@/components/Layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import BackButton from '@/components/BackButton';

const DemoVideos: React.FC = () => {
  const navigate = useNavigate();
  const { products } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<string>('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Flatten all videos from all products for demo videos view
  const allVideos = products.flatMap(product => 
    product.videos.map(video => ({
      ...video,
      productTitle: product.title,
      productSlug: product.slug,
      productId: product.id
    }))
  );

  // Filter videos based on search and product selection
  const filteredVideos = allVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.productTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProduct = selectedProduct === 'all' || video.productId === selectedProduct;
    
    return matchesSearch && matchesProduct;
  });

  const handleVideoClick = (video: any) => {
    navigate(`/product/${video.productSlug}/video/${video.slug}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <BackButton overridePath="/" label="Back to Home" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Demo Videos</h1>
              <p className="text-muted-foreground mt-1">
                Browse all demonstration videos across our products
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search demo videos..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={selectedProduct === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedProduct('all')}
            >
              All Products
            </Button>
            {products.map(product => (
              <Button
                key={product.id}
                variant={selectedProduct === product.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedProduct(product.id)}
                className="whitespace-nowrap"
              >
                {product.title}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredVideos.length} demo video{filteredVideos.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Videos Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <Card
                key={video.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 group"
                onClick={() => handleVideoClick(video)}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-video">
                    <img
              src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-t-lg">
                      <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Play className="w-5 h-5 text-gray-900 ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground line-clamp-2 flex-1 group-hover:text-primary transition-colors">
                        {video.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {video.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {video.productTitle}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {video.duration}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVideos.map((video) => (
              <Card
                key={video.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 group"
                onClick={() => handleVideoClick(video)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-32 h-20 flex-shrink-0">
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-full object-cover rounded"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded">
                        <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Play className="w-3 h-3 text-gray-900 ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {video.title}
                        </h3>
                        <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                          {video.duration}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {video.description}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {video.productTitle}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4">
              <Filter className="w-12 h-12 text-muted-foreground mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No demo videos found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoVideos;