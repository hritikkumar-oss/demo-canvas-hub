-- Remove duplicate invites, keeping only the most recent one for each email
WITH ranked_invites AS (
  SELECT 
    id,
    email,
    ROW_NUMBER() OVER (PARTITION BY lower(email) ORDER BY created_at DESC) as rn
  FROM public.invites
)
DELETE FROM public.invites 
WHERE id IN (
  SELECT id FROM ranked_invites WHERE rn > 1
);

-- Now create the unique index
CREATE UNIQUE INDEX idx_invites_email_lower 
ON public.invites (lower(email));

-- Create trigger to prevent blocked invites
DROP TRIGGER IF EXISTS prevent_blocked_invite_trigger ON public.invites;
CREATE TRIGGER prevent_blocked_invite_trigger
    BEFORE INSERT OR UPDATE ON public.invites
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_blocked_invite();