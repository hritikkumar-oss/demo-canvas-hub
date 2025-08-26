import { useState } from "react";
import { Play, Clock, BookOpen } from "lucide-react";
import Header from "@/components/Layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Playlist {
  id: string;
  name: string;
  description: string;
  videoCount: number;
  totalDuration: string;
  thumbnail: string;
  createdAt: string;
}

const Playlists = () => {
  // Mock playlists - would come from Supabase
  const [playlists] = useState<Playlist[]>([
    {
      id: '1',
      name: 'Sales Training Essentials',
      description: 'Complete guide to mastering sales techniques and customer engagement strategies.',
      videoCount: 12,
      totalDuration: '2h 45m',
      thumbnail: '/src/assets/thumbnails/crm.jpg',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Product Demo Collection',
      description: 'Customer-facing demonstrations showcasing key product features and benefits.',
      videoCount: 8,
      totalDuration: '1h 30m',
      thumbnail: '/src/assets/thumbnails/ecommerce.jpg',
      createdAt: '2024-01-20'
    },
    {
      id: '3',
      name: 'Onboarding Series',
      description: 'Step-by-step tutorials for new users to get started quickly and effectively.',
      videoCount: 15,
      totalDuration: '3h 20m',
      thumbnail: '/src/assets/thumbnails/getting-started.jpg',
      createdAt: '2024-01-25'
    },
    {
      id: '4',
      name: 'Advanced Features',
      description: 'Deep dive into advanced functionality and power user features.',
      videoCount: 6,
      totalDuration: '1h 15m',
      thumbnail: '/src/assets/thumbnails/website.jpg',
      createdAt: '2024-01-30'
    }
  ]);

  const handlePlaylistClick = (playlistId: string) => {
    // Would navigate to playlist detail page
    console.log(`Navigate to playlist: ${playlistId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 lg:px-8 py-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My Playlists
            </h1>
            <p className="text-muted-foreground">
              Organize and access your curated video collections
            </p>
          </div>
          <Button className="rounded-full">
            <Play className="w-4 h-4 mr-2" />
            Create Playlist
          </Button>
        </div>

        {/* Playlists Grid */}
        {playlists.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-12 text-center">
              <Play className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Playlists Yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first playlist to organize your favorite videos.
              </p>
              <Button className="rounded-full">
                <Play className="w-4 h-4 mr-2" />
                Create Your First Playlist
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in delay-200">
            {playlists.map((playlist) => (
              <Card
                key={playlist.id}
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 h-full flex flex-col"
                onClick={() => handlePlaylistClick(playlist.id)}
              >
                <CardContent className="p-0 flex flex-col h-full">
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video overflow-hidden rounded-t-xl">
                    <img
                      src={playlist.thumbnail}
                      alt={playlist.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                        <Play className="w-6 h-6 text-primary ml-1" fill="currentColor" />
                      </div>
                    </div>

                    {/* Video Count Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-black/70 text-white border-0">
                        {playlist.videoCount} videos
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors flex-1">
                      {playlist.name}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {playlist.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{playlist.totalDuration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{playlist.videoCount} videos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Section */}
        {playlists.length > 0 && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {playlists.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Playlists</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {playlists.reduce((acc, playlist) => acc + playlist.videoCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Videos</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  8h 50m
                </div>
                <div className="text-sm text-muted-foreground">Total Duration</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlists;