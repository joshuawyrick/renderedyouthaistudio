
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendVerificationRequest {
  sessionToken: string;
  parentEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionToken, parentEmail }: SendVerificationRequest = await req.json();

    // Input validation
    if (!sessionToken || typeof sessionToken !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid session token' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!parentEmail || typeof parentEmail !== 'string' || !parentEmail.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Find the age verification record
    const { data: ageVerification, error: ageError } = await supabaseClient
      .from('age_verification')
      .select('*')
      .eq('session_token', sessionToken)
      .single();

    if (ageError || !ageVerification) {
      console.error('Age verification not found:', ageError);
      return new Response(
        JSON.stringify({ error: 'Invalid session token' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Rate limit: check if a token was already sent recently (within 2 minutes)
    const { data: recentTokens } = await supabaseClient
      .from('parent_verification_tokens')
      .select('created_at')
      .eq('age_verification_id', ageVerification.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (recentTokens && recentTokens.length > 0) {
      const lastSent = new Date(recentTokens[0].created_at);
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
      if (lastSent > twoMinutesAgo) {
        return new Response(
          JSON.stringify({ error: 'Please wait before requesting another verification email' }),
          { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // Generate a secure verification token
    const verificationToken = crypto.randomUUID();
    const tokenHash = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(verificationToken)
    );
    const tokenHashHex = Array.from(new Uint8Array(tokenHash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Set expiration to 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Store the verification token
    const { error: tokenError } = await supabaseClient
      .from('parent_verification_tokens')
      .insert({
        age_verification_id: ageVerification.id,
        parent_email: parentEmail,
        token_hash: tokenHashHex,
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error('Error creating verification token:', tokenError);
      return new Response(
        JSON.stringify({ error: 'Failed to create verification token' }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Update the age verification record with parent email
    await supabaseClient
      .from('age_verification')
      .update({ parent_email: parentEmail })
      .eq('session_token', sessionToken);

    // Send verification email
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    // Use SITE_URL if configured (set this in Supabase Edge Function secrets to your real site address,
    // e.g. https://renderedyouth.com); otherwise fall back to the auto-derived Lovable URL.
    const siteUrl = Deno.env.get("SITE_URL") || Deno.env.get("SUPABASE_URL")?.replace('supabase.co', 'lovable.app');
    const verificationUrl = `${siteUrl}/parent-verify?token=${verificationToken}`;
    
    const emailResponse = await resend.emails.send({
      from: "Rendered Youth <onboarding@resend.dev>",
      to: [parentEmail],
      subject: "Verify Your Child's Account - Rendered Youth",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Child's Account</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: #fbbf24; font-size: 2rem; margin-bottom: 10px;">👨‍👩‍👧‍👦</h1>
            <h2 style="color: #000; margin-bottom: 20px;">Parent Verification Required</h2>
            
            <p style="font-size: 16px; margin-bottom: 25px;">
              Your child has requested to create an account on Rendered Youth, our platform where children's artwork becomes real T-shirts.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #fbbf24;">
              <h3 style="margin-top: 0; color: #000;">What We Need From You</h3>
              <p>To comply with COPPA (Children's Online Privacy Protection Act), we need your consent before your child can:</p>
              <ul style="text-align: left; display: inline-block;">
                <li>Upload and share their artwork</li>
                <li>Create a profile on our platform</li>
                <li>Earn commissions from T-shirt sales</li>
              </ul>
            </div>
            
            <div style="margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: #fbbf24; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                Verify & Give Consent
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              This link will expire in 7 days. If you didn't request this verification, you can safely ignore this email.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #888;">
                Questions? Contact us at support@renderedyouth.com
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });


    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Verification email sent to parent",
        emailId: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-parent-verification:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
