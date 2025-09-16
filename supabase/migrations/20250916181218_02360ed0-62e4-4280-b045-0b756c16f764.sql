-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT,
  thumbnail TEXT,
  total_duration TEXT DEFAULT '0:00',
  lesson_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  is_featured BOOLEAN DEFAULT false
);

-- Create videos table
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  duration TEXT DEFAULT '0:00',
  thumbnail_url TEXT,
  video_url TEXT,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  is_new BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  UNIQUE(product_id, slug)
);

-- Create playlists table
CREATE TABLE public.playlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Create playlist_videos junction table
CREATE TABLE public.playlist_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(playlist_id, video_id)
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_videos ENABLE ROW LEVEL SECURITY;

-- Create policies for products table
CREATE POLICY "Anyone can view products" 
  ON public.products FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create products" 
  ON public.products FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update products they created" 
  ON public.products FOR UPDATE 
  USING (auth.uid() = created_by OR auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete products they created" 
  ON public.products FOR DELETE 
  USING (auth.uid() = created_by OR auth.uid() IS NOT NULL);

-- Create policies for videos table
CREATE POLICY "Anyone can view videos" 
  ON public.videos FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create videos" 
  ON public.videos FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update videos" 
  ON public.videos FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete videos" 
  ON public.videos FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Create policies for playlists table
CREATE POLICY "Anyone can view playlists" 
  ON public.playlists FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create playlists" 
  ON public.playlists FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update playlists" 
  ON public.playlists FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete playlists" 
  ON public.playlists FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Create policies for playlist_videos table
CREATE POLICY "Anyone can view playlist videos" 
  ON public.playlist_videos FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can manage playlist videos" 
  ON public.playlist_videos FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('video-thumbnails', 'video-thumbnails', true),
  ('video-files', 'video-files', true);

-- Create storage policies for video-thumbnails bucket
CREATE POLICY "Anyone can view thumbnail images" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'video-thumbnails');

CREATE POLICY "Authenticated users can upload thumbnails" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'video-thumbnails' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update thumbnails" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'video-thumbnails' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete thumbnails" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'video-thumbnails' AND auth.uid() IS NOT NULL);

-- Create storage policies for video-files bucket
CREATE POLICY "Anyone can view video files" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'video-files');

CREATE POLICY "Authenticated users can upload videos" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'video-files' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update videos" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'video-files' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete videos" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'video-files' AND auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at
  BEFORE UPDATE ON public.playlists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();