import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Video, Playlist, mockProducts, mockPlaylists } from '@/data/mockData';
// Note: Supabase API will be enabled once tables are created
// import {
//   fetchProductsWithVideos,
//   fetchPlaylists,
//   createProduct as apiCreateProduct,
//   updateProduct as apiUpdateProduct,
//   deleteProduct as apiDeleteProduct,
//   createVideo as apiCreateVideo,
//   updateVideo as apiUpdateVideo,
//   deleteVideo as apiDeleteVideo,
//   createPlaylist as apiCreatePlaylist,
//   updatePlaylist as apiUpdatePlaylist,
//   deletePlaylist as apiDeletePlaylist,
// } from '@/lib/supabaseApi';

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
  const [loading, setLoading] = useState(false);

  // TODO: Enable Supabase integration once tables are created
  // Load data from Supabase on mount
  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       setLoading(true);
  //       const [productsData, playlistsData] = await Promise.all([
  //         fetchProductsWithVideos(),
  //         fetchPlaylists()
  //       ]);
  //       
  //       setProducts(productsData);
  //       setPlaylists(playlistsData);
  //     } catch (error) {
  //       console.error('Error loading data:', error);
  //       // Fallback to mock data if Supabase fails
  //       setProducts(mockProducts || []);
  //       setPlaylists(mockPlaylists || []);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadData();
  // }, []);

  const updateProduct = (id: string, updates: Partial<Product>) => {
    // TODO: Enable Supabase integration
    // try {
    //   const updatedProduct = await apiUpdateProduct(id, updates);
    //   setProducts(prev => prev.map(product => 
    //     product.id === id ? { ...product, ...updatedProduct } : product
    //   ));
    // } catch (error) {
    //   console.error('Error updating product:', error);
    //   // Fallback to local state update
      setProducts(prev => prev.map(product => 
        product.id === id ? { ...product, ...updates } : product
      ));
    // }
  };

  const updateVideo = (productId: string, videoId: string, updates: Partial<Video>) => {
    // TODO: Enable Supabase integration
    // try {
    //   const updatedVideo = await apiUpdateVideo(videoId, updates);
      
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
    // } catch (error) {
    //   console.error('Error updating video:', error);
    //   // Fallback to local state update
    //   setProducts(prev => prev.map(product => 
    //     product.id === productId 
    //       ? {
    //           ...product,
    //           videos: product.videos.map(video => 
    //             video.id === videoId ? { ...video, ...updates } : video
    //           )
    //         }
    //       : product
    //   ));
    // }
  };

  const updatePlaylist = (id: string, updates: Partial<Playlist>) => {
    // TODO: Enable Supabase integration
    // try {
    //   const updatedPlaylist = await apiUpdatePlaylist(id, updates);
      setPlaylists(prev => prev.map(playlist => 
        playlist.id === id ? { ...playlist, ...updates } : playlist
      ));
    // } catch (error) {
    //   console.error('Error updating playlist:', error);
    //   // Fallback to local state update
    //   setPlaylists(prev => prev.map(playlist => 
    //     playlist.id === id ? { ...playlist, ...updates } : playlist
    //   ));
    // }
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    // TODO: Enable Supabase integration
    // try {
    //   const newProduct = await apiCreateProduct(product);
    //   setProducts(prev => [...prev, newProduct]);
    // } catch (error) {
    //   console.error('Error creating product:', error);
    //   // Fallback to local state update
      const newProduct: Product = {
        ...product,
        id: `product-${Date.now()}`,
      };
      setProducts(prev => [...prev, newProduct]);
    // }
  };

  const addVideo = (productId: string, video: Omit<Video, 'id'>) => {
    // TODO: Enable Supabase integration
    // try {
    //   const videoWithProductId = { ...video, productId };
    //   const newVideo = await apiCreateVideo(videoWithProductId);
    //   setProducts(prev => prev.map(product => 
    //     product.id === productId 
    //       ? { ...product, videos: [...product.videos, newVideo] }
    //       : product
    //   ));
    // } catch (error) {
    //   console.error('Error creating video:', error);
    //   // Fallback to local state update
      const newVideo: Video = {
        ...video,
        id: `video-${Date.now()}`,
      };
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, videos: [...product.videos, newVideo] }
          : product
      ));
    // }
  };

  const deleteProduct = (id: string) => {
    // TODO: Enable Supabase integration
    // try {
    //   await apiDeleteProduct(id);
      setProducts(prev => prev.filter(product => product.id !== id));
    // } catch (error) {
    //   console.error('Error deleting product:', error);
    //   // Fallback to local state update
    //   setProducts(prev => prev.filter(product => product.id !== id));
    // }
  };

  const deleteVideo = (productId: string, videoId: string) => {
    // TODO: Enable Supabase integration
    // try {
    //   await apiDeleteVideo(videoId);
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, videos: product.videos.filter(video => video.id !== videoId) }
          : product
      ));
    // } catch (error) {
    //   console.error('Error deleting video:', error);
    //   // Fallback to local state update
    //   setProducts(prev => prev.map(product => 
    //     product.id === productId 
    //       ? { ...product, videos: product.videos.filter(video => video.id !== videoId) }
    //       : product
    //   ));
    // }
  };

  const addPlaylist = (playlist: Omit<Playlist, 'id'>) => {
    // TODO: Enable Supabase integration
    // try {
    //   const newPlaylist = await apiCreatePlaylist(playlist);
    //   setPlaylists(prev => [...prev, newPlaylist]);
    // } catch (error) {
    //   console.error('Error creating playlist:', error);
    //   // Fallback to local state update
      const newPlaylist: Playlist = {
        ...playlist,
        id: `playlist-${Date.now()}`,
      };
      setPlaylists(prev => [...prev, newPlaylist]);
    // }
  };

  const deletePlaylist = (id: string) => {
    // TODO: Enable Supabase integration
    // try {
    //   await apiDeletePlaylist(id);
      setPlaylists(prev => prev.filter(playlist => playlist.id !== id));
    // } catch (error) {
    //   console.error('Error deleting playlist:', error);
    //   // Fallback to local state update
    //   setPlaylists(prev => prev.filter(playlist => playlist.id !== id));
    // }
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