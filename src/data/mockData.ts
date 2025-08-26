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
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "getting-started"
      },
      {
        id: "first-steps",
        title: "Your First Steps",
        description: "Setting up your account and basic configuration",
        duration: "8:45",
        thumbnail: gettingStartedThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "getting-started"
      },
      {
        id: "navigation-basics",
        title: "Navigation and Layout Basics",
        description: "Learn how to navigate through the platform efficiently",
        duration: "10:22",
        thumbnail: gettingStartedThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "getting-started"
      },
      {
        id: "user-settings",
        title: "User Settings and Preferences",
        description: "Customize your experience with user settings",
        duration: "7:15",
        thumbnail: gettingStartedThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "getting-started"
      },
      {
        id: "dashboard-overview",
        title: "Dashboard Overview",
        description: "Understanding your dashboard and key metrics",
        duration: "13:08",
        thumbnail: gettingStartedThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "getting-started"
      },
      {
        id: "basic-workflow",
        title: "Basic Workflow Tutorial",
        description: "Follow a typical workflow from start to finish",
        duration: "15:33",
        thumbnail: gettingStartedThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "getting-started"
      },
      {
        id: "tips-tricks",
        title: "Tips and Tricks for Beginners",
        description: "Pro tips to help you get the most out of the platform",
        duration: "11:47",
        thumbnail: gettingStartedThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "getting-started"
      },
      {
        id: "troubleshooting",
        title: "Common Issues and Troubleshooting",
        description: "How to solve the most common problems",
        duration: "9:52",
        thumbnail: gettingStartedThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "crm"
      },
      {
        id: "contact-management",
        title: "Contact Management Essentials",
        description: "Organize and manage your contacts effectively",
        duration: "12:45",
        thumbnail: crmThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "crm"
      },
      {
        id: "lead-tracking",
        title: "Lead Tracking and Conversion",
        description: "Track leads through your sales pipeline",
        duration: "18:30",
        thumbnail: crmThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "crm"
      },
      {
        id: "sales-pipeline",
        title: "Building Your Sales Pipeline",
        description: "Create and manage effective sales pipelines",
        duration: "14:17",
        thumbnail: crmThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "crm"
      },
      {
        id: "customer-communications",
        title: "Customer Communication Tools",
        description: "Master email, calls, and messaging features",
        duration: "11:55",
        thumbnail: crmThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "crm"
      },
      {
        id: "reporting-analytics",
        title: "CRM Reports and Analytics",
        description: "Generate insights with powerful reporting tools",
        duration: "16:42",
        thumbnail: crmThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "crm"
      },
      {
        id: "automation-workflows",
        title: "Automation and Workflows",
        description: "Automate repetitive tasks with smart workflows",
        duration: "13:28",
        thumbnail: crmThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "crm"
      },
      {
        id: "integrations",
        title: "CRM Integrations",
        description: "Connect your CRM with other business tools",
        duration: "10:36",
        thumbnail: crmThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "crm"
      },
      {
        id: "advanced-features",
        title: "Advanced CRM Features",
        description: "Explore advanced features for power users",
        duration: "19:14",
        thumbnail: crmThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "ecommerce"
      },
      {
        id: "product-catalog",
        title: "Building Your Product Catalog",
        description: "Add and organize products in your online store",
        duration: "14:35",
        thumbnail: ecommerceThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "ecommerce"
      },
      {
        id: "payment-processing",
        title: "Payment Processing Setup",
        description: "Configure payment gateways and processing",
        duration: "12:20",
        thumbnail: ecommerceThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "ecommerce"
      },
      {
        id: "shipping-fulfillment",
        title: "Shipping and Fulfillment",
        description: "Set up shipping options and fulfillment processes",
        duration: "16:48",
        thumbnail: ecommerceThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "ecommerce"
      },
      {
        id: "order-management",
        title: "Order Management System",
        description: "Process and manage customer orders efficiently",
        duration: "13:27",
        thumbnail: ecommerceThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "ecommerce"
      },
      {
        id: "inventory-tracking",
        title: "Inventory Tracking",
        description: "Keep track of stock levels and inventory",
        duration: "11:15",
        thumbnail: ecommerceThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "ecommerce"
      },
      {
        id: "customer-accounts",
        title: "Customer Account Management",
        description: "Set up customer accounts and profiles",
        duration: "9:33",
        thumbnail: ecommerceThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "ecommerce"
      },
      {
        id: "marketing-tools",
        title: "Marketing and Promotions",
        description: "Create campaigns, discounts, and promotions",
        duration: "15:52",
        thumbnail: ecommerceThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "ecommerce"
      },
      {
        id: "analytics-reporting",
        title: "eCommerce Analytics",
        description: "Track sales performance and customer behavior",
        duration: "12:08",
        thumbnail: ecommerceThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "website"
      },
      {
        id: "drag-drop-editor",
        title: "Drag and Drop Editor",
        description: "Master the drag and drop interface",
        duration: "11:23",
        thumbnail: websiteThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "website"
      },
      {
        id: "templates-themes",
        title: "Templates and Themes",
        description: "Choose and customize website templates",
        duration: "13:45",
        thumbnail: websiteThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "website"
      },
      {
        id: "responsive-design",
        title: "Responsive Design",
        description: "Create websites that work on all devices",
        duration: "16:12",
        thumbnail: websiteThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "website"
      },
      {
        id: "seo-optimization",
        title: "SEO Optimization",
        description: "Optimize your website for search engines",
        duration: "12:37",
        thumbnail: websiteThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "website"
      },
      {
        id: "forms-interactions",
        title: "Forms and Interactions",
        description: "Add forms and interactive elements",
        duration: "10:54",
        thumbnail: websiteThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "website"
      },
      {
        id: "custom-code",
        title: "Custom Code Integration",
        description: "Add custom HTML, CSS, and JavaScript",
        duration: "15:28",
        thumbnail: websiteThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "website"
      },
      {
        id: "domain-hosting",
        title: "Domain and Hosting Setup",
        description: "Connect your domain and publish your site",
        duration: "8:41",
        thumbnail: websiteThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        productId: "website"
      },
      {
        id: "website-analytics",
        title: "Website Analytics",
        description: "Track visitor behavior and site performance",
        duration: "9:33",
        thumbnail: websiteThumb,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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