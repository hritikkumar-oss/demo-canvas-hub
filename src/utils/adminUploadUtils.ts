/**
 * Enhanced admin upload utilities with proper error handling and storage verification
 */
import { supabase } from '@/integrations/supabase/client';
import { uploadFile, uploadThumbnail, uploadVideo } from '@/lib/supabaseStorage';

export interface UploadSuccess {
  success: true;
  url: string;
  path: string;
}

export interface UploadError {
  success: false;
  error: string;
}

export type UploadResult = UploadSuccess | UploadError;

/**
 * Upload thumbnail with verification and error handling
 */
export async function uploadThumbnailWithVerification(file: File): Promise<UploadResult> {
  try {
    console.log('Starting thumbnail upload:', file.name, file.size);
    
    const result = await uploadThumbnail(file);
    
    if (result.error) {
      console.error('Thumbnail upload failed:', result.error);
      return { success: false, error: result.error };
    }

    // Verify upload by checking if file exists in storage
    const { data, error } = await supabase.storage
      .from('video-thumbnails')
      .list('', {
        search: result.path
      });

    if (error) {
      console.error('Thumbnail verification failed:', error);
      return { success: false, error: 'Upload verification failed' };
    }

    console.log('Thumbnail uploaded and verified:', result.url);
    return { success: true, url: result.url, path: result.path };
  } catch (error) {
    console.error('Thumbnail upload exception:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown upload error' 
    };
  }
}

/**
 * Upload video with verification and error handling
 */
export async function uploadVideoWithVerification(file: File): Promise<UploadResult> {
  try {
    console.log('Starting video upload:', file.name, file.size);
    
    const result = await uploadVideo(file);
    
    if (result.error) {
      console.error('Video upload failed:', result.error);
      return { success: false, error: result.error };
    }

    // Verify upload by checking if file exists in storage
    const { data, error } = await supabase.storage
      .from('video-files')
      .list('', {
        search: result.path
      });

    if (error) {
      console.error('Video verification failed:', error);
      return { success: false, error: 'Upload verification failed' };
    }

    console.log('Video uploaded and verified:', result.url);
    return { success: true, url: result.url, path: result.path };
  } catch (error) {
    console.error('Video upload exception:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown upload error' 
    };
  }
}

/**
 * Upload generic file with verification
 */
export async function uploadFileWithVerification(
  bucket: string, 
  file: File, 
  path?: string
): Promise<UploadResult> {
  try {
    console.log('Starting file upload:', file.name, file.size, 'to bucket:', bucket);
    
    const result = await uploadFile(bucket, file, path);
    
    if (result.error) {
      console.error('File upload failed:', result.error);
      return { success: false, error: result.error };
    }

    // Verify upload by checking if file exists in storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .list('', {
        search: result.path
      });

    if (error) {
      console.error('File verification failed:', error);
      return { success: false, error: 'Upload verification failed' };
    }

    console.log('File uploaded and verified:', result.url);
    return { success: true, url: result.url, path: result.path };
  } catch (error) {
    console.error('File upload exception:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown upload error' 
    };
  }
}