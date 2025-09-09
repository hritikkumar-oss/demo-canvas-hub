import { createContext, useContext, useState, ReactNode } from 'react';
import { mockProducts as initialProducts, mockPlaylists as initialPlaylists, Product, Playlist, Video } from '@/data/mockData';

interface DataContextType {
  products: Product[];
  playlists: Playlist[];
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  updateVideo: (productId: string, videoId: string, updates: Partial<Video>) => void;
  updatePlaylist: (playlistId: string, updates: Partial<Playlist>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [playlists, setPlaylists] = useState<Playlist[]>(initialPlaylists);

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === productId ? { ...product, ...updates } : product
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
  };

  const updatePlaylist = (playlistId: string, updates: Partial<Playlist>) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId ? { ...playlist, ...updates } : playlist
    ));
  };

  return (
    <DataContext.Provider value={{
      products,
      playlists,
      updateProduct,
      updateVideo,
      updatePlaylist
    }}>
      {children}
    </DataContext.Provider>
  );
};