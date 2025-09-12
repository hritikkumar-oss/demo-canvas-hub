-- Create unique index on lower(email) for invites table
CREATE UNIQUE INDEX IF NOT EXISTS idx_invites_email_lower 
ON public.invites (lower(email));

-- Create trigger to prevent blocked invites (function already exists)
DROP TRIGGER IF EXISTS prevent_blocked_invite_trigger ON public.invites;
CREATE TRIGGER prevent_blocked_invite_trigger
    BEFORE INSERT OR UPDATE ON public.invites
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_blocked_invite();