-- First, delete all existing videos to start fresh
DELETE FROM videos;

-- Delete all existing products to start fresh  
DELETE FROM products;

-- Insert the 8 products with exact names
INSERT INTO products (id, title, slug, description, category, thumbnail, total_duration, lesson_count, is_featured, created_by) VALUES
-- NextGen SFA
(gen_random_uuid(), 'NextGen SFA', 'nextgen-sfa', 'Advanced Sales Force Automation platform', 'SFA', '/lovable-uploads/18aa9a10-08d6-4991-b18b-dc887d6b5c86.png', '18:00:00', 36, true, null),

-- AI powered eB2B
(gen_random_uuid(), 'AI powered eB2B', 'ai-powered-eb2b', 'AI-powered eCommerce B2B platform', 'eB2B', '/lovable-uploads/e034b324-e49a-4ea8-9cb1-9222a945fe38.png', '9:30:00', 19, true, null),

-- NextGen DMS
(gen_random_uuid(), 'NextGen DMS', 'nextgen-dms', 'Next generation Distribution Management System', 'DMS', '/lovable-uploads/18aa9a10-08d6-4991-b18b-dc887d6b5c86.png', '8:00:00', 16, false, null),

-- SCAI – AI Agent
(gen_random_uuid(), 'SCAI – AI Agent', 'scai-ai-agent', 'Smart Customer AI Agent for automation', 'AI', '/lovable-uploads/e034b324-e49a-4ea8-9cb1-9222a945fe38.png', '6:00:00', 12, false, null),

-- AI promo co-pilot
(gen_random_uuid(), 'AI promo co-pilot', 'ai-promo-co-pilot', 'AI-powered promotion management co-pilot', 'AI', '/lovable-uploads/18aa9a10-08d6-4991-b18b-dc887d6b5c86.png', '5:00:00', 10, false, null),

-- Supervisor
(gen_random_uuid(), 'Supervisor', 'supervisor', 'Comprehensive supervisor management platform', 'Management', '/lovable-uploads/e034b324-e49a-4ea8-9cb1-9222a945fe38.png', '5:00:00', 10, false, null),

-- Sales Lens
(gen_random_uuid(), 'Sales Lens', 'sales-lens', 'Advanced sales analytics and insights platform', 'Analytics', '/lovable-uploads/18aa9a10-08d6-4991-b18b-dc887d6b5c86.png', '9:00:00', 18, false, null),

-- Salescode Studio
(gen_random_uuid(), 'Salescode Studio', 'salescode-studio', 'Complete development and configuration studio', 'Development', '/lovable-uploads/e034b324-e49a-4ea8-9cb1-9222a945fe38.png', '7:00:00', 14, false, null);

-- Now insert videos for each product
-- First, get the product IDs we just created
DO $$
DECLARE
    nextgen_sfa_id uuid;
    ai_eb2b_id uuid;
    nextgen_dms_id uuid;
    scai_id uuid;
    ai_promo_id uuid;
    supervisor_id uuid;
    sales_lens_id uuid;
    salescode_studio_id uuid;
