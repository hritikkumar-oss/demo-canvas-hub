import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Video, Playlist, mockProducts, mockPlaylists } from '@/data/mockData';
import {
  fetchProductsWithVideos,
  fetchPlaylists,
  createProduct as apiCreateProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  createVideo as apiCreateVideo,
  updateVideo as apiUpdateVideo,
  deleteVideo as apiDeleteVideo,
  createPlaylist as apiCreatePlaylist,
  updatePlaylist as apiUpdatePlaylist,
  deletePlaylist as apiDeletePlaylist,
} from '@/lib/supabaseApi';
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates';
import { useToast } from '@/hooks/use-toast';

interface DataContextType {
  products: Product[];
  playlists: Playlist[];
  loading: boolean;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  updateVideo: (productId: string, videoId: string, updates: Partial<Video>) => Promise<void>;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  addVideo: (productId: string, video: Omit<Video, 'id'>) => Promise<Video>;
  addPlaylist: (playlist: Omit<Playlist, 'id'>) => Promise<Playlist>;
  deleteProduct: (id: string) => Promise<void>;
  deleteVideo: (productId: string, videoId: string) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
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
  const { toast } = useToast();

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, playlistsData] = await Promise.all([
          fetchProductsWithVideos(),
          fetchPlaylists()
        ]);
        
        setProducts(productsData);
        setPlaylists(playlistsData);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to mock data if Supabase fails
        setProducts(mockProducts || []);
        setPlaylists(mockPlaylists || []);
        toast({
          title: "Database Connection Failed",
          description: "Using demo data. Some features may be limited.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Set up real-time updates
  useRealtimeUpdates({
    onProductChange: (product, eventType) => {
      if (eventType === 'INSERT') {
        setProducts(prev => [...prev, product]);
      } else if (eventType === 'UPDATE') {
        setProducts(prev => prev.map(p => p.id === product.id ? product : p));
      } else if (eventType === 'DELETE') {
        setProducts(prev => prev.filter(p => p.id !== product.id));
      }
    },
    onVideoChange: (video, eventType) => {
      if (eventType === 'INSERT') {
        setProducts(prev => prev.map(product => 
          product.id === video.productId 
            ? { ...product, videos: [...product.videos, video] }
            : product
        ));
      } else if (eventType === 'UPDATE') {
        setProducts(prev => prev.map(product => 
          product.id === video.productId 
            ? {
                ...product,
                videos: product.videos.map(v => v.id === video.id ? video : v)
              }
            : product
        ));
      } else if (eventType === 'DELETE') {
        setProducts(prev => prev.map(product => 
          product.id === video.productId 
            ? { ...product, videos: product.videos.filter(v => v.id !== video.id) }
            : product
        ));
      }
    },
    onPlaylistChange: (playlist, eventType) => {
      if (eventType === 'INSERT') {
        setPlaylists(prev => [...prev, playlist]);
      } else if (eventType === 'UPDATE') {
        setPlaylists(prev => prev.map(p => p.id === playlist.id ? playlist : p));
      } else if (eventType === 'DELETE') {
        setPlaylists(prev => prev.filter(p => p.id !== playlist.id));
      }
    }
  });

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const updatedProduct = await apiUpdateProduct(id, updates);
      // Real-time updates will handle state changes
      toast({
        title: "Product Updated",
        description: "Product has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
      // Fallback to local state update
      setProducts(prev => prev.map(product => 
        product.id === id ? { ...product, ...updates } : product
      ));
    }
  };

  const updateVideo = async (productId: string, videoId: string, updates: Partial<Video>) => {
    try {
      const updatedVideo = await apiUpdateVideo(videoId, updates);
      // Real-time updates will handle state changes
      toast({
        title: "Video Updated",
        description: "Video has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating video:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update video. Please try again.",
        variant: "destructive",
      });
      // Fallback to local state update
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
    }
  };

  const updatePlaylist = async (id: string, updates: Partial<Playlist>) => {
    try {
      const updatedPlaylist = await apiUpdatePlaylist(id, updates);
      // Real-time updates will handle state changes
      toast({
        title: "Playlist Updated",
        description: "Playlist has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating playlist:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update playlist. Please try again.",
        variant: "destructive",
      });
      // Fallback to local state update
      setPlaylists(prev => prev.map(playlist => 
        playlist.id === id ? { ...playlist, ...updates } : playlist
      ));
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const newProduct = await apiCreateProduct(product);
      // Real-time updates will handle state changes
      toast({
        title: "Product Created",
        description: "New product has been created successfully.",
      });
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
      // Fallback to local state update
      const newProduct: Product = {
        ...product,
        id: `product-${Date.now()}`,
      };
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    }
  };

  const addVideo = async (productId: string, video: Omit<Video, 'id'>) => {
    try {
      const videoWithProductId = { ...video, productId };
      const newVideo = await apiCreateVideo(videoWithProductId);
      // Real-time updates will handle state changes
      toast({
        title: "Video Created",
        description: "New video has been created successfully.",
      });
      return newVideo;
    } catch (error) {
      console.error('Error creating video:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create video. Please try again.",
        variant: "destructive",
      });
      // Fallback to local state update
      const newVideo: Video = {
        ...video,
        id: `video-${Date.now()}`,
      };
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, videos: [...product.videos, newVideo] }
          : product
      ));
      return newVideo;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await apiDeleteProduct(id);
      // Real-time updates will handle state changes
      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Deletion Failed",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
      // Fallback to local state update
      setProducts(prev => prev.filter(product => product.id !== id));
    }
  };

  const deleteVideo = async (productId: string, videoId: string) => {
    try {
      await apiDeleteVideo(videoId);
      // Real-time updates will handle state changes
      toast({
        title: "Video Deleted",
        description: "Video has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: "Deletion Failed",
        description: "Failed to delete video. Please try again.",
        variant: "destructive",
      });
      // Fallback to local state update
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, videos: product.videos.filter(video => video.id !== videoId) }
          : product
      ));
    }
  };

  const addPlaylist = async (playlist: Omit<Playlist, 'id'>) => {
    try {
      const newPlaylist = await apiCreatePlaylist(playlist);
      // Real-time updates will handle state changes
      toast({
        title: "Playlist Created",
        description: "New playlist has been created successfully.",
      });
      return newPlaylist;
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create playlist. Please try again.",
        variant: "destructive",
      });
      // Fallback to local state update
      const newPlaylist: Playlist = {
        ...playlist,
        id: `playlist-${Date.now()}`,
      };
      setPlaylists(prev => [...prev, newPlaylist]);
      return newPlaylist;
    }
  };

  const deletePlaylist = async (id: string) => {
    try {
      await apiDeletePlaylist(id);
      // Real-time updates will handle state changes
      toast({
        title: "Playlist Deleted",
        description: "Playlist has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast({
        title: "Deletion Failed",
        description: "Failed to delete playlist. Please try again.",
        variant: "destructive",
      });
      // Fallback to local state update
      setPlaylists(prev => prev.filter(playlist => playlist.id !== id));
    }
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