-- Ensure business@salescode.ai has admin role
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'), 
  '{role}', 
  '"admin"', 
  true
)
WHERE email = 'business@salescode.ai';

-- If the user doesn't exist, this won't create it, but will be ready when they do exist