/**
 * Real-time updates hook for Supabase data changes
 */
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { convertProductFromSupabase, convertVideoFromSupabase, convertPlaylistFromSupabase } from '@/utils/caseConverters';

export interface RealtimeCallbacks {
  onProductChange?: (product: any, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void;
  onVideoChange?: (video: any, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void;
  onPlaylistChange?: (playlist: any, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void;
}

export function useRealtimeUpdates(callbacks: RealtimeCallbacks) {
  const channelRef = useRef<any>(null);

  useEffect(() => {
    // Create a single channel for all table changes
    const channel = supabase
      .channel('admin-data-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('Product change:', payload);
          if (callbacks.onProductChange) {
            const convertedData = payload.new ? convertProductFromSupabase(payload.new) : null;
            callbacks.onProductChange(convertedData || payload.old, payload.eventType);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'videos'
        },
        (payload) => {
          console.log('Video change:', payload);
          if (callbacks.onVideoChange) {
            const convertedData = payload.new ? convertVideoFromSupabase(payload.new) : null;
            callbacks.onVideoChange(convertedData || payload.old, payload.eventType);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'playlists'
        },
        (payload) => {
          console.log('Playlist change:', payload);
          if (callbacks.onPlaylistChange) {
            const convertedData = payload.new ? convertPlaylistFromSupabase(payload.new) : null;
            callbacks.onPlaylistChange(convertedData || payload.old, payload.eventType);
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [callbacks.onProductChange, callbacks.onVideoChange, callbacks.onPlaylistChange]);

  return {
    isConnected: channelRef.current?.state === 'joined'
  };
}