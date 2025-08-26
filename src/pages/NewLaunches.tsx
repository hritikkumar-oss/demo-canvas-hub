import { useState } from "react";
import Header from "@/components/Layout/Header";
import VideoCard from "@/components/VideoCard/VideoCard";
import { mockProducts } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";

const NewLaunches = () => {
  // Mock new products - in real app, would filter by launch date from Supabase
  const [newProducts] = useState(mockProducts.slice(0, 6));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 lg:px-8 py-6">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            New Launches
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our latest product demos and tutorials. Stay ahead with cutting-edge features and capabilities.
          </p>
        </div>

        {/* New Products Grid */}
        {newProducts.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">No New Launches Yet</h3>
              <p className="text-muted-foreground">
                Stay tuned for exciting new product releases and tutorials.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in delay-200">
            {newProducts.map((product, index) => (
              <div key={product.id} className="relative">
                <VideoCard
                  id={product.id}
                  title={product.title}
                  thumbnail={product.thumbnail}
                  duration={product.videos?.[0]?.duration || "0:00"}
                  lessonCount={product.lessonCount}
                  category={product.category}
                  isNew={true}
                />
                {/* Shiny "New" Badge */}
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-hero via-hero-hover to-hero rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-xs font-bold text-hero-foreground">NEW</span>
                    </div>
                    {/* Shine effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Looking for something specific?
          </h2>
          <p className="text-muted-foreground mb-6">
            Browse our complete library of product demos and tutorials.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Explore All Products
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewLaunches;