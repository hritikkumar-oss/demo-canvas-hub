-- Update AI-Powered eB2B videos to match the eB2B naming specification
UPDATE videos 
SET title = CASE order_index
  WHEN 0 THEN 'How eB2B is disrupting traditional RTM'
  WHEN 1 THEN 'Wining model for eB2B adoption'
  WHEN 2 THEN 'Hyper personalized Landing Page (Home Screen)'
END
WHERE product_id = (SELECT id FROM products WHERE slug = 'ai-powered-eb2b');