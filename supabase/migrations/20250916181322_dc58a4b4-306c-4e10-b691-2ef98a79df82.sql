-- Fix search path issues for all existing functions
CREATE OR REPLACE FUNCTION public.hook_restrict_signup_by_invite(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
declare
  incoming_email text;
begin
  incoming_email := lower(coalesce((event->'user'->>'email'), ''));

  -- Block generic Gmail addresses
  if incoming_email like '%@gmail.com' then
    return jsonb_build_object(
      'error',
      jsonb_build_object('http_code', 403, 'message', 'We do not allow sign-ups with Gmail accounts. Please use your company email.')
    );
  end if;

  -- Block emails containing restricted company domains
  if incoming_email like '%fieldassist%'
     or incoming_email like '%bizom%'
     or incoming_email like '%ivymobility%'
     or incoming_email like '%ebest%'
     or incoming_email like '%botree%'
     or incoming_email like '%accenture%' then
    return jsonb_build_object(
      'error',
      jsonb_build_object('http_code', 403, 'message', 'Sign-ups from this company domain are not allowed. Please contact our team if you need access.')
    );
  end if;

  -- Check if invited
  if not exists (
    select 1
    from public.invites i
    where lower(i.email) = incoming_email
      and (i.used = false or i.used is null)
      and (i.expires_at is null or i.expires_at > now())
  ) then
    return jsonb_build_object(
      'error',
      jsonb_build_object('http_code', 403, 'message', 'This email has not been invited yet. Please request access from an admin.')
    );
  end if;

  -- Allowed
  return '{}'::jsonb;
end;
$$;

CREATE OR REPLACE FUNCTION public.prevent_blocked_invite()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
declare
  new_email text := lower(coalesce(NEW.email, ''));
begin
  -- Block Gmail invites
  if new_email like '%@gmail.com' then
    raise exception 'Invites to Gmail accounts are not allowed. Please enter a valid corporate email address.';
  end if;

  -- Block restricted company invites
  if new_email like '%fieldassist%'
     or new_email like '%bizom%'
     or new_email like '%ivymobility%'
     or new_email like '%ebest%'
     or new_email like '%botree%'
     or new_email like '%accenture%' then
    raise exception 'Invites to restricted company domains are not allowed.';
  end if;

  return NEW;
end;
$$;