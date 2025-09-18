import { supabase } from '@/integrations/supabase/client';

export async function createDemoVideos() {
  try {
    console.log('Calling admin-create-demo-videos function...');
    
    const { data, error } = await supabase.functions.invoke('admin-create-demo-videos', {
      body: {}
    });

    if (error) {
      console.error('Error calling admin-create-demo-videos:', error);
      throw error;
    }

    console.log('Demo videos created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createDemoVideos:', error);
    throw error;
  }
}