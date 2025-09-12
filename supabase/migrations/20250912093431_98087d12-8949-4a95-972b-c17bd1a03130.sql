-- Recreate the trigger since it seems to be missing
CREATE TRIGGER prevent_blocked_invite_trigger
    BEFORE INSERT OR UPDATE ON public.invites
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_blocked_invite();