BEGIN
    -- Get product IDs
    SELECT id INTO nextgen_sfa_id FROM products WHERE slug = 'nextgen-sfa';
    SELECT id INTO ai_eb2b_id FROM products WHERE slug = 'ai-powered-eb2b';
    SELECT id INTO nextgen_dms_id FROM products WHERE slug = 'nextgen-dms';
    SELECT id INTO scai_id FROM products WHERE slug = 'scai-ai-agent';
    SELECT id INTO ai_promo_id FROM products WHERE slug = 'ai-promo-co-pilot';
    SELECT id INTO supervisor_id FROM products WHERE slug = 'supervisor';
    SELECT id INTO sales_lens_id FROM products WHERE slug = 'sales-lens';
    SELECT id INTO salescode_studio_id FROM products WHERE slug = 'salescode-studio';

    -- NextGen SFA videos (36 lessons)
    INSERT INTO videos (product_id, title, slug, description, duration, order_index, is_new) VALUES
    (nextgen_sfa_id, 'Why Traditional SFA is Broken', 'why-traditional-sfa-is-broken', 'Understanding the limitations of traditional SFA systems', '15:30', 1, true),
    (nextgen_sfa_id, 'Salescode SKILL & WILL Model', 'salescode-skill-will-model', 'Revolutionary approach to sales team assessment', '18:45', 2, true),
    (nextgen_sfa_id, 'Salescode Perfect Basket Model', 'salescode-perfect-basket-model', 'Optimizing order composition with AI', '22:15', 3, false),
    (nextgen_sfa_id, 'Hyper-personalised Landing Page (Home Screen)', 'hyper-personalised-landing-page', 'Creating personalized user experiences', '16:20', 4, false),
    (nextgen_sfa_id, 'Intelligent PJP', 'intelligent-pjp', 'AI-powered Permanent Journey Planning', '19:30', 5, false),
    (nextgen_sfa_id, 'AI generated Target', 'ai-generated-target', 'Automated target setting using machine learning', '21:10', 6, false),
    (nextgen_sfa_id, 'AI generated Order Tasks', 'ai-generated-order-tasks', 'Smart task automation for order management', '17:45', 7, false),
    (nextgen_sfa_id, 'AI generated Execution Tasks', 'ai-generated-execution-tasks', 'Automated execution planning and tracking', '20:30', 8, false),
    (nextgen_sfa_id, 'Task based Incentive', 'task-based-incentive', 'Performance-driven incentive systems', '14:15', 9, false),
    (nextgen_sfa_id, 'Hyper-personalized One-Click Order Basket', 'hyper-personalized-one-click-order-basket', 'Simplified ordering with AI recommendations', '18:00', 10, false),
    (nextgen_sfa_id, 'Most Advanced Product Catalogue and Search', 'most-advanced-product-catalogue-and-search', 'Next-gen product discovery and search', '23:45', 11, false),
    (nextgen_sfa_id, 'Intelligent Nudges (incl backend nudge creation)', 'intelligent-nudges', 'Smart notification and nudge systems', '16:30', 12, false),
    (nextgen_sfa_id, 'Order Summary and Task Gamification', 'order-summary-and-task-gamification', 'Engaging task completion through gamification', '19:15', 13, false),
    (nextgen_sfa_id, 'AI generated Van Loadout', 'ai-generated-van-loadout', 'Optimized vehicle loading with AI', '17:20', 14, false),
    (nextgen_sfa_id, 'KPI tracking dashboards', 'kpi-tracking-dashboards', 'Comprehensive KPI monitoring and analytics', '25:10', 15, false),
    (nextgen_sfa_id, 'Incentive Dashboard', 'incentive-dashboard', 'Real-time incentive tracking and management', '15:45', 16, false),
    (nextgen_sfa_id, 'Day End Summary Report', 'day-end-summary-report', 'Automated daily performance summaries', '12:30', 17, false),
    (nextgen_sfa_id, 'Multi Media Communication Banners', 'multi-media-communication-banners', 'Rich media communication tools', '14:20', 18, false),
    (nextgen_sfa_id, 'Personalized PICOS', 'personalized-picos', 'Customized point-of-sale displays', '16:45', 19, false),
    (nextgen_sfa_id, 'New Store Opportunities', 'new-store-opportunities', 'Identifying and capturing new business', '18:15', 20, false),
    (nextgen_sfa_id, 'Store Profile', 'store-profile', 'Comprehensive store information management', '13:30', 21, false),
    (nextgen_sfa_id, 'IR based Merchandizing', 'ir-based-merchandizing', 'Image recognition for merchandising', '21:45', 22, false),
    (nextgen_sfa_id, 'Product Returns', 'product-returns', 'Efficient return processing and management', '15:10', 23, false),
    (nextgen_sfa_id, 'Store Inventory Capture', 'store-inventory-capture', 'Real-time inventory tracking and capture', '17:30', 24, false),
    (nextgen_sfa_id, 'Asset Tracking', 'asset-tracking', 'Comprehensive asset management system', '19:20', 25, false),
    (nextgen_sfa_id, 'Collections', 'collections', 'Automated collection management', '14:45', 26, false),
    (nextgen_sfa_id, 'Competition Tracking', 'competition-tracking', 'Market intelligence and competitor analysis', '20:15', 27, false),
    (nextgen_sfa_id, 'Order Tracking', 'order-tracking', 'Real-time order status and tracking', '16:10', 28, false),
    (nextgen_sfa_id, 'Feedback & Support', 'feedback-support', 'Integrated feedback and support systems', '13:45', 29, false),
    (nextgen_sfa_id, 'Attendance', 'attendance', 'Smart attendance tracking and management', '11:30', 30, false),
    (nextgen_sfa_id, 'Outlet Mapping', 'outlet-mapping', 'Geographic outlet mapping and navigation', '18:30', 31, false),
    (nextgen_sfa_id, 'Remote Order', 'remote-order', 'Remote ordering capabilities', '15:20', 32, false),
    (nextgen_sfa_id, 'Salescode SOCIAL for Sales Teams', 'salescode-social-for-sales-teams', 'Social collaboration for sales teams', '17:15', 33, false),
    (nextgen_sfa_id, 'Multi Lingual', 'multi-lingual', 'Multi-language support and localization', '12:45', 34, false),
    (nextgen_sfa_id, 'ML Model Performance Insights', 'ml-model-performance-insights', 'Machine learning model analytics', '24:30', 35, false),
    (nextgen_sfa_id, '3 Critical Capabilities - for creating Next Gen Systems', '3-critical-capabilities', 'Essential capabilities for next-gen systems', '26:15', 36, false);

    -- AI powered eB2B videos (19 lessons)
    INSERT INTO videos (product_id, title, slug, description, duration, order_index, is_new) VALUES
    (ai_eb2b_id, 'How eB2B is disrupting traditional RTM', 'how-eb2b-is-disrupting-traditional-rtm', 'Understanding the eB2B disruption in RTM', '18:30', 1, true),
    (ai_eb2b_id, 'Winning model for eB2B adoption', 'winning-model-for-eb2b-adoption', 'Successful strategies for eB2B implementation', '20:15', 2, true),
    (ai_eb2b_id, 'Hyper personalized Landing Page (Home Screen)', 'hyper-personalized-landing-page-home-screen', 'Creating personalized user experiences', '16:45', 3, false),
    (ai_eb2b_id, 'Sales Rep Absenteeism', 'sales-rep-absenteeism', 'Addressing sales rep availability challenges', '14:20', 4, false),
    (ai_eb2b_id, 'Hyper-Personalized Banners and Promotions', 'hyper-personalized-banners-and-promotions', 'AI-driven promotional content', '17:30', 5, false),
    (ai_eb2b_id, 'Hyper-Personalized Basket Recommendations', 'hyper-personalized-basket-recommendations', 'Smart product recommendations', '19:10', 6, false),
    (ai_eb2b_id, 'Streamlined Product Browsing', 'streamlined-product-browsing', 'Enhanced product discovery experience', '15:45', 7, false),
    (ai_eb2b_id, 'AI-Generated One-Click Order', 'ai-generated-one-click-order', 'Simplified ordering with AI', '18:20', 8, false),
    (ai_eb2b_id, 'Most Advanced Product Catalogue and Search', 'most-advanced-product-catalogue-and-search', 'Next-gen product search capabilities', '21:15', 9, false),
    (ai_eb2b_id, 'Hyper-Personalized Offers', 'hyper-personalized-offers', 'AI-powered offer personalization', '16:30', 10, false),
    (ai_eb2b_id, 'Live Order Taking Module', 'live-order-taking-module', 'Real-time order processing', '17:45', 11, false),
    (ai_eb2b_id, 'Retail Finance and Payment', 'retail-finance-and-payment', 'Integrated payment and financing solutions', '19:30', 12, false),
    (ai_eb2b_id, 'IR Based Crowdsourced Execution', 'ir-based-crowdsourced-execution', 'Image recognition for execution tracking', '20:45', 13, false),
    (ai_eb2b_id, 'Consumer Promo Redemption', 'consumer-promo-redemption', 'Consumer promotion management', '15:15', 14, false),
    (ai_eb2b_id, 'Target vs Achievement Dashboard', 'target-vs-achievement-dashboard', 'Performance tracking and analytics', '18:10', 15, false),
    (ai_eb2b_id, 'Loyalty and Engagement Dashboard', 'loyalty-and-engagement-dashboard', 'Customer loyalty and engagement tracking', '16:45', 16, false),
    (ai_eb2b_id, 'Purchase Summary and Trends', 'purchase-summary-and-trends', 'Purchase analytics and trend analysis', '17:20', 17, false),
    (ai_eb2b_id, 'Multi Lingual', 'multi-lingual', 'Multi-language support', '12:30', 18, false),
    (ai_eb2b_id, 'Smart Nudges', 'smart-nudges', 'Intelligent notification system', '14:45', 19, false);

    -- Supervisor videos (10 lessons)
    INSERT INTO videos (product_id, title, slug, description, duration, order_index, is_new) VALUES
    (supervisor_id, 'Connected to Sales Reps', 'connected-to-sales-reps', 'Real-time connection with sales teams', '18:30', 1, true),
    (supervisor_id, 'Hyper-Personalized Daily KPI Targets for Supervisors', 'hyper-personalized-daily-kpi-targets', 'AI-driven KPI target setting', '20:15', 2, true),
    (supervisor_id, 'Skill-Will Dashboard (His + Team)', 'skill-will-dashboard', 'Team skill and will assessment dashboard', '22:45', 3, false),
    (supervisor_id, 'Team Leaderboard', 'team-leaderboard', 'Interactive team performance leaderboard', '16:20', 4, false),
    (supervisor_id, 'Work-With Module', 'work-with-module', 'Collaborative work-with functionality', '19:10', 5, false),
    (supervisor_id, 'Sales Rep LIVE Task Sharing & Tracking', 'sales-rep-live-task-sharing-tracking', 'Real-time task collaboration', '21:30', 6, false),
    (supervisor_id, 'Route Assignment', 'route-assignment', 'Intelligent route planning and assignment', '17:45', 7, false),
    (supervisor_id, 'Remote Order Feature', 'remote-order-feature', 'Remote ordering capabilities', '15:30', 8, false),
    (supervisor_id, 'Supervisor + Sales Team KPI Review', 'supervisor-sales-team-kpi-review', 'Comprehensive KPI review process', '24:15', 9, false),
    (supervisor_id, 'Sales Reps Outlet Level Tracking', 'sales-reps-outlet-level-tracking', 'Detailed outlet-level performance tracking', '18:45', 10, false);

    -- Sales Lens videos (18 lessons)
    INSERT INTO videos (product_id, title, slug, description, duration, order_index, is_new) VALUES
    (sales_lens_id, 'Order Summary', 'order-summary', 'Comprehensive order analytics and summaries', '16:30', 1, true),
    (sales_lens_id, 'Active User Summary', 'active-user-summary', 'User activity and engagement metrics', '14:45', 2, true),
    (sales_lens_id, 'Unique Sales Reps & Outlets Ordered', 'unique-sales-reps-outlets-ordered', 'Sales rep and outlet performance metrics', '18:20', 3, false),
    (sales_lens_id, 'Target vs Achievement', 'target-vs-achievement', 'Performance vs target analysis', '19:15', 4, false),
    (sales_lens_id, 'Sales Growth', 'sales-growth', 'Sales growth tracking and analysis', '17:30', 5, false),
    (sales_lens_id, 'Effectively Covered Outlets', 'effectively-covered-outlets', 'Outlet coverage effectiveness metrics', '20:10', 6, false),
    (sales_lens_id, 'PJP Productivity', 'pjp-productivity', 'Permanent Journey Plan productivity analysis', '21:45', 7, false),
    (sales_lens_id, 'Visit Compliance', 'visit-compliance', 'Visit compliance tracking and reporting', '15:20', 8, false),
    (sales_lens_id, 'Order Fill Rate', 'order-fill-rate', 'Order fulfillment rate analysis', '16:45', 9, false),
    (sales_lens_id, 'Delivery & Returns', 'delivery-returns', 'Delivery and return analytics', '18:30', 10, false),
    (sales_lens_id, 'Average Order Value', 'average-order-value', 'AOV tracking and optimization', '17:15', 11, false),
    (sales_lens_id, 'Lines Per Call', 'lines-per-call', 'Lines per call efficiency metrics', '14:30', 12, false),
    (sales_lens_id, 'Unique SKU per outlet', 'unique-sku-per-outlet', 'SKU diversity analysis by outlet', '19:45', 13, false),
    (sales_lens_id, 'Business Loss', 'business-loss', 'Business loss identification and analysis', '22:15', 14, false),
    (sales_lens_id, 'AI Recommendations Impact', 'ai-recommendations-impact', 'AI recommendation effectiveness tracking', '20:30', 15, false),
    (sales_lens_id, 'Trend Charts', 'trend-charts', 'Advanced trend analysis and visualization', '16:10', 16, false),
    (sales_lens_id, 'Trending Products', 'trending-products', 'Product trend analysis and insights', '18:45', 17, false),
    (sales_lens_id, 'User View', 'user-view', 'User-specific analytics and insights', '15:45', 18, false);

    -- Add basic videos for remaining products (NextGen DMS, SCAI, AI promo co-pilot, Salescode Studio)
    -- NextGen DMS (16 basic videos)
    INSERT INTO videos (product_id, title, slug, description, duration, order_index, is_new) 
    SELECT nextgen_dms_id, 'DMS Module ' || generate_series, 'dms-module-' || generate_series, 'Distribution management module', '15:00', generate_series, false
    FROM generate_series(1, 16);

    -- SCAI – AI Agent (12 basic videos)
    INSERT INTO videos (product_id, title, slug, description, duration, order_index, is_new) 
    SELECT scai_id, 'AI Agent Feature ' || generate_series, 'ai-agent-feature-' || generate_series, 'AI agent functionality', '12:00', generate_series, false
    FROM generate_series(1, 12);

    -- AI promo co-pilot (10 basic videos)
    INSERT INTO videos (product_id, title, slug, description, duration, order_index, is_new) 
    SELECT ai_promo_id, 'Promo Co-pilot Module ' || generate_series, 'promo-co-pilot-module-' || generate_series, 'Promotion co-pilot feature', '18:00', generate_series, false
    FROM generate_series(1, 10);

    -- Salescode Studio (14 basic videos)
    INSERT INTO videos (product_id, title, slug, description, duration, order_index, is_new) 
    SELECT salescode_studio_id, 'Studio Feature ' || generate_series, 'studio-feature-' || generate_series, 'Development studio feature', '20:00', generate_series, false
    FROM generate_series(1, 14);

END $$;