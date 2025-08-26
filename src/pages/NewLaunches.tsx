import { useState } from "react";
import { Play, Folder, Filter } from "lucide-react";
import Header from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { getNewLaunches } from "@/data/mockData";

const NewLaunches = () => {
  const [filter, setFilter] = useState<"all" | "products" | "videos">("all");
  const { newProducts, newVideos } = getNewLaunches();

  const filteredItems = () => {
    const items = [];
    
    if (filter === "all" || filter === "products") {
      items.push(...newProducts.map(product => ({ ...product, type: "product" as const })));
    }
    
    if (filter === "all" || filter === "videos") {
      items.push(...newVideos.map(video => ({ ...video, type: "video" as const })));
    }
    
    return items.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">New Launches</h1>
          <p className="text-muted-foreground">Discover the latest products and videos</p>
        </div>

        <div className="flex items-center space-x-4 mb-8">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>All</Button>
          <Button variant={filter === "products" ? "default" : "outline"} size="sm" onClick={() => setFilter("products")}>Products</Button>
          <Button variant={filter === "videos" ? "default" : "outline"} size="sm" onClick={() => setFilter("videos")}>Videos</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems().map((item) => (
            <Link key={`${item.type}-${item.id}`} to={item.type === "product" ? `/product/${item.id}` : `/video/${(item as any).productId}/${item.id}`}>
              <div className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-all">
                <div className="relative aspect-video bg-muted">
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">New</div>
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    {item.type === "product" ? <Folder className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" fill="currentColor" />}
                  </div>
                </div>
                <div className="p-4">
                  <Badge variant="secondary" className="text-xs mb-2">{item.type === "product" ? "Product" : "Video"}</Badge>
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewLaunches;