import { useState } from "react";
import Header from "@/components/Layout/Header";
import VideoCard from "@/components/VideoCard/VideoCard";
import FilterTabs from "@/components/FilterTabs/FilterTabs";
import { mockProducts, categories } from "@/data/mockData";

const Home = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = [
    { id: "all", label: "All Products", count: mockProducts.length },
    { id: "sales", label: "Sales", count: 2 },
    { id: "commerce", label: "Commerce", count: 1 },
    { id: "design", label: "Design", count: 1 },
    { id: "finance", label: "Finance", count: 1 },
  ];

  const filteredProducts = mockProducts.filter(product => {
    // Search both product name and video names
    const productNameMatch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const videoNameMatch = product.videos?.some(video => 
      video.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesSearch = searchQuery === "" || productNameMatch || videoNameMatch;
    
    const matchesFilter = activeFilter === "all" || product.category.toLowerCase() === activeFilter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
     {/* Hero Section (updated background + smaller text) */}
<section className="bg-[#C5F0EE] py-20 text-center">
  <div className="container mx-auto px-4 lg:px-8">
    <h1 className="text-3xl md:text-5xl font-bold leading-snug mb-6 animate-fade-in text-slate-900">
      Which feature/Product would you like<br />
      <span className="text-slate-800/90">to know more about?</span>
    </h1>
    <p className="text-base md:text-lg text-slate-700 mb-8 max-w-xl mx-auto animate-fade-in delay-200">
      Discover comprehensive tutorials and demos for all our products. 
      Learn at your own pace with our expertly crafted video content.
    </p>
  </div>
</section>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-8 py-12">
        {/* Filter Tabs */}
        <div className="animate-fade-in delay-300">
          <FilterTabs
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            filters={filters}
          />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${(index % 8) * 100 + 400}ms` }}
            >
              <VideoCard
                id={product.id}
                title={product.title}
                thumbnail={product.thumbnail}
                duration={product.totalDuration}
                lessonCount={product.lessonCount}
                category={product.category}
                isNew={product.isNew}
              />
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
    </div>
  );
};

export default Home;