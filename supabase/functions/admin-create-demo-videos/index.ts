import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseServiceRoleKey) {
      throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    if (!supabaseUrl) {
      throw new Error('Missing SUPABASE_URL');
    }

    // Create Supabase client with service role key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Define products and their demo videos
    const productsWithVideos = {
      'Supervisor App': [
        'Connected to Sales Reps',
        'Hyper-Personalized Daily KPI Targets for Supervisors',
        'Skill-Will Dashboard (His + his team)',
        'Team Leaderboard',
        'Work-With Module',
        'Sales Rep LIVE Task Sharing & Tracking',
        'Route Assignment',
        'Remote Order Feature',
        'Supervisor + Sales Team KPI Review',
        'Sales Reps outlet level tracking'
      ],
      'SALESLENS': [
        'Order Summary',
        'Active User Summary',
        'Unique Sales Reps & Outlets Ordered',
        'Target vs Achievement',
        'Sales Growth',
        'Effectively Covered Outlets',
        'PJP Productivity',
        'Visit Compliance',
        'Order Fill Rate',
        'Delivery & Returns',
        'Average Order Value',
        'Lines Per call',
        'Unique SKU per outlet',
        'Business Loss',
        'AI Recommendations Impact',
        'Trend Charts',
        'Trending Products',
        'User View'
      ],
      'eB2B': [
        'How eB2B is disrupting traditional RTM',
        'Wining model for eB2B adoption',
        'Hyper personalized Landing Page (Home Screen)',
        'Sales Rep Absenteeism',
        'Hyper-Personalized Banners and Promotions',
        'Hyper-Personalized Basket Recommendations',
        'Streamlined Product Browsing',
        'AI-Generated One-Click Order',
        'Most Advanced Product Catalogue and Search',
        'Hyper-Personalized Offers',
        'Live Order Taking Module',
        'Retail Finance and Payment',
        'IR Based Crowdsourced Execution',
        'Consumer Promo Redemption',
        'Target vs Achievement Dashboard',
        'Loyalty and Engagement Dashboard',
        'Purchase Summary and Trends',
        'Multi Lingual',
        'Smart Nudges'
      ]
    };

    console.log('Starting demo video creation process...');

    // First, ensure all products exist
    for (const [productTitle, videoTitles] of Object.entries(productsWithVideos)) {
      console.log(`Processing product: ${productTitle}`);
      
      // Check if product exists, if not create it
      let productSlug = productTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      if (productTitle === 'eB2B') {
        productSlug = 'eb2b';
      }
      
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id, title')
        .ilike('title', `%${productTitle.includes('eB2B') ? 'eb2b' : productTitle}%`)
        .maybeSingle();

      let productId;
      
      if (existingProduct) {
        productId = existingProduct.id;
        console.log(`Found existing product: ${existingProduct.title} (${productId})`);
        
        // Update the title to match exactly
        await supabase
          .from('products')
          .update({ 
            title: productTitle,
            updated_at: new Date().toISOString()
          })
          .eq('id', productId);
      } else {
        console.log(`Creating new product: ${productTitle}`);
        const { data: newProduct, error: productError } = await supabase
          .from('products')
          .insert({
            title: productTitle,
            slug: productSlug,
            description: `Demo videos for ${productTitle}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (productError) {
          console.error(`Error creating product ${productTitle}:`, productError);
          throw productError;
        }
        
        productId = newProduct.id;
        console.log(`Created product: ${productTitle} (${productId})`);
      }

      // Now create/update videos for this product
      for (let i = 0; i < videoTitles.length; i++) {
        const videoTitle = videoTitles[i];
        console.log(`Processing video: ${videoTitle}`);
        
        // Check if video already exists for this product
        const { data: existingVideo } = await supabase
          .from('videos')
          .select('id, title')
          .eq('product_id', productId)
          .eq('title', videoTitle)
          .maybeSingle();

        if (existingVideo) {
          console.log(`Updating existing video: ${videoTitle} (${existingVideo.id})`);
          await supabase
            .from('videos')
            .update({ 
              updated_at: new Date().toISOString()
            })
            .eq('id', existingVideo.id);
        } else {
          console.log(`Creating new video: ${videoTitle}`);
          const videoSlug = videoTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          
          const { error: videoError } = await supabase
            .from('videos')
            .insert({
              title: videoTitle,
              slug: videoSlug,
              description: `Demo video: ${videoTitle}`,
              product_id: productId,
              order_index: i,
              video_url: null, // Set to null as requested
              duration: '0:00',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (videoError) {
            console.error(`Error creating video ${videoTitle}:`, videoError);
            throw videoError;
          }
        }
      }
    }

    console.log('Demo video creation completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Demo videos created/updated successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in admin-create-demo-videos:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});