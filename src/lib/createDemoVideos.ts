import { supabase } from "@/integrations/supabase/client";

export const createDemoVideos = async () => {
  try {
    console.log('Calling create-demo-videos function...');
    
    const { data, error } = await supabase.functions.invoke('create-demo-videos', {
      body: {}
    });

    if (error) {
      console.error('Error calling create-demo-videos:', error);
      throw error;
    }

    console.log('Demo videos creation response:', data);
    return data;
  } catch (error) {
    console.error('Error in createDemoVideos:', error);
    throw error;
  }
};