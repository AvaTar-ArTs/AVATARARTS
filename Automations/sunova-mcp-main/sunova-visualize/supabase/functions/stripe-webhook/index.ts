import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1?no-check";
import Stripe from "https://esm.sh/stripe@16.5.0?target=deno";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!stripeSecret || !webhookSecret || !supabaseUrl || !supabaseKey) {
    console.error("Webhook configuration missing");
    return new Response("Configuration error", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  const payload = await req.text();

  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  const stripe = new Stripe(stripeSecret, {
    apiVersion: "2024-11-20",
  });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("Invalid webhook signature", error);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;

      if (userId) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const metadataAmount = session.metadata?.amount ? Number(session.metadata.amount) : null;
        const amountTotal = session.amount_total ? session.amount_total / 100 : null;
        const amount = Number.isFinite(metadataAmount ?? NaN)
          ? (metadataAmount as number)
          : Number.isFinite(amountTotal ?? NaN)
            ? (amountTotal as number)
            : 0;

        if (amount > 0) {
          try {
            await supabase.rpc("add_credits", {
              p_user_id: userId,
              p_amount: amount,
              p_type: "purchase",
              p_reason: "stripe_checkout",
              p_metadata: {
                session_id: session.id,
                payment_intent: session.payment_intent ?? null,
              },
              p_stripe_payment_intent_id:
                typeof session.payment_intent === "string" ? session.payment_intent : null,
            });
          } catch (error) {
            console.error("Failed to record credit purchase", error);
            return new Response("Failed to record purchase", { status: 500 });
          }
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("stripe-webhook handler error", error);
    return new Response("Webhook processing error", { status: 500 });
  }
});
