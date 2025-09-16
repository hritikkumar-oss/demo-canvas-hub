import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  thumbnail: string;
  total_duration: string;
  lesson_count: number;
  is_featured: boolean;
  videos: Video[];
  created_at?: string;
  updated_at?: string;
}

interface Video {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  thumbnail_url: string;
  video_url: string;
  product_id: string;
  order_index: number;
  is_new: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Playlist {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  videos: Video[];
  created_at?: string;
  updated_at?: string;
}

interface DataContextType {
  products: Product[];
  playlists: Playlist[];
  loading: boolean;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  updateVideo: (productId: string, videoId: string, updates: Partial<Video>) => Promise<void>;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'videos'>) => Promise<void>;
  addVideo: (productId: string, video: Omit<Video, 'id' | 'product_id'>) => Promise<void>;
  addPlaylist: (playlist: Omit<Playlist, 'id' | 'videos'>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  deleteVideo: (productId: string, videoId: string) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products with their videos
  const fetchProducts = async () => {
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .order('order_index', { ascending: true });

      if (videosError) throw videosError;

      // Group videos by product
      const productsWithVideos = productsData.map(product => ({
        ...product,
        videos: videosData.filter(video => video.product_id === product.id)
      }));

      setProducts(productsWithVideos);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch playlists with their videos
  const fetchPlaylists = async () => {
    try {
      const { data: playlistsData, error: playlistsError } = await supabase
        .from('playlists')
        .select('*')
        .order('created_at', { ascending: false });

      if (playlistsError) throw playlistsError;

      // For now, return playlists without videos since we haven't implemented the junction table queries yet
      setPlaylists(playlistsData.map(playlist => ({ ...playlist, videos: [] })));
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchPlaylists()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setProducts(prev => prev.map(product => 
        product.id === id ? { ...product, ...updates } : product
      ));
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const updateVideo = async (productId: string, videoId: string, updates: Partial<Video>) => {
    try {
      const { error } = await supabase
        .from('videos')
        .update(updates)
        .eq('id', videoId);

      if (error) throw error;

      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? {
              ...product,
              videos: product.videos.map(video => 
                video.id === videoId ? { ...video, ...updates } : video
              )
            }
          : product
      ));
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  };

  const updatePlaylist = async (id: string, updates: Partial<Playlist>) => {
    try {
      const { error } = await supabase
        .from('playlists')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setPlaylists(prev => prev.map(playlist => 
        playlist.id === id ? { ...playlist, ...updates } : playlist
      ));
    } catch (error) {
      console.error('Error updating playlist:', error);
      throw error;
    }
  };

  const addProduct = async (product: Omit<Product, 'id' | 'videos'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) throw error;

      const newProduct = { ...data, videos: [] };
      setProducts(prev => [newProduct, ...prev]);
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const addVideo = async (productId: string, video: Omit<Video, 'id' | 'product_id'>) => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .insert([{ ...video, product_id: productId }])
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, videos: [...product.videos, data] }
          : product
      ));
    } catch (error) {
      console.error('Error adding video:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const deleteVideo = async (productId: string, videoId: string) => {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId);

      if (error) throw error;

      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, videos: product.videos.filter(video => video.id !== videoId) }
          : product
      ));
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  };

  const addPlaylist = async (playlist: Omit<Playlist, 'id' | 'videos'>) => {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .insert([playlist])
        .select()
        .single();

      if (error) throw error;

      const newPlaylist = { ...data, videos: [] };
      setPlaylists(prev => [newPlaylist, ...prev]);
    } catch (error) {
      console.error('Error adding playlist:', error);
      throw error;
    }
  };

  const deletePlaylist = async (id: string) => {
    try {
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPlaylists(prev => prev.filter(playlist => playlist.id !== id));
    } catch (error) {
      console.error('Error deleting playlist:', error);
      throw error;
    }
  };

  const value = {
    products,
    playlists,
    loading,
    updateProduct,
    updateVideo,
    updatePlaylist,
    addProduct,
    addVideo,
    addPlaylist,
    deleteProduct,
    deleteVideo,
    deletePlaylist,
    refreshData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};