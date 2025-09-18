import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DemoVideo {
  title: string
  order_index: number
}

interface ProductVideos {
  productName: string
  productSlug: string
  videos: DemoVideo[]
}

const demoVideosData: ProductVideos[] = [
  {
    productName: "Supervisor App",
    productSlug: "supervisor",
    videos: [
      { title: "Connected to Sales Reps", order_index: 1 },
      { title: "Hyper-Personalized Daily KPI Targets for Supervisors", order_index: 2 },
      { title: "Skill-Will Dashboard (His + his team)", order_index: 3 },
      { title: "Team Leaderboard", order_index: 4 },
      { title: "Work-With Module", order_index: 5 },
      { title: "Sales Rep LIVE Task Sharing & Tracking", order_index: 6 },
      { title: "Route Assignment", order_index: 7 },
      { title: "Remote Order Feature", order_index: 8 },
      { title: "Supervisor + Sales Team KPI Review", order_index: 9 },
      { title: "Sales Reps outlet level tracking", order_index: 10 }
    ]
  },
  {
    productName: "SALESLENS",
    productSlug: "saleslens",
    videos: [
      { title: "Order Summary", order_index: 1 },
      { title: "Active User Summary", order_index: 2 },
      { title: "Unique Sales Reps & Outlets Ordered", order_index: 3 },
      { title: "Target vs Achievement", order_index: 4 },
      { title: "Sales Growth", order_index: 5 },
      { title: "Effectively Covered Outlets", order_index: 6 },
      { title: "PJP Productivity", order_index: 7 },
      { title: "Visit Compliance", order_index: 8 },
      { title: "Order Fill Rate", order_index: 9 },
      { title: "Delivery & Returns", order_index: 10 },
      { title: "Average Order Value", order_index: 11 },
      { title: "Lines Per call", order_index: 12 },
      { title: "Unique SKU per outlet", order_index: 13 },
      { title: "Business Loss", order_index: 14 },
      { title: "AI Recommendations Impact", order_index: 15 },
      { title: "Trend Charts", order_index: 16 },
      { title: "Trending Products", order_index: 17 },
      { title: "User View", order_index: 18 }
    ]
  },
  {
    productName: "eB2B",
    productSlug: "eb2b",
    videos: [
      { title: "How eB2B is disrupting traditional RTM", order_index: 1 },
      { title: "Wining model for eB2B adoption", order_index: 2 },
      { title: "Hyper personalized Landing Page (Home Screen)", order_index: 3 },
      { title: "Sales Rep Absenteeism", order_index: 4 },
      { title: "Hyper-Personalized Banners and Promotions", order_index: 5 },
      { title: "Hyper-Personalized Basket Recommendations", order_index: 6 },
      { title: "Streamlined Product Browsing", order_index: 7 },
      { title: "AI-Generated One-Click Order", order_index: 8 },
      { title: "Most Advanced Product Catalogue and Search", order_index: 9 },
      { title: "Hyper-Personalized Offers", order_index: 10 },
      { title: "Live Order Taking Module", order_index: 11 },
      { title: "Retail Finance and Payment", order_index: 12 },
      { title: "IR Based Crowdsourced Execution", order_index: 13 },
      { title: "Consumer Promo Redemption", order_index: 14 },
      { title: "Target vs Achievement Dashboard", order_index: 15 },
      { title: "Loyalty and Engagement Dashboard", order_index: 16 },
      { title: "Purchase Summary and Trends", order_index: 17 },
      { title: "Multi Lingual", order_index: 18 },
      { title: "Smart Nudges", order_index: 19 }
    ]
  }
]

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Starting demo videos creation...')

    const results = []

    for (const productData of demoVideosData) {
      console.log(`Processing ${productData.productName}...`)
      
      // Find the product by matching different potential names/slugs
      let { data: products, error: productError } = await supabase
        .from('products')
        .select('id, title, slug')
        .or(`slug.eq.${productData.productSlug},slug.ilike.%${productData.productSlug}%,title.ilike.%${productData.productName}%`)
      
      if (productError) {
        console.error(`Error finding product ${productData.productName}:`, productError)
        continue
      }

      if (!products || products.length === 0) {
        console.log(`Product not found for ${productData.productName}, creating it...`)
        
        // Create the product if it doesn't exist
        const { data: newProduct, error: createError } = await supabase
          .from('products')
          .insert({
            title: productData.productName,
            slug: productData.productSlug,
            description: `Demo videos for ${productData.productName}`,
            category: 'Demo',
            lesson_count: productData.videos.length,
            total_duration: '0:00'
          })
          .select()
          .single()

        if (createError) {
          console.error(`Error creating product ${productData.productName}:`, createError)
          continue
        }

        products = [newProduct]
      }

      const product = products[0]
      console.log(`Found/created product: ${product.title} (${product.id})`)

      // Process each video for this product
      for (const videoData of productData.videos) {
        console.log(`Processing video: ${videoData.title}`)
        
        // Check if video already exists for this product
        const { data: existingVideos } = await supabase
          .from('videos')
          .select('id, title')
          .eq('product_id', product.id)
          .eq('title', videoData.title)

        if (existingVideos && existingVideos.length > 0) {
          // Update existing video
          const { error: updateError } = await supabase
            .from('videos')
            .update({
              order_index: videoData.order_index,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingVideos[0].id)

          if (updateError) {
            console.error(`Error updating video ${videoData.title}:`, updateError)
          } else {
            console.log(`Updated video: ${videoData.title}`)
          }
        } else {
          // Create new video
          const slug = videoData.title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
          
          const { error: insertError } = await supabase
            .from('videos')
            .insert({
              title: videoData.title,
              slug: slug,
              description: `Demo video: ${videoData.title}`,
              product_id: product.id,
              order_index: videoData.order_index,
              duration: '5:00',
              video_url: null,
              thumbnail_url: null,
              is_new: false
            })

          if (insertError) {
            console.error(`Error creating video ${videoData.title}:`, insertError)
          } else {
            console.log(`Created video: ${videoData.title}`)
          }
        }
      }

      // Update product lesson count
      const { error: updateProductError } = await supabase
        .from('products')
        .update({
          lesson_count: productData.videos.length,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id)

      if (updateProductError) {
        console.error(`Error updating product lesson count:`, updateProductError)
      }

      results.push({
        product: product.title,
        videosProcessed: productData.videos.length,
        success: true
      })
    }

    console.log('Demo videos creation completed')
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Demo videos created/updated successfully',
        results: results
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
    
  } catch (error) {
    console.error('Error in create-demo-videos function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})