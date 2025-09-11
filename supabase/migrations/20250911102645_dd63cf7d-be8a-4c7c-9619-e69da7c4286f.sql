-- Fix base64url encoding to use standard base64
-- Update the token column default to use standard base64 instead of base64url
ALTER TABLE public.invites 
ALTER COLUMN token SET DEFAULT encode(gen_random_bytes(32), 'base64');