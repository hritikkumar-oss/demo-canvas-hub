import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Play, Share2, ArrowLeft } from "lucide-react";
import Header from "@/components/Layout/Header";
import ShareModal from "@/components/ShareModal";
import PlaylistModal from "@/components/PlaylistModal/PlaylistModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockProducts } from "@/data/mockData";

const VideoPlayer = () => {
  const { productSlug, videoSlug } = useParams();
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  
  const product = mockProducts.find(p => p.id === productSlug);
  const video = product?.videos.find(v => v.id === videoSlug);
  const currentVideoIndex = product?.videos.findIndex(v => v.id === videoSlug) ?? 0;

  if (!product || !video) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Video not found</h1>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Generate mock lessons (8-10 per product)
  const lessons = product.videos.concat([
    { 
      id: 'lesson-1', 
      title: 'Advanced Configuration Settings', 
      description: 'Learn how to customize advanced settings', 
      duration: '12:45', 
      thumbnail: product.thumbnail,
      videoUrl: '',
      productId: product.id
    },
    { 
      id: 'lesson-2', 
      title: 'Integration Best Practices', 
      description: 'Best practices for seamless integration', 
      duration: '15:30', 
      thumbnail: product.thumbnail,
      videoUrl: '',
      productId: product.id
    },
    { 
      id: 'lesson-3', 
      title: 'Troubleshooting Common Issues', 
      description: 'Solutions to frequently encountered problems', 
      duration: '18:20', 
      thumbnail: product.thumbnail,
      videoUrl: '',
      productId: product.id
    },
    { 
      id: 'lesson-4', 
      title: 'Performance Optimization', 
      description: 'Tips to maximize system performance', 
      duration: '14:15', 
      thumbnail: product.thumbnail,
      videoUrl: '',
      productId: product.id
    },
    { 
      id: 'lesson-5', 
      title: 'Security Configuration', 
      description: 'Setting up secure access and permissions', 
      duration: '16:45', 
      thumbnail: product.thumbnail,
      videoUrl: '',
      productId: product.id
    },
    { 
      id: 'lesson-6', 
      title: 'Advanced Reporting Features', 
      description: 'Generate comprehensive reports and analytics', 
      duration: '20:30', 
      thumbnail: product.thumbnail,
      videoUrl: '',
      productId: product.id
    }
  ]).slice(0, 10);

  const handleLessonClick = (lessonId: string) => {
    // Would navigate to the selected lesson
    console.log(`Navigate to lesson: ${lessonId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex h-[calc(100vh-80px)]">
        {/* Fixed Dark Sidebar */}
        <div className="w-80 bg-gray-900 border-r border-gray-700 overflow-hidden flex-shrink-0">
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-700 bg-gray-800/50 sticky top-0 z-10">
              <h2 className="font-semibold text-white truncate">
                {product.title}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {lessons.length} lessons
              </p>
            </div>

            {/* Lessons List */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-2 space-y-2">
                {lessons.map((lesson, index) => (
                    <Card
                      key={lesson.id}
                      className={`cursor-pointer transition-all hover:shadow-sm bg-gray-800 border-gray-700 ${
                        lesson.id === videoSlug 
                          ? 'border-primary bg-primary/20' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => handleLessonClick(lesson.id)}
                    >
                    <CardContent className="p-3">
                      <div className="flex items-start space-x-3">
                        {/* Lesson Number */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                          lesson.id === videoSlug 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-gray-700 text-gray-300'
                        }`}>
                          {index + 1}
                        </div>
                        
                        {/* Lesson Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-medium text-sm line-clamp-2 mb-1 ${
                            lesson.id === videoSlug ? 'text-primary' : 'text-white'
                          }`}>
                            {lesson.title}
                          </h4>
                          <p className="text-xs text-gray-400 mb-1 line-clamp-1">
                            {lesson.description}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <span>{lesson.duration}</span>
                            {lesson.id === videoSlug && (
                              <div className="w-1 h-1 bg-primary rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>


        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Header */}
          <div className="p-4 border-b bg-background/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to {product.title}
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <ShareModal type="video" itemId={videoSlug} itemTitle={video.title}>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Video
                  </Button>
                </ShareModal>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowPlaylistModal(true)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Add to Playlist
                </Button>
              </div>
            </div>
          </div>

          {/* Video Player Container */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-5xl">
              {/* Fixed 16:9 Video Player */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                {/* Placeholder for video player */}
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Video Overlay with YouTube-style player */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto cursor-pointer hover:bg-white/30 transition-colors">
                      <Play className="w-12 h-12 ml-1" fill="currentColor" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                    <p className="text-sm opacity-80">
                      YouTube embed would go here
                    </p>
                    <p className="text-xs opacity-60 mt-2">
                      Duration: {video.duration}
                    </p>
                  </div>
                </div>

                {/* Video Progress Bar (mock) */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div className="w-1/3 h-full bg-primary"></div>
                </div>
              </div>

              {/* Video Info */}
              <div className="mt-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {video.title}
                </h1>
                <p className="text-muted-foreground mb-4">
                  {video.description}
                </p>
                
                {/* Navigation Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Lesson {currentVideoIndex + 1} of {lessons.length}</span>
                    <span>Part of: {product.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {currentVideoIndex > 0 && (
                      <Button variant="outline" size="sm">
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                    )}
                    {currentVideoIndex < lessons.length - 1 && (
                      <Button size="sm">
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PlaylistModal
        isOpen={showPlaylistModal}
        onClose={() => setShowPlaylistModal(false)}
        videoId={videoSlug || ''}
        videoTitle={video.title}
      />
    </div>
  );
};

export default VideoPlayer;