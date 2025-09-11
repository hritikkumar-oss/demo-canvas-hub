
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Menu, Play, Share2, ArrowLeft } from "lucide-react";
import Header from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useData } from "@/contexts/DataContext";
import InviteModal from "@/components/InviteModal";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";

const VideoPlayer = () => {
  const { productSlug, videoSlug, productId, videoId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useUserRole();
  const { products } = useData();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  
  // Handle both new slug-based routes and legacy ID-based routes
  const product = productSlug 
    ? products.find(p => p.slug === productSlug)
    : products.find(p => p.id === productId);
  
  let video = product?.videos.find(v => 
    videoSlug ? v.slug === videoSlug : v.id === videoId
  );
  
  // If video not found, fall back to first video in product
  if (!video && product?.videos && product.videos.length > 0) {
    video = product.videos[0];
    // Update URL to match the fallback video using new slug format
    navigate(`/product/${product.slug}/video/${video.slug}`, { replace: true });
  }
  
  const currentVideoIndex = video ? product?.videos.findIndex(v => v.id === video.id) ?? 0 : 0;

  useEffect(() => {
    // Reset scroll position when component mounts
    window.scrollTo(0, 0);
  }, []);

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

  // Use existing videos from the product (they already have 8-10 mock videos)
  const lessons = product.videos;

  const handleLessonClick = (lesson: any) => {
    navigate(`/product/${product.slug}/video/${lesson.slug}`);
  };

  const handleShare = () => {
    const currentVideoSlug = videoSlug || video?.slug;
    const currentProductSlug = productSlug || product?.slug;
    const videoUrl = `${window.location.origin}/product/${currentProductSlug}/video/${currentVideoSlug}`;
    navigator.clipboard.writeText(videoUrl).then(() => {
      toast({
        title: "Link copied!",
        description: "Video link has been copied to your clipboard.",
      });
    }).catch(() => {
      // Fallback for older browsers
      setInviteModalOpen(true);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex h-[calc(100vh-80px)]">
        {/* Dark Fixed Sidebar */}
        <div className="w-80 bg-gray-900 border-r border-gray-800 flex-shrink-0 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-800 sticky top-0 z-10 bg-gray-900">
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
                    <div
                      key={lesson.id}
                      className={`cursor-pointer transition-all rounded-lg p-3 mx-2 mb-2 ${
                        (videoSlug ? lesson.slug === videoSlug : lesson.id === videoId)
                          ? 'bg-primary/20 border border-primary' 
                          : 'hover:bg-gray-800 bg-gray-800/50'
                      }`}
                      onClick={() => handleLessonClick(lesson)}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Lesson Number */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                          (videoSlug ? lesson.slug === videoSlug : lesson.id === videoId)
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-gray-700 text-gray-300'
                        }`}>
                          {index + 1}
                        </div>
                        
                        {/* Lesson Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-medium text-sm line-clamp-2 mb-1 ${
                            (videoSlug ? lesson.slug === videoSlug : lesson.id === videoId) ? 'text-primary' : 'text-white'
                          }`}>
                            {lesson.title}
                          </h4>
                          <p className="text-xs text-gray-400 mb-1 line-clamp-1">
                            {lesson.description}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <span>{lesson.duration}</span>
                            {(videoSlug ? lesson.slug === videoSlug : lesson.id === videoId) && (
                              <div className="w-1 h-1 bg-primary rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
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
                  onClick={() => navigate(`/product/${productId}`)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to {product.title}
                </Button>
              </div>
              {isAdmin && (
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Video
                </Button>
              )}
            </div>
          </div>

          {/* Video Player Container */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-5xl">
              {/* Fixed 16:9 YouTube Player */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                <iframe
                  src={video.videoUrl}
                  title={video.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleLessonClick(lessons[currentVideoIndex - 1])}
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                    )}
                    {currentVideoIndex < lessons.length - 1 && (
                      <Button 
                        size="sm"
                        onClick={() => handleLessonClick(lessons[currentVideoIndex + 1])}
                      >
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

      {/* Invite Modal for sharing */}
      <InviteModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        type="video"
        title={video.title}
        itemId={videoSlug || videoId}
      />
    </div>
  );
};

export default VideoPlayer;
