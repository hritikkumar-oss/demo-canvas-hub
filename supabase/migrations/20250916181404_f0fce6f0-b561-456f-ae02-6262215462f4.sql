-- Insert sample products with proper UUIDs
INSERT INTO public.products (title, slug, description, category, thumbnail, total_duration, lesson_count, is_featured) VALUES
  ('AI-Powered eB2B', 'ai-powered-eb2b', 'Revolutionize your B2B experience with artificial intelligence', 'AI', '/lovable-uploads/18aa9a10-08d6-4991-b18b-dc887d6b5c86.png', '45:30', 8, true),
  ('NextGen CRM', 'nextgen-crm', 'Advanced CRM solution for modern businesses', 'CRM', '/lovable-uploads/e034b324-e49a-4ea8-9cb1-9222a945fe38.png', '32:15', 6, true),
  ('NextGen DMS', 'nextgen-dms', 'Document Management System for the future', 'DMS', '/lovable-uploads/18aa9a10-08d6-4991-b18b-dc887d6b5c86.png', '28:45', 5, false),
  ('Smart Analytics', 'smart-analytics', 'Powerful analytics platform for data-driven decisions', 'Analytics', '/lovable-uploads/e034b324-e49a-4ea8-9cb1-9222a945fe38.png', '51:20', 9, true);

-- Get the product IDs to insert videos
DO $$
DECLARE
    ai_product_id UUID;
    crm_product_id UUID;
    dms_product_id UUID;
    analytics_product_id UUID;
BEGIN
    -- Get product IDs
    SELECT id INTO ai_product_id FROM public.products WHERE slug = 'ai-powered-eb2b';
    SELECT id INTO crm_product_id FROM public.products WHERE slug = 'nextgen-crm';
    SELECT id INTO dms_product_id FROM public.products WHERE slug = 'nextgen-dms';
    SELECT id INTO analytics_product_id FROM public.products WHERE slug = 'smart-analytics';
    
    -- Insert sample videos
    INSERT INTO public.videos (title, slug, description, duration, thumbnail_url, video_url, product_id, order_index) VALUES
      ('Introduction and Setup', 'introduction-and-setup', 'Get started with AI-Powered eB2B platform', '5:30', '/lovable-uploads/18aa9a10-08d6-4991-b18b-dc887d6b5c86.png', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ai_product_id, 0),
      ('Core Features Overview', 'core-features-overview', 'Explore the main features of the platform', '8:15', '/lovable-uploads/e034b324-e49a-4ea8-9cb1-9222a945fe38.png', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ai_product_id, 1),
      ('Advanced Configuration', 'advanced-configuration', 'Configure advanced AI settings', '12:45', '/lovable-uploads/18aa9a10-08d6-4991-b18b-dc887d6b5c86.png', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ai_product_id, 2),
      
      ('Getting Started Guide', 'getting-started-guide', 'Learn the basics of NextGen CRM', '6:45', '/lovable-uploads/18aa9a10-08d6-4991-b18b-dc887d6b5c86.png', 'https://www.youtube.com/embed/dQw4w9WgXcQ', crm_product_id, 0),
      ('Contact Management', 'contact-management', 'Manage contacts effectively', '9:30', '/lovable-uploads/e034b324-e49a-4ea8-9cb1-9222a945fe38.png', 'https://www.youtube.com/embed/dQw4w9WgXcQ', crm_product_id, 1),
      
      ('Document Upload', 'document-upload', 'Upload and organize documents', '7:15', '/lovable-uploads/18aa9a10-08d6-4991-b18b-dc887d6b5c86.png', 'https://www.youtube.com/embed/dQw4w9WgXcQ', dms_product_id, 0),
      
      ('Dashboard Overview', 'dashboard-overview', 'Navigate the analytics dashboard', '8:45', '/lovable-uploads/e034b324-e49a-4ea8-9cb1-9222a945fe38.png', 'https://www.youtube.com/embed/dQw4w9WgXcQ', analytics_product_id, 0),
      ('Creating Reports', 'creating-reports', 'Generate custom reports', '11:20', '/lovable-uploads/18aa9a10-08d6-4991-b18b-dc887d6b5c86.png', 'https://www.youtube.com/embed/dQw4w9WgXcQ', analytics_product_id, 1);
END $$;