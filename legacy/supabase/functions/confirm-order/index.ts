// Confirms payment for a Checkout session and returns the order for the
// thank-you page. Also acts as a backstop if the Stripe webhook is delayed.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { stripeRequest } from "../_shared/stripe.ts";
import { finalizeOrder } from "../_shared/finalizeOrder.ts";

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  try {
    const { sessionId } = await req.json();
    if (!sessionId || typeof sessionId !== "string") {
      return json({ error: "A sessionId is required." }, 400);
    }

    const session = await stripeRequest(`/checkout/sessions/${sessionId}`);
    const orderId = session?.metadata?.order_id ?? session?.client_reference_id;
    if (!orderId) return json({ error: "Order not found for this payment." }, 404);

    if (session.payment_status === "paid") {
      await finalizeOrder(
        admin,
        orderId,
        typeof session.payment_intent === "string" ? session.payment_intent : null,
      );
    }

    const { data: order } = await admin
      .from("orders")
      .select("id, customer_email, customer_name, total_amount, payment_status, status, created_at, order_items(id, product_title, size, color, quantity, unit_price, line_total)")
      .eq("id", orderId)
      .single();

    return json({ paid: session.payment_status === "paid", order });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not confirm the order.";
    console.error("confirm-order failed:", message);
    return json({ error: message }, 500);
  }
});
