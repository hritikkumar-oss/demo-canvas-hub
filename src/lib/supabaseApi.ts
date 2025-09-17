/**
 * Supabase API functions with case conversion
 */
import { supabase } from '@/lib/supabase';
import { 
  convertProductFromSupabase, 
  convertVideoFromSupabase, 
  convertPlaylistFromSupabase,
  convertProductToSupabase,
  convertVideoToSupabase,
  convertPlaylistToSupabase
} from '@/utils/caseConverters';

// Product operations
export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data?.map(convertProductFromSupabase) || [];
}

export async function fetchProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  
  return data ? convertProductFromSupabase(data) : null;
}

export async function createProduct(product: any) {
  const supabaseProduct = convertProductToSupabase(product);
  
  const { data, error } = await supabase
    .from('products')
    .insert(supabaseProduct)
    .select()
    .single();

  if (error) throw error;
  
  return convertProductFromSupabase(data);
}

export async function updateProduct(id: string, updates: any) {
  const supabaseUpdates = convertProductToSupabase(updates);
  console.log("Updating product:", id, "with payload:", supabaseUpdates);
  
  try {
    // Use Edge Function for secure admin updates with service role key
    const { data, error } = await supabase.functions.invoke('admin-update-product', {
      body: { id, updates: supabaseUpdates }
    });

    console.log("Admin function response:", { data, error });

    if (error) {
      console.error("Admin function error:", error);
      throw new Error(error.message);
    }

    if (!data) {
      const errorMsg = "Product not found or permission denied for update";
      console.error(errorMsg, "Product ID:", id);
      throw new Error(errorMsg);
    }
    
    return convertProductFromSupabase(data);
  } catch (error) {
    console.error("Product update failed:", error);
    throw error;
  }
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Video operations
export async function fetchVideosByProductId(productId: string) {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('product_id', productId)
    .order('order_index', { ascending: true });

  if (error) throw error;
  
  return data?.map(convertVideoFromSupabase) || [];
}

export async function fetchVideoById(id: string) {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  
  return data ? convertVideoFromSupabase(data) : null;
}

export async function createVideo(video: any) {
  const supabaseVideo = convertVideoToSupabase(video);
  
  const { data, error } = await supabase
    .from('videos')
    .insert(supabaseVideo)
    .select()
    .single();

  if (error) throw error;
  
  return convertVideoFromSupabase(data);
}

export async function updateVideo(id: string, updates: any) {
  const supabaseUpdates = convertVideoToSupabase(updates);
  console.log("Updating video:", id, "with payload:", supabaseUpdates);
  
  try {
    // Use Edge Function for secure admin updates with service role key
    const { data, error } = await supabase.functions.invoke('admin-update-video', {
      body: { id, updates: supabaseUpdates }
    });

    console.log("Admin video function response:", { data, error });

    if (error) {
      console.error("Admin video function error:", error);
      throw new Error(error.message);
    }

    if (!data) {
      const errorMsg = "Video not found or permission denied for update";
      console.error(errorMsg, "Video ID:", id);
      throw new Error(errorMsg);
    }
    
    return convertVideoFromSupabase(data);
  } catch (error) {
    console.error("Video update failed:", error);
    throw error;
  }
}

export async function deleteVideo(id: string) {
  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Playlist operations
export async function fetchPlaylists() {
  const { data, error } = await supabase
    .from('playlists')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data?.map(convertPlaylistFromSupabase) || [];
}

export async function fetchPlaylistById(id: string) {
  const { data, error } = await supabase
    .from('playlists')
    .select(`
      *,
      playlist_videos(
        id,
        order_index,
        video_id,
        videos(*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  
  if (!data) return null;

  // Convert playlist and embedded videos
  const playlist = convertPlaylistFromSupabase(data);
  
  // Convert playlist videos and their associated video data
  if (data.playlist_videos) {
    playlist.videos = data.playlist_videos
      .sort((a: any, b: any) => a.order_index - b.order_index)
      .map((pv: any) => convertVideoFromSupabase(pv.videos));
  }

  return playlist;
}

export async function createPlaylist(playlist: any) {
  const supabasePlaylist = convertPlaylistToSupabase(playlist);
  
  const { data, error } = await supabase
    .from('playlists')
    .insert(supabasePlaylist)
    .select()
    .single();

  if (error) throw error;
  
  return convertPlaylistFromSupabase(data);
}

export async function updatePlaylist(id: string, updates: any) {
  const supabaseUpdates = convertPlaylistToSupabase(updates);
  
  const { data, error } = await supabase
    .from('playlists')
    .update(supabaseUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  
  return convertPlaylistFromSupabase(data);
}

export async function deletePlaylist(id: string) {
  const { error } = await supabase
    .from('playlists')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Helper function to fetch products with their videos
export async function fetchProductsWithVideos() {
  const products = await fetchProducts();
  
  // Fetch videos for each product
  const productsWithVideos = await Promise.all(
    products.map(async (product: any) => {
      const videos = await fetchVideosByProductId(product.id);
      return {
        ...product,
        videos
      };
    })
  );

  return productsWithVideos;
}