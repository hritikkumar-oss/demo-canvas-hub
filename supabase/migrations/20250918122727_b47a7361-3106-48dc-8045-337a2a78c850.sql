-- Create demo videos for Supervisor App
DO $$
DECLARE
    supervisor_id uuid;
    saleslens_id uuid;
    eb2b_id uuid;
BEGIN
    -- Get product IDs
    SELECT id INTO supervisor_id FROM products WHERE slug = 'supervisor';
    SELECT id INTO saleslens_id FROM products WHERE slug = 'saleslens';
    SELECT id INTO eb2b_id FROM products WHERE slug = 'eb2b';

    -- Delete existing demo videos for these products to avoid conflicts
    DELETE FROM videos WHERE product_id IN (supervisor_id, saleslens_id, eb2b_id);

    -- Insert Supervisor App videos
    INSERT INTO videos (title, slug, description, product_id, order_index, duration, is_new, created_at, updated_at) VALUES
    ('Connected to Sales Reps', 'connected-to-sales-reps', 'Demo video: Connected to Sales Reps', supervisor_id, 1, '5:00', false, now(), now()),
    ('Hyper-Personalized Daily KPI Targets for Supervisors', 'hyper-personalized-daily-kpi-targets-for-supervisors', 'Demo video: Hyper-Personalized Daily KPI Targets for Supervisors', supervisor_id, 2, '5:00', false, now(), now()),
    ('Skill-Will Dashboard (His + his team)', 'skill-will-dashboard-his-his-team', 'Demo video: Skill-Will Dashboard (His + his team)', supervisor_id, 3, '5:00', false, now(), now()),
    ('Team Leaderboard', 'team-leaderboard', 'Demo video: Team Leaderboard', supervisor_id, 4, '5:00', false, now(), now()),
    ('Work-With Module', 'work-with-module', 'Demo video: Work-With Module', supervisor_id, 5, '5:00', false, now(), now()),
    ('Sales Rep LIVE Task Sharing & Tracking', 'sales-rep-live-task-sharing-tracking', 'Demo video: Sales Rep LIVE Task Sharing & Tracking', supervisor_id, 6, '5:00', false, now(), now()),
    ('Route Assignment', 'route-assignment', 'Demo video: Route Assignment', supervisor_id, 7, '5:00', false, now(), now()),
    ('Remote Order Feature', 'remote-order-feature', 'Demo video: Remote Order Feature', supervisor_id, 8, '5:00', false, now(), now()),
    ('Supervisor + Sales Team KPI Review', 'supervisor-sales-team-kpi-review', 'Demo video: Supervisor + Sales Team KPI Review', supervisor_id, 9, '5:00', false, now(), now()),
    ('Sales Reps outlet level tracking', 'sales-reps-outlet-level-tracking', 'Demo video: Sales Reps outlet level tracking', supervisor_id, 10, '5:00', false, now(), now());

    -- Insert SALESLENS videos
    INSERT INTO videos (title, slug, description, product_id, order_index, duration, is_new, created_at, updated_at) VALUES
    ('Order Summary', 'order-summary', 'Demo video: Order Summary', saleslens_id, 1, '5:00', false, now(), now()),
    ('Active User Summary', 'active-user-summary', 'Demo video: Active User Summary', saleslens_id, 2, '5:00', false, now(), now()),
    ('Unique Sales Reps & Outlets Ordered', 'unique-sales-reps-outlets-ordered', 'Demo video: Unique Sales Reps & Outlets Ordered', saleslens_id, 3, '5:00', false, now(), now()),
    ('Target vs Achievement', 'target-vs-achievement', 'Demo video: Target vs Achievement', saleslens_id, 4, '5:00', false, now(), now()),
    ('Sales Growth', 'sales-growth', 'Demo video: Sales Growth', saleslens_id, 5, '5:00', false, now(), now()),
    ('Effectively Covered Outlets', 'effectively-covered-outlets', 'Demo video: Effectively Covered Outlets', saleslens_id, 6, '5:00', false, now(), now()),
    ('PJP Productivity', 'pjp-productivity', 'Demo video: PJP Productivity', saleslens_id, 7, '5:00', false, now(), now()),
    ('Visit Compliance', 'visit-compliance', 'Demo video: Visit Compliance', saleslens_id, 8, '5:00', false, now(), now()),
    ('Order Fill Rate', 'order-fill-rate', 'Demo video: Order Fill Rate', saleslens_id, 9, '5:00', false, now(), now()),
    ('Delivery & Returns', 'delivery-returns', 'Demo video: Delivery & Returns', saleslens_id, 10, '5:00', false, now(), now()),
    ('Average Order Value', 'average-order-value', 'Demo video: Average Order Value', saleslens_id, 11, '5:00', false, now(), now()),
    ('Lines Per call', 'lines-per-call', 'Demo video: Lines Per call', saleslens_id, 12, '5:00', false, now(), now()),
    ('Unique SKU per outlet', 'unique-sku-per-outlet', 'Demo video: Unique SKU per outlet', saleslens_id, 13, '5:00', false, now(), now()),
    ('Business Loss', 'business-loss', 'Demo video: Business Loss', saleslens_id, 14, '5:00', false, now(), now()),
    ('AI Recommendations Impact', 'ai-recommendations-impact', 'Demo video: AI Recommendations Impact', saleslens_id, 15, '5:00', false, now(), now()),
    ('Trend Charts', 'trend-charts', 'Demo video: Trend Charts', saleslens_id, 16, '5:00', false, now(), now()),
    ('Trending Products', 'trending-products', 'Demo video: Trending Products', saleslens_id, 17, '5:00', false, now(), now()),
    ('User View', 'user-view', 'Demo video: User View', saleslens_id, 18, '5:00', false, now(), now());

    -- Insert eB2B videos
    INSERT INTO videos (title, slug, description, product_id, order_index, duration, is_new, created_at, updated_at) VALUES
    ('How eB2B is disrupting traditional RTM', 'how-eb2b-is-disrupting-traditional-rtm', 'Demo video: How eB2B is disrupting traditional RTM', eb2b_id, 1, '5:00', false, now(), now()),
    ('Wining model for eB2B adoption', 'wining-model-for-eb2b-adoption', 'Demo video: Wining model for eB2B adoption', eb2b_id, 2, '5:00', false, now(), now()),
    ('Hyper personalized Landing Page (Home Screen)', 'hyper-personalized-landing-page-home-screen', 'Demo video: Hyper personalized Landing Page (Home Screen)', eb2b_id, 3, '5:00', false, now(), now()),
    ('Sales Rep Absenteeism', 'sales-rep-absenteeism', 'Demo video: Sales Rep Absenteeism', eb2b_id, 4, '5:00', false, now(), now()),
    ('Hyper-Personalized Banners and Promotions', 'hyper-personalized-banners-and-promotions', 'Demo video: Hyper-Personalized Banners and Promotions', eb2b_id, 5, '5:00', false, now(), now()),
    ('Hyper-Personalized Basket Recommendations', 'hyper-personalized-basket-recommendations', 'Demo video: Hyper-Personalized Basket Recommendations', eb2b_id, 6, '5:00', false, now(), now()),
    ('Streamlined Product Browsing', 'streamlined-product-browsing', 'Demo video: Streamlined Product Browsing', eb2b_id, 7, '5:00', false, now(), now()),
    ('AI-Generated One-Click Order', 'ai-generated-one-click-order', 'Demo video: AI-Generated One-Click Order', eb2b_id, 8, '5:00', false, now(), now()),
    ('Most Advanced Product Catalogue and Search', 'most-advanced-product-catalogue-and-search', 'Demo video: Most Advanced Product Catalogue and Search', eb2b_id, 9, '5:00', false, now(), now()),
    ('Hyper-Personalized Offers', 'hyper-personalized-offers', 'Demo video: Hyper-Personalized Offers', eb2b_id, 10, '5:00', false, now(), now()),
    ('Live Order Taking Module', 'live-order-taking-module', 'Demo video: Live Order Taking Module', eb2b_id, 11, '5:00', false, now(), now()),
    ('Retail Finance and Payment', 'retail-finance-and-payment', 'Demo video: Retail Finance and Payment', eb2b_id, 12, '5:00', false, now(), now()),
    ('IR Based Crowdsourced Execution', 'ir-based-crowdsourced-execution', 'Demo video: IR Based Crowdsourced Execution', eb2b_id, 13, '5:00', false, now(), now()),
    ('Consumer Promo Redemption', 'consumer-promo-redemption', 'Demo video: Consumer Promo Redemption', eb2b_id, 14, '5:00', false, now(), now()),
    ('Target vs Achievement Dashboard', 'target-vs-achievement-dashboard', 'Demo video: Target vs Achievement Dashboard', eb2b_id, 15, '5:00', false, now(), now()),
    ('Loyalty and Engagement Dashboard', 'loyalty-and-engagement-dashboard', 'Demo video: Loyalty and Engagement Dashboard', eb2b_id, 16, '5:00', false, now(), now()),
    ('Purchase Summary and Trends', 'purchase-summary-and-trends', 'Demo video: Purchase Summary and Trends', eb2b_id, 17, '5:00', false, now(), now()),
    ('Multi Lingual', 'multi-lingual', 'Demo video: Multi Lingual', eb2b_id, 18, '5:00', false, now(), now()),
    ('Smart Nudges', 'smart-nudges', 'Demo video: Smart Nudges', eb2b_id, 19, '5:00', false, now(), now());

END $$;