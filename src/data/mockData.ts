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
    "Advanced Customization", "Expert Tips and Tricks", "API Integration", "Data Management",
    "User Interface Design", "Mobile Optimization", "Analytics Setup", "Payment Processing"
  ];

  return Array.from({ length: Math.min(count, videoTopics.length) }, (_, index) => ({
    id: `${productId}-video-${index + 1}`,
    title: `${videoTopics[index]}`,
    description: `Learn about ${videoTopics[index].toLowerCase()} in this comprehensive tutorial. This lesson covers essential concepts and practical implementation strategies.`,
    duration: `${Math.floor(Math.random() * 20) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    thumbnail,
    videoUrl: `https://www.youtube.com/embed/dQw4w9WgXcQ?si=${productId}${index}&autoplay=0&rel=0`,
    productId,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: Math.random() > 0.7
  }));
};

// Generate specific videos for NextGen SFA
const nextGenSFALessons = [
  "Why Traditional SFA is Broken",
  "Salescode SKILL & WILL Model", 
  "Salescode Perfect Basket Model",
  "Hyper-personalised Landing Page (Home Screen)",
  "Intelligent PJP",
  "AI Generated Target",
  "AI Generated Order Tasks",
  "AI Generated Execution Tasks",
  "Task Based Incentive",
  "Hyper-personalized One-Click Order Basket",
  "Most Advanced Product Catalogue and Search",
  "Intelligent Nudges (incl backend nudge creation)",
  "Order Summary and Task Gamification",
  "AI Generated Van Loadout",
  "KPI Tracking Dashboards",
  "Incentive Dashboard",
  "Day End Summary Report",
  "Multi Media Communication Banners",
  "Personalized PICOS",
  "New Store Opportunities",
  "Store Profile",
  "IR based Merchandizing",
  "Product Returns",
  "Store Inventory Capture",
  "Asset Tracking",
  "Collections",
  "Competition Tracking",
  "Order Tracking",
  "Feedback & Support",
  "Attendance",
  "Outlet Mapping",
  "Remote Order",
  "Salescode SOCIAL for Sales Teams",
  "Multi Lingual",
  "ML Model Performance Insights",
  "3 Critical Capabilities - for creating Next Gen Systems"
];

const generateNextGenSFAVideos = (): Video[] => {
  return nextGenSFALessons.map((title, index) => ({
    id: `nextgen-sfa-video-${index + 1}`,
    title,
    description: `Learn about ${title.toLowerCase()} in this comprehensive tutorial. This lesson covers essential concepts and practical implementation strategies.`,
    duration: `${Math.floor(Math.random() * 20) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    thumbnail: gettingStartedThumb,
    videoUrl: `https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&rel=0&modestbranding=1`,
    productId: "nextgen-sfa",
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: Math.random() > 0.8
  }));
};

export const mockProducts: Product[] = [
  {
    id: "nextgen-sfa",
    title: "NextGen SFA",
    description: "Comprehensive guide to Next Generation Sales Force Automation",
    category: "Sales",
    thumbnail: gettingStartedThumb,
    totalDuration: "18 hours 30 minutes",
    lessonCount: 36,
    isNew: true,
    videos: generateNextGenSFAVideos()
  },
  {
    id: "ai-powered-eb2b",
    title: "AI powered eB2B",
    description: "AI-enhanced B2B platform for intelligent business operations",
    category: "AI/B2B",
    thumbnail: crmThumb,
    totalDuration: "6 hours 45 minutes",
    lessonCount: 10,
    videos: generateMockVideos("ai-powered-eb2b", crmThumb)
  },
  {
    id: "nextgen-dms",
    title: "NextGen DMS",
    description: "Document Management System with advanced features",
    category: "Document Management",
    thumbnail: ecommerceThumb,
    totalDuration: "7 hours 12 minutes",
    lessonCount: 9,
    videos: generateMockVideos("nextgen-dms", ecommerceThumb, 9)
  },
  {
    id: "scai-ai-agent",
    title: "SCAI - AI Agent",
    description: "Smart Customer AI Agent for automated support",
    category: "AI/Customer Service",
    thumbnail: websiteThumb,
    totalDuration: "5 hours 30 minutes",
    lessonCount: 8,
    videos: generateMockVideos("scai-ai-agent", websiteThumb, 8)
  },
  {
    id: "ai-promo-co-pilot",
    title: "AI promo co-pilot",
    description: "AI-powered promotional campaign management and optimization",
    category: "AI/Marketing",
    thumbnail: gettingStartedThumb,
    totalDuration: "4 hours 22 minutes",
    lessonCount: 8,
    videos: generateMockVideos("ai-promo-co-pilot", gettingStartedThumb, 8)
  },
  {
    id: "supervisor",
    title: "Supervisor",
    description: "Comprehensive supervision and management platform",
    category: "Management",
    thumbnail: crmThumb,
    totalDuration: "5 hours 15 minutes",
    lessonCount: 9,
    videos: generateMockVideos("supervisor", crmThumb, 9)
  },
  {
    id: "sales-lens",
    title: "Sales Lens",
    description: "Advanced sales analytics and performance insights",
    category: "Sales Analytics",
    thumbnail: ecommerceThumb,
    totalDuration: "3 hours 45 minutes",
    lessonCount: 8,
    videos: generateMockVideos("sales-lens", ecommerceThumb, 8)
  },
  {
    id: "salescode-studio",
    title: "Salescode Studio",
    description: "Integrated development environment for sales automation",
    category: "Development",
    thumbnail: websiteThumb,
    totalDuration: "6 hours 30 minutes",
    lessonCount: 10,
    videos: generateMockVideos("salescode-studio", websiteThumb)
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
    id: "1",
    name: "Getting Started Collection", 
    description: "Essential tutorials for new users to get up and running quickly",
    coverThumbnailUrl: gettingStartedThumb,
    videoCount: 5,
    totalDuration: "45 minutes",
    createdBy: "admin",
    createdAt: "2024-01-15T10:00:00Z",
    videos: mockProducts[0].videos.slice(0, 5)
  },
  {
    id: "2", 
    name: "Advanced Sales Tools",
    description: "Master CRM and POS systems for maximum sales efficiency",
    coverThumbnailUrl: crmThumb,
    videoCount: 8,
    totalDuration: "1 hour 22 minutes",
    createdBy: "admin", 
    createdAt: "2024-01-20T14:30:00Z",
    videos: [...mockProducts[1].videos.slice(0, 4), ...mockProducts[6].videos.slice(0, 4)]
  },
  {
    id: "3",
    name: "eCommerce Mastery",
    description: "Complete guide to building and managing your online store",
    coverThumbnailUrl: ecommerceThumb,
    videoCount: 6,
    totalDuration: "58 minutes",
    createdBy: "admin",
    createdAt: "2024-01-25T09:15:00Z", 
    videos: mockProducts[2].videos.slice(0, 6)
  },
  {
    id: "4",
    name: "Website Design Fundamentals", 
    description: "Learn to create stunning websites with drag-and-drop tools",
    coverThumbnailUrl: websiteThumb,
    videoCount: 7,
    totalDuration: "1 hour 12 minutes",
    createdBy: "admin",
    createdAt: "2024-02-01T16:45:00Z",
    videos: mockProducts[3].videos.slice(0, 7)
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