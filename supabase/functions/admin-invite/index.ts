import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-key",
};

interface AdminInviteRequest {
  email: string;
  data?: Record<string, any>;
}

// Admin authentication middleware
async function requireAdmin(req: Request, supabase: any): Promise<{ isAdmin: boolean; error?: string }> {
  // Check for admin API key first
  const adminKey = Deno.env.get("ADMIN_API_KEY");
  const requestAdminKey = req.headers.get("x-admin-key");
  
  if (adminKey && requestAdminKey === adminKey) {
    return { isAdmin: true };
  }

  // Fallback to Supabase auth check
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return { isAdmin: false, error: "Missing authorization" };
  }

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      return { isAdmin: false, error: "Invalid token" };
    }

    // Check if user has admin role in user_metadata or app_metadata
    const isAdmin = user.user_metadata?.role === 'admin' || 
                   user.app_metadata?.role === 'admin' ||
                   user.email?.endsWith('@salescode.ai'); // Domain-based admin check

    return { isAdmin };
  } catch (error) {
    return { isAdmin: false, error: "Auth check failed" };
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "method_not_allowed" }),
      { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    // Create admin Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Create regular client for auth checks
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Check admin authorization
    const { isAdmin, error: authError } = await requireAdmin(req, supabaseAuth);
    
    if (!isAdmin) {
      console.error("Admin auth failed:", authError);
      return new Response(
        JSON.stringify({ error: "forbidden", details: authError || "Admin access required" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Parse request body
    const { email, data }: AdminInviteRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "email_required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Normalize email to lowercase
    const normalizedEmail = String(email).toLowerCase().trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return new Response(
        JSON.stringify({ error: "invalid_email" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending admin invite to: ${normalizedEmail}`);

    // Send invite using Supabase Admin API
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      normalizedEmail,
      {
        data: data || {},
        redirectTo: `${Deno.env.get("SITE_URL") || "http://localhost:5173"}/auth`
      }
    );

    if (inviteError) {
      console.error("Supabase invite error:", inviteError);
      return new Response(
        JSON.stringify({ 
          error: "invite_failed", 
          details: inviteError.message || String(inviteError) 
        }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Admin invite sent successfully:", { email: normalizedEmail, userId: inviteData?.user?.id });

    return new Response(
      JSON.stringify({ 
        ok: true, 
        invite: inviteData,
        message: `Invite sent to ${normalizedEmail}` 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Server error in admin-invite:", error);
    return new Response(
      JSON.stringify({ 
        error: "server_error", 
        details: error.message || String(error) 
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);