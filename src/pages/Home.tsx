import { useState, useEffect } from "react";
import Header from "@/components/Layout/Header";
import VideoCard from "@/components/VideoCard/VideoCard";
import EditableVideoCard from "@/components/EditableVideoCard";
import FilterTabs from "@/components/FilterTabs/FilterTabs";
import { generateFilterTabs } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Grid, List, Plus } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useAdminMode } from "@/hooks/useAdminMode";
import AddProductModal from "@/components/AddProductModal";

const Home = () => {
  const { products } = useData();
  const { isAdminMode } = useAdminMode();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  useEffect(() => {
    // Reset scroll position when component mounts
    window.scrollTo(0, 0);
  }, []);

  const filters = generateFilterTabs(products);

  const filteredProducts = products.filter(product => {
    // Search both product name and video names
    const productNameMatch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const videoNameMatch = product.videos?.some(video => 
      video.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesSearch = searchQuery === "" || productNameMatch || videoNameMatch;
    
    const matchesFilter = activeFilter === "all" || product.category.toLowerCase() === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      {/* Hero Section */}
<section className="bg-gradient-to-br from-primary via-hero to-primary-hover text-white py-16">
  <div className="container mx-auto px-4 lg:px-8 text-center">
    <h1 className="text-3xl md:text-5xl mb-6 animate-fade-in">
      <span className="font-bold">Which feature/Product would you like</span><br />
      <span className="font-normal text-white/90">to know more about?</span>
    </h1>
    <p className="text-base md:text-lg text-white/80 mb-8 max-w-xl mx-auto animate-fade-in delay-200">
      Discover comprehensive tutorials and demos for all our products. 
      Learn at your own pace with our expertly crafted video content.
    </p>
  </div>
</section>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-8 py-12">
        {/* Filter Tabs and View Toggle */}
        <div className="animate-fade-in delay-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <FilterTabs
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              filters={filters}
            />
            
            {/* Add Product Button and View Mode Toggle */}
            <div className="flex items-center gap-4">
              {isAdminMode && (
                <Button 
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="rounded-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">View:</span>
                <div className="flex border rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid/List */}
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
          : "flex flex-col gap-4"
        }>
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${(index % 8) * 100 + 400}ms` }}
            >
              {isAdminMode ? (
                <EditableVideoCard
                  id={product.id}
                  slug={product.slug}
                  title={product.title}
                  thumbnail={product.thumbnail}
                  duration={product.totalDuration}
                  lessonCount={product.lessonCount}
                  category={product.category}
                  description={product.description}
                  isNew={product.isNew}
                  viewMode={viewMode}
                />
              ) : (
                <VideoCard
                  id={product.id}
                  slug={product.slug}
                  title={product.title}
                  thumbnail={product.thumbnail}
                  duration={product.totalDuration}
                  lessonCount={product.lessonCount}
                  category={product.category}
                  isNew={product.isNew}
                  viewMode={viewMode}
                />
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </main>

      {/* Bottom CTA Section */}
      <section className="bg-gradient-to-r from-hero to-primary text-white py-16 mt-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sales Uplift Guaranteed !!
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-md mx-auto">
            The new 'Code' of CPG sales
          </p>
          <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-3 rounded-full font-medium hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
            GET A DEMO
          </button>
        </div>
      </section>

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
      />
    </div>
  );
};

export default Home;