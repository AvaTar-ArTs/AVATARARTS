import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ProcessApplicationRequest {
  applicationId: string;
  action: "approve" | "deny";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      throw new Error("Unauthorized");
    }

    const { applicationId, action }: ProcessApplicationRequest = await req.json();

    console.log(`Processing application ${applicationId} with action ${action}`);

    // Get the application
    const { data: application, error: appError } = await supabaseClient
      .from("beta_applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (appError || !application) {
      throw new Error("Application not found");
    }

    if (application.status !== "pending") {
      throw new Error("Application has already been processed");
    }

    // Get email template from settings
    const templateKey = action === "approve" 
      ? "beta_approved_email_template" 
      : "beta_denied_email_template";

    const { data: settingData, error: settingError } = await supabaseClient
      .from("admin_settings")
      .select("setting_value")
      .eq("setting_key", templateKey)
      .single();

    if (settingError || !settingData) {
      throw new Error(`Email template not found: ${templateKey}`);
    }

    const template = settingData.setting_value as { subject: string; html: string };

    let inviteCode = "";
    if (action === "approve") {
      // Generate unique invite code
      inviteCode = crypto.randomUUID().substring(0, 8).toUpperCase();
      
      // Store invite code in application
      const { error: updateError } = await supabaseClient
        .from("beta_applications")
        .update({ invite_code: inviteCode })
        .eq("id", applicationId);

      if (updateError) {
        console.error("Error updating invite code:", updateError);
      }
    }

    // Replace template variables
    const name = `${application.first_name} ${application.last_name}`;
    const signupUrl = `${Deno.env.get("SUPABASE_URL")}/auth/v1/signup?redirect_to=${encodeURIComponent(
      "https://sunova.app/dashboard"
    )}`;

    let emailHtml = template.html
      .replace(/\{\{name\}\}/g, name)
      .replace(/\{\{invite_code\}\}/g, inviteCode)
      .replace(/\{\{signup_url\}\}/g, signupUrl);

    // Send email
    console.log(`Sending ${action} email to ${application.email}`);
    
    const { error: emailError } = await resend.emails.send({
      from: "SuNovà <onboarding@resend.dev>",
      to: [application.email],
      subject: template.subject,
      html: emailHtml,
    });

    if (emailError) {
      console.error("Error sending email:", emailError);
      throw new Error(`Failed to send email: ${emailError.message}`);
    }

    // Update application status
    const { error: statusError } = await supabaseClient
      .from("beta_applications")
      .update({
        status: action === "approve" ? "approved" : "denied",
        processed_at: new Date().toISOString(),
        processed_by: user.id,
      })
      .eq("id", applicationId);

    if (statusError) {
      console.error("Error updating application status:", statusError);
      throw new Error("Failed to update application status");
    }

    console.log(`Successfully processed application ${applicationId}`);

    return new Response(
      JSON.stringify({
        success: true,
        inviteCode: action === "approve" ? inviteCode : null,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in process-beta-application:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
