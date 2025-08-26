import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Grid3X3, List, Search, Share2 } from "lucide-react";
import Header from "@/components/Layout/Header";
import VideoCardWithMenu from "@/components/VideoCard/VideoCardWithMenu";
import ShareModal from "@/components/ShareModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/data/mockData";

// Mock playlist data
const mockPlaylists = [
  {
    id: '1',
    name: 'Sales Training Essentials',
    description: 'Complete guide to mastering sales techniques and customer engagement strategies.',
    videoCount: 12,
    totalDuration: '2h 45m',
    thumbnail: '/src/assets/thumbnails/crm.jpg',
    videos: [
      {
        id: 'crm-setup',
        title: 'CRM Setup and Configuration',
        description: 'Learn how to set up your CRM for maximum efficiency',
        duration: '15:23',
        thumbnail: '/src/assets/thumbnails/crm.jpg',
        videoUrl: '#',
        productId: 'crm'
      },
      {
        id: 'intro-platform',
        title: 'Introduction to the Platform',
        description: 'Get familiar with the main interface and navigation',
        duration: '12:34',
        thumbnail: '/src/assets/thumbnails/getting-started.jpg',
        videoUrl: '#',
        productId: 'getting-started'
      }
    ]
  }
];

const PlaylistDetail = () => {
  const { id } = useParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const playlist = mockPlaylists.find(p => p.id === id);

  if (!playlist) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Playlist not found</h1>
          <Link to="/playlists">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Playlists
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const filteredVideos = playlist.videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6">
          <Link 
            to="/playlists" 
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Playlists
          </Link>
        </div>

        {/* Playlist Header */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-3">
                {playlist.name}
              </h1>
              <p className="text-muted-foreground mb-4 max-w-2xl">
                {playlist.description}
              </p>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <span className="font-medium">{playlist.videoCount}</span>
                  <span>videos</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-medium">{playlist.totalDuration}</span>
                  <span>total duration</span>
                </div>
              </div>
            </div>
            
            <ShareModal type="playlist" itemId={id} itemTitle={playlist.name}>
              <Button variant="outline" className="rounded-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share Playlist
              </Button>
            </ShareModal>
          </div>
        </div>

        {/* Controls */}
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
              {filteredVideos.length} videos
            </Badge>
          </div>

          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search in playlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full"
            />
          </div>
        </div>

        {/* Videos */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "No videos found matching your search." : "This playlist is empty."}
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
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-4"
          }>
            {filteredVideos.map((video) => (
              <VideoCardWithMenu
                key={video.id}
                video={video}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;