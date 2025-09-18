import { useEffect, useState } from 'react';
import { createDemoVideos } from '@/lib/createDemoVideos';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreateDemoVideos = async () => {
    setIsCreating(true);
    try {
      await createDemoVideos();
      toast({
        title: "Success",
        description: "Demo videos created/updated successfully!",
      });
    } catch (error) {
      console.error('Error creating demo videos:', error);
      toast({
        title: "Error",
        description: "Failed to create demo videos. Check console for details.",
        variant: "destructive",
      });
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
          {isCreating ? 'Creating Demo Videos...' : 'Create Demo Videos'}
        </Button>
      </div>
    </div>
  );
};

export default Index;
