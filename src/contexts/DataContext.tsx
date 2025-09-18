import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Video, Playlist, mockProducts, mockPlaylists } from '@/data/mockData';

interface DataContextType {
  products: Product[];
  playlists: Playlist[];
  updateProduct: (id: string, updates: Partial<Product>) => void;
  updateVideo: (productId: string, videoId: string, updates: Partial<Video>) => void;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  addVideo: (productId: string, video: Omit<Video, 'id'>) => void;
  addPlaylist: (playlist: Omit<Playlist, 'id'>) => void;
  deleteProduct: (id: string) => void;
  deleteVideo: (productId: string, videoId: string) => void;
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
  const [products, setProducts] = useState<Product[]>(mockProducts || []);
  const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists || []);

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updates } : product
    ));
  };

  const updateVideo = (productId: string, videoId: string, updates: Partial<Video>) => {
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
  };

  const updatePlaylist = (id: string, updates: Partial<Playlist>) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === id ? { ...playlist, ...updates } : playlist
    ));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}`,
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const addVideo = (productId: string, video: Omit<Video, 'id'>) => {
    const newVideo: Video = {
      ...video,
      id: `video-${Date.now()}`,
    };
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, videos: [...product.videos, newVideo] }
        : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const deleteVideo = (productId: string, videoId: string) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, videos: product.videos.filter(video => video.id !== videoId) }
        : product
    ));
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