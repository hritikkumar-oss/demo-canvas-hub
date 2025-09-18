import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createDemoVideos } from "@/lib/createDemoVideos";
import { toast } from "sonner";

const Index = () => {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateDemoVideos = async () => {
    try {
      setIsCreating(true);
      toast.info("Creating demo videos...");
      
      const result = await createDemoVideos();
      
      if (result.success) {
        toast.success("Demo videos created successfully!");
        console.log("Results:", result.results);
      } else {
        toast.error("Failed to create demo videos");
      }
    } catch (error) {
      console.error("Error creating demo videos:", error);
      toast.error("Error creating demo videos");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Blank App</h1>
        <p className="text-xl text-muted-foreground mb-8">Start building your amazing project here!</p>
        
        <Button 
          onClick={handleCreateDemoVideos}
          disabled={isCreating}
          className="mb-4"
        >
          {isCreating ? "Creating Demo Videos..." : "Create Demo Videos"}
        </Button>
      </div>
    </div>
  );
};

export default Index;
