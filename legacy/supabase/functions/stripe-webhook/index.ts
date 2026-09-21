// Stripe webhook: the authoritative confirmation that an order was paid.
// Configure the endpoint in the Stripe dashboard for the
// `checkout.session.completed` event and store the signing secret as
// STRIPE_WEBHOOK_SECRET.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { finalizeOrder } from "../_shared/finalizeOrder.ts";

const encoder = new TextEncoder();

const timingSafeEqual = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
};

async function verifySignature(
  payload: string,
  header: string,
  secret: string,
): Promise<boolean> {
  const parts = Object.fromEntries(
    header.split(",").map((part) => part.trim().split("=") as [string, string]),
  );
  const timestamp = parts["t"];
  const signature = parts["v1"];
  if (!timestamp || !signature) return false;

  // Reject anything older than five minutes (replay protection).
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(`${timestamp}.${payload}`));
  const expected = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return timingSafeEqual(expected, signature);
}

serve(async (req: Request): Promise<Response> => {
  const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!secret) {
    return new Response("Webhook secret not configured.", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  const payload = await req.text();

  if (!signature || !(await verifySignature(payload, signature, secret))) {
    return new Response("Invalid signature.", { status: 400 });
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  try {
    const event = JSON.parse(payload);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session?.metadata?.order_id ?? session?.client_reference_id;
      if (orderId && session.payment_status === "paid") {
        await finalizeOrder(
          admin,
          orderId,
          typeof session.payment_intent === "string" ? session.payment_intent : null,
        );
      }
    }

    if (event.type === "checkout.session.expired") {
      const orderId = event.data.object?.metadata?.order_id;
      if (orderId) {
        await admin.from("orders").update({ status: "cancelled" }).eq("id", orderId);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("stripe-webhook failed:", error);
    return new Response("Webhook handling failed.", { status: 500 });
  }
});
