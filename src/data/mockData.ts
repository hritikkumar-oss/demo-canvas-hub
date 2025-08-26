// Mock data for the video platform
import gettingStartedThumb from "@/assets/thumbnails/getting-started.jpg";
import crmThumb from "@/assets/thumbnails/crm.jpg";
import ecommerceThumb from "@/assets/thumbnails/ecommerce.jpg";
import websiteThumb from "@/assets/thumbnails/website.jpg";

export interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  productId: string;
  createdAt: string;
  isNew?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverThumbnailUrl: string;
  videoCount: number;
  totalDuration: string;
  createdBy: string;
  createdAt: string;
  videos: Video[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  totalDuration: string;
  lessonCount: number;
  isNew?: boolean;
  videos: Video[];
}

// Generate mock videos for each product
const generateMockVideos = (productId: string, thumbnail: string, count: number = 10): Video[] => {
  const videoTopics = [
    "Introduction and Setup", "Basic Configuration", "Advanced Features", "Best Practices",
    "Integration Guide", "Troubleshooting", "Performance Optimization", "Security Settings",
    "Advanced Customization", "Expert Tips and Tricks"
  ];

  return Array.from({ length: Math.min(count, videoTopics.length) }, (_, index) => ({
    id: `${productId}-video-${index + 1}`,
    title: `${videoTopics[index]}`,
    description: `Learn about ${videoTopics[index].toLowerCase()} in this comprehensive tutorial`,
    duration: `${Math.floor(Math.random() * 20) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    thumbnail,
    videoUrl: `https://www.youtube.com/embed/dQw4w9WgXcQ?si=example${index}`,
    productId,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: Math.random() > 0.7
  }));
};

export const mockProducts: Product[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics of our platform with comprehensive tutorials",
    category: "Basics",
    thumbnail: gettingStartedThumb,
    totalDuration: "5 hours 57 minutes",
    lessonCount: 10,
    isNew: true,
    videos: generateMockVideos("getting-started", gettingStartedThumb)
  },
  {
    id: "crm",
    title: "CRM",
    description: "Master customer relationship management with our CRM tools",
    category: "Sales",
    thumbnail: crmThumb,
    totalDuration: "6 hours 45 minutes",
    lessonCount: 10,
    videos: generateMockVideos("crm", crmThumb)
  },
  {
    id: "ecommerce",
    title: "eCommerce",
    description: "Build and manage your online store with powerful e-commerce features",
    category: "Commerce",
    thumbnail: ecommerceThumb,
    totalDuration: "7 hours 12 minutes",
    lessonCount: 9,
    videos: generateMockVideos("ecommerce", ecommerceThumb, 9)
  },
  {
    id: "website",
    title: "Website Builder",
    description: "Create stunning websites with our drag-and-drop builder",
    category: "Design",
    thumbnail: websiteThumb,
    totalDuration: "5 hours 30 minutes",
    lessonCount: 8,
    videos: generateMockVideos("website", websiteThumb, 8)
  },
  {
    id: "accounting",
    title: "Accounting and Invoicing",
    description: "Manage your finances with integrated accounting tools",
    category: "Finance",
    thumbnail: gettingStartedThumb,
    totalDuration: "4 hours 22 minutes",
    lessonCount: 8,
    videos: generateMockVideos("accounting", gettingStartedThumb, 8)
  },
  {
    id: "inventory",
    title: "Inventory Management",
    description: "Track and manage your inventory with advanced tools",
    category: "Operations",
    thumbnail: crmThumb,
    totalDuration: "5 hours 15 minutes",
    lessonCount: 9,
    videos: generateMockVideos("inventory", crmThumb, 9)
  },
  {
    id: "pos",
    title: "Point of Sale",
    description: "Process transactions with our integrated POS system",
    category: "Sales",
    thumbnail: ecommerceThumb,
    totalDuration: "3 hours 45 minutes",
    lessonCount: 8,
    videos: generateMockVideos("pos", ecommerceThumb, 8)
  },
  {
    id: "manufacturing",
    title: "MRP - Manufacturing & Shop Floor",
    description: "Streamline your manufacturing processes",
    category: "Operations",
    thumbnail: websiteThumb,
    totalDuration: "6 hours 30 minutes",
    lessonCount: 10,
    videos: generateMockVideos("manufacturing", websiteThumb)
  }
];

export const categories = [
  { id: "all", label: "All", count: mockProducts.length },
  { id: "basics", label: "Basics", count: 1 },
  { id: "sales", label: "Sales", count: 2 },
  { id: "commerce", label: "Commerce", count: 1 },
  { id: "design", label: "Design", count: 1 },
  { id: "finance", label: "Finance", count: 1 },
  { id: "operations", label: "Operations", count: 2 }
];

// Mock playlists data
export const mockPlaylists: Playlist[] = [
  {
    id: "playlist-1",
    name: "Getting Started Collection",
    description: "Essential tutorials for new users",
    coverThumbnailUrl: gettingStartedThumb,
    videoCount: 5,
    totalDuration: "45 minutes",
    createdBy: "admin",
    createdAt: "2024-01-15T10:00:00Z",
    videos: mockProducts[0].videos.slice(0, 5)
  },
  {
    id: "playlist-2", 
    name: "Advanced Sales Tools",
    description: "Master CRM and POS systems",
    coverThumbnailUrl: crmThumb,
    videoCount: 8,
    totalDuration: "1 hour 22 minutes",
    createdBy: "admin",
    createdAt: "2024-01-20T14:30:00Z",
    videos: [...mockProducts[1].videos.slice(0, 4), ...mockProducts[5].videos.slice(0, 4)]
  }
];

// Get all videos marked as new across products
export const getNewLaunches = () => {
  const newVideos: Video[] = [];
  const newProducts: Product[] = [];
  
  mockProducts.forEach(product => {
    if (product.isNew) {
      newProducts.push(product);
    }
    product.videos.forEach(video => {
      if (video.isNew) {
        newVideos.push(video);
      }
    });
  });
  
  return { newVideos, newProducts };
};