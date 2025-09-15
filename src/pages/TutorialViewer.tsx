import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockProducts } from "@/data/mockData";
import { ArrowLeft, Share2, Play, Pause, Volume2, Maximize, SkipForward, SkipBack } from "lucide-react";
import BackButton from "@/components/BackButton";

const TutorialViewer = () => {
  const { productId, videoId } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  
  const product = mockProducts.find(p => p.id === productId);
  const video = product?.videos.find(v => v.id === videoId);
  const currentVideoIndex = product?.videos.findIndex(v => v.id === videoId) ?? 0;

  useEffect(() => {
    // Reset scroll position when component mounts
    window.scrollTo(0, 0);
  }, []);

  if (!product || !video) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Tutorial not found</h1>
          <BackButton fallbackPath="/demo-videos" label="Go Back" variant="outline" />
        </div>
      </div>
    );
  }

  const nextVideo = product.videos[currentVideoIndex + 1];
  const prevVideo = product.videos[currentVideoIndex - 1];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 lg:px-8 py-6">
        {/* Breadcrumb and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <BackButton 
              fallbackPath="/demo-videos" 
              label={`Back to Demo Videos`}
            />
          </div>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share Tutorial
          </Button>
        </div>

        {/* Main Content - 70/30 Split */}
        <div className="grid lg:grid-cols-10 gap-6">
          {/* Video Player - 70% */}
          <div className="lg:col-span-7">
            <Card className="overflow-hidden animate-fade-in">
              <CardContent className="p-0">
                {/* Video Container */}
                <div className="relative aspect-video bg-black">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Video Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto">
                        {isPlaying ? (
                          <Pause className="w-10 h-10" />
                        ) : (
                          <Play className="w-10 h-10 ml-1" fill="currentColor" />
                        )}
                      </div>
                      <p className="text-sm opacity-80">Video Player</p>
                      <p className="text-xs opacity-60 mt-1">
                        Connect to Supabase to enable video playback
                      </p>
                    </div>
                  </div>

                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:text-white hover:bg-white/20"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </Button>
                        <div className="flex items-center space-x-2">
                          <Volume2 className="w-4 h-4" />
                          <div className="w-16 h-1 bg-white/30 rounded-full">
                            <div className="w-10 h-1 bg-white rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">0:00 / {video.duration}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:text-white hover:bg-white/20"
                        >
                          <Maximize className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-white/30 rounded-full mt-2">
                      <div className="w-1/4 h-1 bg-primary rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {video.title}
                  </h1>
                  <p className="text-muted-foreground mb-4">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Duration: {video.duration}</span>
                      <span>Part of: {product.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {prevVideo && (
                        <Button variant="outline" size="sm">
                          <SkipBack className="w-4 h-4 mr-2" />
                          Previous
                        </Button>
                      )}
                      {nextVideo && (
                        <Button variant="default" size="sm">
                          Next
                          <SkipForward className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lesson Sidebar - 30% */}
          <div className="lg:col-span-3">
            <Card className="animate-fade-in delay-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-4">
                  Course Lessons
                </h3>
                <div className="space-y-3">
                  {product.videos.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:border-primary ${
                        lesson.id === videoId 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:bg-muted/50'
                      }`}
                      onClick={() => {
                        // Navigate to this lesson
                        console.log(`Navigate to lesson: ${lesson.id}`);
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          lesson.id === videoId 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-foreground line-clamp-2 mb-1">
                            {lesson.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {lesson.duration}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {product.videos.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No lessons available yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialViewer;