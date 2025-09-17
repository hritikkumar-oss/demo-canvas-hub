import { describe, it, expect } from 'vitest';
import {
  snakeToCamel,
  camelToSnake,
  convertKeysSnakeToCamel,
  convertKeysCamelToSnake,
  convertProductFromSupabase,
  convertVideoFromSupabase,
  convertPlaylistFromSupabase,
  convertProductToSupabase,
  convertVideoToSupabase,
  convertPlaylistToSupabase,
  PRODUCT_FIELD_MAPPING,
  VIDEO_FIELD_MAPPING,
  PLAYLIST_FIELD_MAPPING,
} from '../caseConverters';

describe('caseConverters', () => {
  describe('snakeToCamel', () => {
    it('converts snake_case to camelCase', () => {
      expect(snakeToCamel('hello_world')).toBe('helloWorld');
      expect(snakeToCamel('test_case_example')).toBe('testCaseExample');
      expect(snakeToCamel('single')).toBe('single');
      expect(snakeToCamel('a_b_c_d')).toBe('aBCD');
    });
  });

  describe('camelToSnake', () => {
    it('converts camelCase to snake_case', () => {
      expect(camelToSnake('helloWorld')).toBe('hello_world');
      expect(camelToSnake('testCaseExample')).toBe('test_case_example');
      expect(camelToSnake('single')).toBe('single');
      expect(camelToSnake('aBCD')).toBe('a_b_c_d');
    });
  });

  describe('convertKeysSnakeToCamel', () => {
    it('converts object keys from snake_case to camelCase', () => {
      const input = {
        lesson_count: 10,
        total_duration: '5 hours',
        is_new: true,
        simple_field: 'test'
      };

      const result = convertKeysSnakeToCamel(input, PRODUCT_FIELD_MAPPING);

      expect(result).toEqual({
        lessonCount: 10,
        totalDuration: '5 hours',
        isNew: true,
        simpleField: 'test'
      });
    });

    it('handles nested objects', () => {
      const input = {
        user_info: {
          first_name: 'John',
          last_name: 'Doe'
        }
      };

      const result = convertKeysSnakeToCamel(input);

      expect(result).toEqual({
        userInfo: {
          firstName: 'John',
          lastName: 'Doe'
        }
      });
    });

    it('handles arrays', () => {
      const input = [
        { lesson_count: 5 },
        { lesson_count: 10 }
      ];

      const result = convertKeysSnakeToCamel(input, PRODUCT_FIELD_MAPPING);

      expect(result).toEqual([
        { lessonCount: 5 },
        { lessonCount: 10 }
      ]);
    });
  });

  describe('convertKeysCamelToSnake', () => {
    it('converts object keys from camelCase to snake_case', () => {
      const input = {
        lessonCount: 10,
        totalDuration: '5 hours',
        isNew: true,
        simpleField: 'test'
      };

      const result = convertKeysCamelToSnake(input, PRODUCT_FIELD_MAPPING);

      expect(result).toEqual({
        lesson_count: 10,
        total_duration: '5 hours',
        is_new: true,
        simple_field: 'test'
      });
    });
  });

  describe('Product conversions', () => {
    it('converts product from Supabase format', () => {
      const supabaseProduct = {
        id: '123',
        title: 'Test Product',
        lesson_count: 15,
        total_duration: '10 hours',
        is_featured: true,
        created_at: '2024-01-01T00:00:00Z'
      };

      const result = convertProductFromSupabase(supabaseProduct);

      expect(result).toEqual({
        id: '123',
        title: 'Test Product',
        lessonCount: 15,
        totalDuration: '10 hours',
        isFeatured: true,
        createdAt: '2024-01-01T00:00:00Z'
      });
    });

    it('converts product to Supabase format', () => {
      const product = {
        id: '123',
        title: 'Test Product',
        lessonCount: 15,
        totalDuration: '10 hours',
        isFeatured: true,
        createdAt: '2024-01-01T00:00:00Z'
      };

      const result = convertProductToSupabase(product);

      expect(result).toEqual({
        id: '123',
        title: 'Test Product',
        lesson_count: 15,
        total_duration: '10 hours',
        is_featured: true,
        created_at: '2024-01-01T00:00:00Z'
      });
    });
  });

  describe('Video conversions', () => {
    it('converts video from Supabase format', () => {
      const supabaseVideo = {
        id: '456',
        title: 'Test Video',
        product_id: '123',
        is_new: true,
        thumbnail_url: 'https://example.com/thumb.jpg',
        video_url: 'https://example.com/video.mp4'
      };

      const result = convertVideoFromSupabase(supabaseVideo);

      expect(result).toEqual({
        id: '456',
        title: 'Test Video',
        productId: '123',
        isNew: true,
        thumbnailUrl: 'https://example.com/thumb.jpg',
        videoUrl: 'https://example.com/video.mp4'
      });
    });

    it('converts video to Supabase format', () => {
      const video = {
        id: '456',
        title: 'Test Video',
        productId: '123',
        isNew: true,
        thumbnailUrl: 'https://example.com/thumb.jpg',
        videoUrl: 'https://example.com/video.mp4'
      };

      const result = convertVideoToSupabase(video);

      expect(result).toEqual({
        id: '456',
        title: 'Test Video',
        product_id: '123',
        is_new: true,
        thumbnail_url: 'https://example.com/thumb.jpg',
        video_url: 'https://example.com/video.mp4'
      });
    });
  });

  describe('Playlist conversions', () => {
    it('converts playlist from Supabase format', () => {
      const supabasePlaylist = {
        id: '789',
        title: 'Test Playlist',
        thumbnail_url: 'https://example.com/thumb.jpg',
        created_at: '2024-01-01T00:00:00Z'
      };

      const result = convertPlaylistFromSupabase(supabasePlaylist);

      expect(result).toEqual({
        id: '789',
        title: 'Test Playlist',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        createdAt: '2024-01-01T00:00:00Z'
      });
    });

    it('converts playlist to Supabase format', () => {
      const playlist = {
        id: '789',
        title: 'Test Playlist',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        createdAt: '2024-01-01T00:00:00Z'
      };

      const result = convertPlaylistToSupabase(playlist);

      expect(result).toEqual({
        id: '789',
        title: 'Test Playlist',
        thumbnail_url: 'https://example.com/thumb.jpg',
        created_at: '2024-01-01T00:00:00Z'
      });
    });
  });

  describe('Edge cases', () => {
    it('handles null and undefined values', () => {
      expect(convertKeysSnakeToCamel(null)).toBe(null);
      expect(convertKeysSnakeToCamel(undefined)).toBe(undefined);
      expect(convertKeysCamelToSnake(null)).toBe(null);
      expect(convertKeysCamelToSnake(undefined)).toBe(undefined);
    });

    it('handles primitive values', () => {
      expect(convertKeysSnakeToCamel('string')).toBe('string');
      expect(convertKeysSnakeToCamel(123)).toBe(123);
      expect(convertKeysSnakeToCamel(true)).toBe(true);
    });

    it('handles empty objects and arrays', () => {
      expect(convertKeysSnakeToCamel({})).toEqual({});
      expect(convertKeysSnakeToCamel([])).toEqual([]);
      expect(convertKeysCamelToSnake({})).toEqual({});
      expect(convertKeysCamelToSnake([])).toEqual([]);
    });
  });
});