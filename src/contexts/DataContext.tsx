import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Video, Playlist, mockProducts, mockPlaylists } from '@/data/mockData';

interface DataContextType {
  products: Product[];
  playlists: Playlist[];
  updateProduct: (id: string, updates: Partial<Product>) => void;
  updateVideo: (productId: string, videoId: string, updates: Partial<Video>) => void;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void;
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
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists);

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

  const value = {
    products,
    playlists,
    updateProduct,
    updateVideo,
    updatePlaylist,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};