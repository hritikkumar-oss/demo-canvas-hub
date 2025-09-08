import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendOTPRequest {
  email: string;
  name?: string;
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

    const { email, name }: SendOTPRequest = await req.json();

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in database
    const { error: otpError } = await supabaseClient
      .from("otp_verifications")
      .insert({
        email,
        otp_code: otpCode,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
      });

    if (otpError) {
      throw new Error(`Failed to store OTP: ${otpError.message}`);
    }

    // Create HTML email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Your verification code</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">Verify your email</h1>
          
          ${name ? `<p>Hi ${name},</p>` : '<p>Hello,</p>'}
          
          <p>Use this verification code to complete your registration:</p>
          
          <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <h2 style="color: #333; font-size: 32px; margin: 0; letter-spacing: 8px;">${otpCode}</h2>
          </div>
          
          <p>This code will expire in 10 minutes.</p>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            If you didn't request this code, you can safely ignore this email.
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">Salescode Learning Platform</p>
        </body>
      </html>
    `;

    console.log(`OTP ${otpCode} generated for ${email}`);
    
    // For demo purposes, return the OTP in the response (remove this in production)
    return new Response(
      JSON.stringify({ 
        success: true,
        message: `OTP sent to ${email}`,
        // Remove this in production - only for demo
        otp: otpCode
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-otp function:", error);
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