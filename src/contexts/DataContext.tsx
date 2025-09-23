import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Video, Playlist } from '@/data/mockData';
import { supabase } from '@/integrations/supabase/client';

interface DataContextType {
  products: Product[];
  playlists: Playlist[];
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  updateVideo: (productId: string, videoId: string, updates: Partial<Video>) => Promise<void>;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  addVideo: (productId: string, video: Omit<Video, 'id'>) => Promise<void>;
  addPlaylist: (playlist: Omit<Playlist, 'id'>) => void;
  deleteProduct: (id: string) => Promise<void>;
  deleteVideo: (productId: string, videoId: string) => Promise<void>;
  deletePlaylist: (id: string) => void;
  reorderProducts: (sourceIndex: number, destinationIndex: number) => void;
  reorderVideos: (productId: string, sourceIndex: number, destinationIndex: number) => void;
  reorderPlaylistVideos: (playlistId: string, sourceIndex: number, destinationIndex: number) => void;
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

  // Fetch products and videos from Supabase
  const fetchProducts = async () => {
    try {
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true });

      if (productsError) {
        console.error('Error fetching products:', productsError);
        return;
      }

      // Fetch videos
      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .order('order_index', { ascending: true });

      if (videosError) {
        console.error('Error fetching videos:', videosError);
        return;
      }

      // Combine products with their videos
      const productsWithVideos: Product[] = productsData.map(product => ({
        id: product.id,
        slug: product.slug,
        title: product.title,
        description: product.description || '',
        category: product.category || '',
        thumbnail: product.thumbnail || '',
        totalDuration: product.total_duration || '0:00',
        lessonCount: product.lesson_count || 0,
        isNew: product.is_featured || false,
        videos: videosData
          .filter(video => video.product_id === product.id)
          .map(video => ({
            id: video.id,
            slug: video.slug,
            title: video.title,
            description: video.description || '',
            duration: video.duration || '0:00',
            thumbnail: video.thumbnail_url || '',
            videoUrl: video.video_url || '',
            productId: video.product_id,
            createdAt: video.created_at,
            isNew: video.is_new || false
          }))
      }));

      setProducts(productsWithVideos);
    } catch (error) {
      console.error('Error in fetchProducts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch playlists from Supabase
  const fetchPlaylists = async () => {
    try {
      const { data: playlistsData, error: playlistsError } = await supabase
        .from('playlists')
        .select('*')
        .order('created_at', { ascending: true });

      if (playlistsError) {
        console.error('Error fetching playlists:', playlistsError);
        return;
      }

      // Convert to frontend format (simplified for now)
      const formattedPlaylists: Playlist[] = playlistsData.map(playlist => ({
        id: playlist.id,
        name: playlist.title,
        description: playlist.description || '',
        coverThumbnailUrl: playlist.thumbnail_url || '',
        videoCount: 0, // Will be calculated based on playlist_videos
        totalDuration: '0:00',
        createdBy: playlist.created_by || '',
        createdAt: playlist.created_at,
        videos: [] // Will be populated with actual videos
      }));

      setPlaylists(formattedPlaylists);
    } catch (error) {
      console.error('Error in fetchPlaylists:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchPlaylists();
  }, []);

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('products')
        .update({
          title: updates.title,
          description: updates.description,
          category: updates.category,
          thumbnail: updates.thumbnail,
          total_duration: updates.totalDuration,
          lesson_count: updates.lessonCount,
          is_featured: updates.isNew,
          slug: updates.slug
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating product:', error);
        return;
      }

      // Update local state
      setProducts(prev => prev.map(product => 
        product.id === id ? { ...product, ...updates } : product
      ));
    } catch (error) {
      console.error('Error in updateProduct:', error);
    }
  };

  const updateVideo = async (productId: string, videoId: string, updates: Partial<Video>) => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('videos')
        .update({
          title: updates.title,
          description: updates.description,
          duration: updates.duration,
          thumbnail_url: updates.thumbnail,
          video_url: updates.videoUrl,
          is_new: updates.isNew,
          slug: updates.slug
        })
        .eq('id', videoId);

      if (error) {
        console.error('Error updating video:', error);
        return;
      }

      // Update local state
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

      // Also update videos in playlists
      setPlaylists(prev => prev.map(playlist => ({
        ...playlist,
        videos: playlist.videos.map(video => 
          video.id === videoId ? { ...video, ...updates } : video
        )
      })));
    } catch (error) {
      console.error('Error in updateVideo:', error);
    }
  };

  const updatePlaylist = (id: string, updates: Partial<Playlist>) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === id ? { ...playlist, ...updates } : playlist
    ));
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          title: product.title,
          description: product.description,
          category: product.category,
          thumbnail: product.thumbnail,
          total_duration: product.totalDuration,
          lesson_count: product.lessonCount,
          is_featured: product.isNew,
          slug: product.slug
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding product:', error);
        return;
      }

      const newProduct: Product = {
        ...product,
        id: data.id,
      };
      setProducts(prev => [...prev, newProduct]);
    } catch (error) {
      console.error('Error in addProduct:', error);
    }
  };

  const addVideo = async (productId: string, video: Omit<Video, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .insert({
          product_id: productId,
          title: video.title,
          description: video.description,
          duration: video.duration,
          thumbnail_url: video.thumbnail,
          video_url: video.videoUrl,
          is_new: video.isNew,
          slug: video.slug,
          order_index: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding video:', error);
        return;
      }

      const newVideo: Video = {
        ...video,
        id: data.id,
        productId: productId,
        createdAt: data.created_at
      };
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, videos: [...product.videos, newVideo] }
          : product
      ));
    } catch (error) {
      console.error('Error in addVideo:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        return;
      }

      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error in deleteProduct:', error);
    }
  };

  const deleteVideo = async (productId: string, videoId: string) => {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId);

      if (error) {
        console.error('Error deleting video:', error);
        return;
      }

      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, videos: product.videos.filter(video => video.id !== videoId) }
          : product
      ));
    } catch (error) {
      console.error('Error in deleteVideo:', error);
    }
  };

  const addPlaylist = (playlist: Omit<Playlist, 'id'>) => {
    const newPlaylist: Playlist = {
      ...playlist,
      id: `playlist-${Date.now()}`,
    };
    setPlaylists(prev => [...prev, newPlaylist]);
  };

  const deletePlaylist = (id: string) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== id));
  };

  const reorderProducts = (sourceIndex: number, destinationIndex: number) => {
    setProducts(prev => {
      const result = [...prev];
      const [removed] = result.splice(sourceIndex, 1);
      result.splice(destinationIndex, 0, removed);
      return result;
    });
  };

  const reorderVideos = (productId: string, sourceIndex: number, destinationIndex: number) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? {
            ...product,
            videos: (() => {
              const result = [...product.videos];
              const [removed] = result.splice(sourceIndex, 1);
              result.splice(destinationIndex, 0, removed);
              return result;
            })()
          }
        : product
    ));
  };

  const reorderPlaylistVideos = (playlistId: string, sourceIndex: number, destinationIndex: number) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId 
        ? {
            ...playlist,
            videos: (() => {
              const result = [...playlist.videos];
              const [removed] = result.splice(sourceIndex, 1);
              result.splice(destinationIndex, 0, removed);
              return result;
            })()
          }
        : playlist
    ));
  };

  const value = {
    products,
    playlists,
    updateProduct,
    updateVideo,
    updatePlaylist,
    addProduct,
    addVideo,
    addPlaylist,
    deleteProduct,
    deleteVideo,
    deletePlaylist,
    reorderProducts,
    reorderVideos,
    reorderPlaylistVideos,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};