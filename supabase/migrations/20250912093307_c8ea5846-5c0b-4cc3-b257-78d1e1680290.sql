-- Fix security issues by setting search_path for functions
ALTER FUNCTION public.hook_restrict_signup_by_invite(jsonb) SET search_path = public;
ALTER FUNCTION public.prevent_blocked_invite() SET search_path = public;