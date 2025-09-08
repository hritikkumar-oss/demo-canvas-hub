-- Create invites table for email-invite-only sharing
CREATE TABLE IF NOT EXISTS public.invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT,
  invite_type TEXT NOT NULL CHECK (invite_type IN ('admin', 'viewer')),
  resource_type TEXT CHECK (resource_type IN ('product', 'video', 'playlist')),
  resource_id UUID,
  invited_by UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'revoked')),
  token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'base64url'),
  created_at TIMESTAMPTZ DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '7 days'),
  
  CONSTRAINT unique_pending_invite UNIQUE (email, resource_type, resource_id, status)
);

-- Create OTP verification table
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '10 minutes'),
  verified BOOLEAN DEFAULT false
);

-- Enable RLS on invites table
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

-- Enable RLS on otp_verifications table  
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Invites policies - only authenticated users can view/manage invites
CREATE POLICY "Users can view invites they created" ON public.invites
FOR SELECT USING (auth.uid() = invited_by);

CREATE POLICY "Authenticated users can create invites" ON public.invites
FOR INSERT WITH CHECK (auth.uid() = invited_by);

CREATE POLICY "Users can update their own invites" ON public.invites
FOR UPDATE USING (auth.uid() = invited_by);

-- OTP policies - anyone can create OTP for registration, but only verify their own
CREATE POLICY "Anyone can create OTP" ON public.otp_verifications
FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read their own OTP" ON public.otp_verifications
FOR SELECT USING (true);

CREATE POLICY "Anyone can update their own OTP" ON public.otp_verifications
FOR UPDATE USING (true);

-- Grant admin role to business email if account exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'business@salescode.ai') THEN
    UPDATE auth.users
    SET raw_user_meta_data = jsonb_set(
      COALESCE(raw_user_meta_data, '{}'), 
      '{role}', 
      '"admin"', 
      true
    )
    WHERE email = 'business@salescode.ai';
  END IF;
END $$;