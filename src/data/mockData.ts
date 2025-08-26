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

export const mockProducts: Product[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics of our platform with comprehensive tutorials",
    category: "Basics",
    thumbnail: gettingStartedThumb,
    totalDuration: "5 hours 57 minutes",
    lessonCount: 30,
    isNew: true,
    videos: [
      {
        id: "intro-platform",
        title: "Introduction to the Platform",
        description: "Get familiar with the main interface and navigation",
        duration: "12:34",
        thumbnail: gettingStartedThumb,
        videoUrl: "#",
        productId: "getting-started"
      },
      {
        id: "first-steps",
        title: "Your First Steps",
        description: "Setting up your account and basic configuration",
        duration: "8:45",
        thumbnail: gettingStartedThumb,
        videoUrl: "#",
        productId: "getting-started"
      }
    ]
  },
  {
    id: "crm",
    title: "CRM",
    description: "Master customer relationship management with our CRM tools",
    category: "Sales",
    thumbnail: crmThumb,
    totalDuration: "5 hours 57 minutes",
    lessonCount: 30,
    videos: [
      {
        id: "crm-setup",
        title: "CRM Setup and Configuration",
        description: "Learn how to set up your CRM for maximum efficiency",
        duration: "15:23",
        thumbnail: crmThumb,
        videoUrl: "#",
        productId: "crm"
      }
    ]
  },
  {
    id: "ecommerce",
    title: "eCommerce",
    description: "Build and manage your online store with powerful e-commerce features",
    category: "Commerce",
    thumbnail: ecommerceThumb,
    totalDuration: "5 hours 57 minutes",
    lessonCount: 30,
    videos: [
      {
        id: "store-setup",
        title: "Setting Up Your Online Store",
        description: "Complete guide to creating your first online store",
        duration: "18:12",
        thumbnail: ecommerceThumb,
        videoUrl: "#",
        productId: "ecommerce"
      }
    ]
  },
  {
    id: "website",
    title: "Website Builder",
    description: "Create stunning websites with our drag-and-drop builder",
    category: "Design",
    thumbnail: websiteThumb,
    totalDuration: "5 hours 57 minutes",
    lessonCount: 30,
    videos: [
      {
        id: "website-basics",
        title: "Website Building Basics",
        description: "Learn the fundamentals of our website builder",
        duration: "14:56",
        thumbnail: websiteThumb,
        videoUrl: "#",
        productId: "website"
      }
    ]
  },
  {
    id: "accounting",
    title: "Accounting and Invoicing",
    description: "Manage your finances with integrated accounting tools",
    category: "Finance",
    thumbnail: gettingStartedThumb, // Reusing for demo
    totalDuration: "5 hours 57 minutes",
    lessonCount: 30,
    videos: []
  },
  {
    id: "inventory",
    title: "Inventory Management",
    description: "Track and manage your inventory with advanced tools",
    category: "Operations",
    thumbnail: crmThumb, // Reusing for demo
    totalDuration: "5 hours 57 minutes",
    lessonCount: 30,
    videos: []
  },
  {
    id: "pos",
    title: "Point of Sale",
    description: "Process transactions with our integrated POS system",
    category: "Sales",
    thumbnail: ecommerceThumb, // Reusing for demo
    totalDuration: "5 hours 57 minutes",
    lessonCount: 30,
    videos: []
  },
  {
    id: "manufacturing",
    title: "MRP - Manufacturing & Shop Floor",
    description: "Streamline your manufacturing processes",
    category: "Operations",
    thumbnail: websiteThumb, // Reusing for demo
    totalDuration: "5 hours 57 minutes",
    lessonCount: 30,
    videos: []
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