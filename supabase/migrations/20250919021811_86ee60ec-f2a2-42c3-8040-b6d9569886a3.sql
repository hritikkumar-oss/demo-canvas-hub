-- Get the product ID for AI-Powered eB2B
WITH eb2b_product AS (
  SELECT id FROM products WHERE title ILIKE '%AI%eB2B%' OR title ILIKE '%AI-Powered eB2B%'
),
-- First delete any excess videos beyond 19
videos_to_delete AS (
  SELECT v.id 
  FROM videos v
  JOIN eb2b_product p ON v.product_id = p.id
  WHERE v.order_index >= 19
)
DELETE FROM videos WHERE id IN (SELECT id FROM videos_to_delete);

-- Update existing videos with new titles
WITH eb2b_product AS (
  SELECT id FROM products WHERE title ILIKE '%AI%eB2B%' OR title ILIKE '%AI-Powered eB2B%'
),
video_updates AS (
  SELECT 
    0 as order_index, 'How eB2B is disrupting traditional RTM' as title
  UNION ALL SELECT 1, 'Wining model for eB2B adoption'
  UNION ALL SELECT 2, 'Hyper personalized Landing Page (Home Screen)'
  UNION ALL SELECT 3, 'Sales Rep Absenteeism'
  UNION ALL SELECT 4, 'Hyper-Personalized Banners and Promotions'
  UNION ALL SELECT 5, 'Hyper-Personalized Basket Recommendations'
  UNION ALL SELECT 6, 'Streamlined Product Browsing'
  UNION ALL SELECT 7, 'AI-Generated One-Click Order'
  UNION ALL SELECT 8, 'Most Advanced Product Catalogue and Search'
  UNION ALL SELECT 9, 'Hyper-Personalized Offers'
  UNION ALL SELECT 10, 'Live Order Taking Module'
  UNION ALL SELECT 11, 'Retail Finance and Payment'
  UNION ALL SELECT 12, 'IR Based Crowdsourced Execution'
  UNION ALL SELECT 13, 'Consumer Promo Redemption'
  UNION ALL SELECT 14, 'Target vs Achievement Dashboard'
  UNION ALL SELECT 15, 'Loyalty and Engagement Dashboard'
  UNION ALL SELECT 16, 'Purchase Summary and Trends'
  UNION ALL SELECT 17, 'Multi Lingual'
  UNION ALL SELECT 18, 'Smart Nudges'
)
UPDATE videos 
SET title = vu.title,
    updated_at = now()
FROM video_updates vu, eb2b_product ep
WHERE videos.product_id = ep.id 
  AND videos.order_index = vu.order_index;

-- Insert any missing videos (in case there are fewer than 19)
WITH eb2b_product AS (
  SELECT id FROM products WHERE title ILIKE '%AI%eB2B%' OR title ILIKE '%AI-Powered eB2B%'
),
video_updates AS (
  SELECT 
    0 as order_index, 'How eB2B is disrupting traditional RTM' as title
  UNION ALL SELECT 1, 'Wining model for eB2B adoption'
  UNION ALL SELECT 2, 'Hyper personalized Landing Page (Home Screen)'
  UNION ALL SELECT 3, 'Sales Rep Absenteeism'
  UNION ALL SELECT 4, 'Hyper-Personalized Banners and Promotions'
  UNION ALL SELECT 5, 'Hyper-Personalized Basket Recommendations'
  UNION ALL SELECT 6, 'Streamlined Product Browsing'
  UNION ALL SELECT 7, 'AI-Generated One-Click Order'
  UNION ALL SELECT 8, 'Most Advanced Product Catalogue and Search'
  UNION ALL SELECT 9, 'Hyper-Personalized Offers'
  UNION ALL SELECT 10, 'Live Order Taking Module'
  UNION ALL SELECT 11, 'Retail Finance and Payment'
  UNION ALL SELECT 12, 'IR Based Crowdsourced Execution'
  UNION ALL SELECT 13, 'Consumer Promo Redemption'
  UNION ALL SELECT 14, 'Target vs Achievement Dashboard'
  UNION ALL SELECT 15, 'Loyalty and Engagement Dashboard'
  UNION ALL SELECT 16, 'Purchase Summary and Trends'
  UNION ALL SELECT 17, 'Multi Lingual'
  UNION ALL SELECT 18, 'Smart Nudges'
),
missing_videos AS (
  SELECT vu.order_index, vu.title, ep.id as product_id
  FROM video_updates vu
  CROSS JOIN eb2b_product ep
  LEFT JOIN videos v ON v.product_id = ep.id AND v.order_index = vu.order_index
  WHERE v.id IS NULL
)
INSERT INTO videos (product_id, title, order_index, slug, created_by)
SELECT 
  product_id,
  title,
  order_index,
  lower(replace(replace(title, ' ', '-'), '&', 'and')),
  null
FROM missing_videos;