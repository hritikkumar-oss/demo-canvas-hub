import { Play, Clock, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  lessonCount: number;
  category: string;
  isNew?: boolean;
  onClick?: () => void;
}

const VideoCard = ({ 
  id,
  title, 
  thumbnail, 
  duration, 
  lessonCount, 
  category, 
  isNew, 
  onClick 
}: VideoCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/product/${id}`);
    }
  };
  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 animate-fade-in h-full flex flex-col"
      onClick={handleClick}
    >
      <CardContent className="p-0 flex flex-col h-full">
        {/* Thumbnail Container */}
        <div className="relative aspect-video overflow-hidden rounded-t-xl">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
              <Play className="w-6 h-6 text-primary ml-1" fill="currentColor" />
            </div>
          </div>

          {/* New Badge */}
          {isNew && (
            <div className="absolute top-3 left-3">
              <Badge variant="destructive" className="bg-hero text-hero-foreground hover:bg-hero-hover">
                New
              </Badge>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 text-foreground">
              {category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors flex-1">
            {title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>{lessonCount} lessons</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;