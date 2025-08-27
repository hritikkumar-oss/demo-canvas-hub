import { useState } from "react";
import { Play, Folder, Filter } from "lucide-react";
import Header from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { getNewLaunches } from "@/data/mockData";

const NewLaunches = () => {
  const { newProducts, newVideos } = getNewLaunches();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">New Launches</h1>
          <p className="text-muted-foreground">Discover the latest products and videos</p>
        </div>

        {/* Products Section */}
        {newProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <div className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-all">
                    <div className="relative aspect-video bg-muted">
                      <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">New</div>
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Folder className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="p-4">
                      <Badge variant="secondary" className="text-xs mb-2">Product</Badge>
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{product.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Videos Section */}
        {newVideos.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {newVideos.map((video) => (
                <Link key={video.id} to={`/video/${video.productId}/${video.id}`}>
                  <div className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-all">
                    <div className="relative aspect-video bg-muted">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">New</div>
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="w-6 h-6 text-white" fill="currentColor" />
                      </div>
                    </div>
                    <div className="p-4">
                      <Badge variant="secondary" className="text-xs mb-2">Video</Badge>
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{video.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {newProducts.length === 0 && newVideos.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No new launches yet</h3>
            <p className="text-muted-foreground">Check back soon for the latest updates</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewLaunches;