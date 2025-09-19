-- Fix the typo in video title and update durations for all videos
WITH eb2b_product AS (
  SELECT id FROM products WHERE title ILIKE '%AI%eB2B%' OR title ILIKE '%AI-Powered eB2B%'
),
video_updates AS (
  SELECT 
    0 as order_index, 'How eB2B is disrupting traditional RTM' as title, '6:30' as duration
  UNION ALL SELECT 1, 'Winning model for eB2B adoption', '8:15'
  UNION ALL SELECT 2, 'Hyper personalized Landing Page (Home Screen)', '12:45'
  UNION ALL SELECT 3, 'Sales Rep Absenteeism', '7:20'
  UNION ALL SELECT 4, 'Hyper-Personalized Banners and Promotions', '9:15'
  UNION ALL SELECT 5, 'Hyper-Personalized Basket Recommendations', '11:30'
  UNION ALL SELECT 6, 'Streamlined Product Browsing', '8:45'
  UNION ALL SELECT 7, 'AI-Generated One-Click Order', '10:20'
  UNION ALL SELECT 8, 'Most Advanced Product Catalogue and Search', '13:15'
  UNION ALL SELECT 9, 'Hyper-Personalized Offers', '6:45'
  UNION ALL SELECT 10, 'Live Order Taking Module', '14:20'
  UNION ALL SELECT 11, 'Retail Finance and Payment', '9:30'
  UNION ALL SELECT 12, 'IR Based Crowdsourced Execution', '11:15'
  UNION ALL SELECT 13, 'Consumer Promo Redemption', '7:45'
  UNION ALL SELECT 14, 'Target vs Achievement Dashboard', '10:30'
  UNION ALL SELECT 15, 'Loyalty and Engagement Dashboard', '8:20'
  UNION ALL SELECT 16, 'Purchase Summary and Trends', '12:15'
  UNION ALL SELECT 17, 'Multi Lingual', '5:45'
  UNION ALL SELECT 18, 'Smart Nudges', '6:15'
)
UPDATE videos 
SET title = vu.title,
    duration = vu.duration,
    updated_at = now()
FROM video_updates vu, eb2b_product ep
WHERE videos.product_id = ep.id 
  AND videos.order_index = vu.order_index;