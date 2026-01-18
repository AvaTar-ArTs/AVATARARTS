import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import { createCorsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  const corsHeaders = createCorsHeaders(req.headers.get('origin'));
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { inviteCode, email, checkEmailMatch } = await req.json();

    console.log('Validating invite code:', inviteCode, 'Email:', email, 'Check match:', checkEmailMatch);

    // Validate input
    if (!inviteCode || typeof inviteCode !== 'string') {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Invite code is required' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Query the beta_applications table
    const { data: application, error } = await supabase
      .from('beta_applications')
      .select('*')
      .eq('invite_code', inviteCode.trim())
      .maybeSingle();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Error validating invite code' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    // Check if invite code exists
    if (!application) {
      console.log('Invite code not found');
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Invalid invite code' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Check if application is approved
    if (application.status !== 'approved') {
      console.log('Application not approved, status:', application.status);
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'This invite code has not been approved yet' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // If we need to check email match (during signup)
    if (checkEmailMatch && email) {
      if (application.email.toLowerCase() !== email.toLowerCase()) {
        console.log('Email mismatch:', application.email, 'vs', email);
        return new Response(
          JSON.stringify({ 
            valid: false, 
            error: 'Email address does not match the beta application. Please use the same email you applied with.' 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }

      // Check if the user already signed up
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('user_email')
        .eq('user_email', email.toLowerCase())
        .maybeSingle();

      if (profile) {
        console.log('User already signed up');
        return new Response(
          JSON.stringify({ 
            valid: false, 
            error: 'This email has already been used to create an account' 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }
    }

    console.log('Validation successful');
    return new Response(
      JSON.stringify({ 
        valid: true,
        applicationEmail: application.email,
        applicantName: `${application.first_name} ${application.last_name}`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        valid: false, 
        error: 'An unexpected error occurred' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
