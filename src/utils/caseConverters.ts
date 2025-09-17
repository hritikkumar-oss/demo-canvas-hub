/**
 * Utility functions to convert between snake_case (Supabase) and camelCase (React components)
 */

// Type definitions for conversion tracking
export interface CaseMapping {
  [key: string]: string;
}

// Field mappings for different entities
export const PRODUCT_FIELD_MAPPING: CaseMapping = {
  lesson_count: 'lessonCount',
  total_duration: 'totalDuration',
  is_featured: 'isFeatured',
  created_at: 'createdAt',
  updated_at: 'updatedAt',
  created_by: 'createdBy',
  thumbnail_url: 'thumbnailUrl'
};

export const VIDEO_FIELD_MAPPING: CaseMapping = {
  product_id: 'productId',
  thumbnail_url: 'thumbnailUrl',
  video_url: 'videoUrl',
  is_new: 'isNew',
  order_index: 'orderIndex',
  created_at: 'createdAt',
  updated_at: 'updatedAt',
  created_by: 'createdBy'
};

export const PLAYLIST_FIELD_MAPPING: CaseMapping = {
  thumbnail_url: 'thumbnailUrl',
  created_at: 'createdAt',
  updated_at: 'updatedAt',
  created_by: 'createdBy'
};

/**
 * Generic function to convert keys from snake_case to camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}

/**
 * Generic function to convert keys from camelCase to snake_case
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Convert object keys from snake_case to camelCase using specific field mapping
 */
export function convertKeysSnakeToCamel<T>(
  obj: any, 
  fieldMapping: CaseMapping = {}
): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysSnakeToCamel(item, fieldMapping)) as T;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  const converted: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Use specific field mapping if available, otherwise use generic snake to camel conversion
    const camelKey = fieldMapping[key] || snakeToCamel(key);
    
    // Recursively convert nested objects
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      converted[camelKey] = convertKeysSnakeToCamel(value, fieldMapping);
    } else if (Array.isArray(value)) {
      converted[camelKey] = value.map(item => 
        typeof item === 'object' ? convertKeysSnakeToCamel(item, fieldMapping) : item
      );
    } else {
      converted[camelKey] = value;
    }
  }

  return converted as T;
}

/**
 * Convert object keys from camelCase to snake_case using specific field mapping
 */
export function convertKeysCamelToSnake<T>(
  obj: any, 
  fieldMapping: CaseMapping = {}
): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysCamelToSnake(item, fieldMapping)) as T;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  const converted: any = {};
  
  // Create reverse mapping for camelCase to snake_case
  const reverseMapping: CaseMapping = {};
  for (const [snakeKey, camelKey] of Object.entries(fieldMapping)) {
    reverseMapping[camelKey] = snakeKey;
  }

  for (const [key, value] of Object.entries(obj)) {
    // Use specific field mapping if available, otherwise use generic camel to snake conversion
    const snakeKey = reverseMapping[key] || camelToSnake(key);
    
    // Recursively convert nested objects
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      converted[snakeKey] = convertKeysCamelToSnake(value, fieldMapping);
    } else if (Array.isArray(value)) {
      converted[snakeKey] = value.map(item => 
        typeof item === 'object' ? convertKeysCamelToSnake(item, fieldMapping) : item
      );
    } else {
      converted[snakeKey] = value;
    }
  }

  return converted as T;
}

/**
 * Convert Supabase product response to camelCase
 */
export function convertProductFromSupabase(product: any): any {
  return convertKeysSnakeToCamel(product, PRODUCT_FIELD_MAPPING);
}

/**
 * Convert Supabase video response to camelCase
 */
export function convertVideoFromSupabase(video: any): any {
  return convertKeysSnakeToCamel(video, VIDEO_FIELD_MAPPING);
}

/**
 * Convert Supabase playlist response to camelCase
 */
export function convertPlaylistFromSupabase(playlist: any): any {
  return convertKeysSnakeToCamel(playlist, PLAYLIST_FIELD_MAPPING);
}

/**
 * Convert product data to snake_case for Supabase
 */
export function convertProductToSupabase(product: any): any {
  return convertKeysCamelToSnake(product, PRODUCT_FIELD_MAPPING);
}

/**
 * Convert video data to snake_case for Supabase
 */
export function convertVideoToSupabase(video: any): any {
  return convertKeysCamelToSnake(video, VIDEO_FIELD_MAPPING);
}

/**
 * Convert playlist data to snake_case for Supabase
 */
export function convertPlaylistToSupabase(playlist: any): any {
  return convertKeysCamelToSnake(playlist, PLAYLIST_FIELD_MAPPING);
}