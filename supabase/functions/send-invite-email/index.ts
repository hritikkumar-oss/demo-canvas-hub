import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.1";

// Helper function to convert base64url to standard base64
function base64UrlToBase64(b64url: string | null | undefined): string | null | undefined {
  if (!b64url) return b64url;
  let s = b64url.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return s;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InviteEmailRequest {
  email: string;
  name?: string;
  inviteType: 'admin' | 'viewer';
  resourceType?: 'product' | 'video' | 'playlist';
  resourceId?: string;
  resourceTitle?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { email, name, inviteType, resourceType, resourceId, resourceTitle, message }: InviteEmailRequest = await req.json();

    // Create invite record
    const { data: invite, error: inviteError } = await supabaseClient
      .from("invites")
      .insert({
        email,
        name,
        invite_type: inviteType,
        resource_type: resourceType,
        resource_id: resourceId,
        invited_by: user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      })
      .select()
      .single();

    if (inviteError) {
      throw new Error(`Failed to create invite: ${inviteError.message}`);
    }

    // Convert token to standard base64 if it's base64url format
    const standardToken = base64UrlToBase64(invite.token) || invite.token;
    
    // Generate invite URL
    const inviteUrl = `${Deno.env.get("SITE_URL") || "http://localhost:5173"}/invite/${standardToken}`;

    // Create HTML email content
    const subject = resourceTitle 
      ? `Invitation to access "${resourceTitle}"` 
      : `Invitation to Salescode Learning`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${subject}</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">You've been invited!</h1>
          
          ${name ? `<p>Hi ${name},</p>` : '<p>Hello,</p>'}
          
          <p>You've been invited to access ${resourceTitle ? `"${resourceTitle}"` : 'Salescode Learning'} with ${inviteType} permissions.</p>
          
          ${message ? `<p><strong>Message from inviter:</strong><br>${message}</p>` : ''}
          
          <p>To accept this invitation and create your account, click the link below:</p>
          
          <a href="${inviteUrl}" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Accept Invitation</a>
          
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666;">${inviteUrl}</p>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">Salescode Learning Platform</p>
        </body>
      </html>
    `;

    console.log(`Invite created for ${email} with token ${invite.token}`);
    
    // For now, just return success - in production you'd integrate with an email service
    return new Response(
      JSON.stringify({ 
        success: true, 
        inviteId: invite.id,
        message: `Invite created for ${email}. In a real environment, an email would be sent.`
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-invite-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);