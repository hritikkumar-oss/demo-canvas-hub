import { useState } from "react";
import { Grid3X3, List, Search } from "lucide-react";
import Header from "@/components/Layout/Header";
import VideoCard from "@/components/VideoCard/VideoCard";
import FilterTabs from "@/components/FilterTabs/FilterTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/data/mockData";

// Mock new launches data - mix of products and individual videos
const newLaunches = [
  // New products
  ...mockProducts.filter(p => p.isNew),
  // New individual videos (could be from any product)
  {
    id: "new-video-1",
    title: "Advanced CRM Analytics Dashboard",
    description: "Explore the new analytics dashboard features",
    category: "Sales",
    thumbnail: "/src/assets/thumbnails/crm.jpg",
    totalDuration: "18:45",
    lessonCount: 1,
    isNew: true,
    type: "video", // Individual video
    videos: []
  },
  {
    id: "new-video-2", 
    title: "Quick Setup Guide for E-commerce",
    description: "Get your store running in under 10 minutes",
    category: "Commerce",
    thumbnail: "/src/assets/thumbnails/ecommerce.jpg",
    totalDuration: "9:30",
    lessonCount: 1,
    isNew: true,
    type: "video",
    videos: []
  }
];

const categories = [
  { id: "all", label: "All", count: newLaunches.length },
  { id: "products", label: "Products", count: newLaunches.filter((item: any) => item.type !== "video").length },
  { id: "videos", label: "Videos", count: newLaunches.filter((item: any) => item.type === "video").length },
  { id: "sales", label: "Sales", count: newLaunches.filter((item: any) => item.category === "Sales").length },
  { id: "commerce", label: "Commerce", count: newLaunches.filter((item: any) => item.category === "Commerce").length },
];

const NewLaunches = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["all"]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryToggle = (categoryId: string) => {
    if (categoryId === "all") {
      setSelectedCategories(["all"]);
    } else {
      const newCategories = selectedCategories.includes("all") 
        ? [categoryId]
        : selectedCategories.includes(categoryId)
          ? selectedCategories.filter(id => id !== categoryId)
          : [...selectedCategories.filter(id => id !== "all"), categoryId];
      
      setSelectedCategories(newCategories.length === 0 ? ["all"] : newCategories);
    }
  };

  const filteredLaunches = newLaunches.filter((item: any) => {
    const matchesCategory = selectedCategories.includes("all") || 
      selectedCategories.some(cat => 
        cat === "products" && item.type !== "video" ||
        cat === "videos" && item.type === "video" ||
        cat.toLowerCase() === item.category.toLowerCase()
      );
    
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleCardClick = (item: any) => {
    if (item.type === "video") {
      // Navigate to video player for individual videos
      window.location.href = `/video/new-launches/${item.id}`;
    } else {
      // Navigate to product detail page for products
      window.location.href = `/product/${item.id}`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 lg:px-8 py-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              New Launches
            </h1>
            <p className="text-muted-foreground">
              Discover the latest products and videos added to our platform
            </p>
          </div>
          <Badge variant="secondary" className="bg-hero text-hero-foreground">
            {filteredLaunches.length} New Items
          </Badge>
        </div>

        {/* Filters */}
        <FilterTabs
          activeFilter={selectedCategories[0] || "all"}
          onFilterChange={handleCategoryToggle}
          filters={categories}
        />

        {/* View Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <Badge variant="secondary">
              {filteredLaunches.length} items
            </Badge>
          </div>

          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search new launches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full"
            />
          </div>
        </div>

        {/* Content */}
        {filteredLaunches.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "No new launches found matching your search." : "No new launches available."}
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in delay-200" 
              : "space-y-4 animate-fade-in delay-200"
          }>
            {filteredLaunches.map((item: any) => (
              <VideoCard
                key={item.id}
                id={item.id}
                title={item.title}
                thumbnail={item.thumbnail}
                duration={item.totalDuration}
                lessonCount={item.lessonCount}
                category={item.category}
                isNew={item.isNew}
                onClick={() => handleCardClick(item)}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewLaunches;