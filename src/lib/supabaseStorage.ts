/**
 * Supabase Storage utilities for file upload and management
 */
import { supabase } from '@/integrations/supabase/client';

export type UploadResult = {
  url: string;
  path: string;
  error?: string;
};

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  bucket: string,
  file: File,
  path?: string
): Promise<UploadResult> {
  try {
    // Generate a unique path if none provided
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const extension = file.name.split('.').pop();
    const fileName = path || `${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`;
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return { url: '', path: '', error: error.message };
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      url: publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error('Upload exception:', error);
    return { 
      url: '', 
      path: '', 
      error: error instanceof Error ? error.message : 'Unknown upload error' 
    };
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(bucket: string, path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete exception:', error);
    return false;
  }
}

/**
 * Upload video file
 */
export async function uploadVideo(file: File): Promise<UploadResult> {
  return uploadFile('video-files', file);
}

/**
 * Upload thumbnail image
 */
export async function uploadThumbnail(file: File): Promise<UploadResult> {
  return uploadFile('video-thumbnails', file);
}

/**
 * Generate signed URL for private files (if needed)
 */
export async function getSignedUrl(bucket: string, path: string, expiresIn = 3600): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error('Signed URL error:', error);
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Signed URL exception:', error);
    return null;
  }
}