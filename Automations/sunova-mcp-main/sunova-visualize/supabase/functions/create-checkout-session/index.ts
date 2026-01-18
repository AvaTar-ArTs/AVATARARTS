import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1?no-check";
import Stripe from "https://esm.sh/stripe@16.5.0?target=deno";
import { createCorsHeaders, handleOptions } from "../_shared/cors.ts";

interface CheckoutRequest {
  amount: number;
}

const MINIMUM_PURCHASE = 5;

serve(async (req) => {
  const corsHeaders = createCorsHeaders(req.headers.get("origin"));
  const optionsResponse = handleOptions(req, corsHeaders);
  if (optionsResponse) {
    return optionsResponse;
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeSecret || !supabaseUrl || !supabaseKey) {
      throw new Error("Payment configuration is incomplete");
    }

    const { amount }: CheckoutRequest = await req.json();

    if (!Number.isFinite(amount) || amount < MINIMUM_PURCHASE) {
      return new Response(JSON.stringify({
        error: `Minimum purchase is $${MINIMUM_PURCHASE}.`,
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authData?.user?.id) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const user = authData.user;

    const stripe = new Stripe(stripeSecret, {
      apiVersion: "2024-11-20",
    });

    const origin = req.headers.get("origin") ?? "https://sunova.ai";
    const normalizedOrigin = origin.endsWith("/") ? origin.slice(0, -1) : origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email ?? undefined,
      metadata: {
        user_id: user.id,
        amount: amount.toFixed(2),
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Sunova Credits",
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${normalizedOrigin}/dashboard?payment=success`,
      cancel_url: `${normalizedOrigin}/dashboard?payment=cancelled`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("create-checkout-session error", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unexpected error",
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
