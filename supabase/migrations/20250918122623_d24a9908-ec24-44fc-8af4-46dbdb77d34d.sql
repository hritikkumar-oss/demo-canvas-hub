-- Create missing products for demo videos
INSERT INTO products (title, slug, description, category, lesson_count, total_duration, is_featured, created_at, updated_at)
VALUES 
('Supervisor App', 'supervisor', 'Advanced supervision and management tools for sales teams', 'Management', 10, '5:00:00', false, now(), now()),
('SALESLENS', 'saleslens', 'Advanced sales analytics and insights platform', 'Analytics', 18, '3:45:00', false, now(), now()),
('eB2B', 'eb2b', 'Next-generation B2B e-commerce solutions', 'eB2B', 19, '7:00:00', false, now(), now())
ON CONFLICT (slug) DO UPDATE SET
  lesson_count = EXCLUDED.lesson_count,
  updated_at = now();