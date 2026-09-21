// Creates a Stripe Checkout session for a cart.
// All prices, discounts and royalty splits are calculated here from the
// database - never trusted from the browser.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { stripeRequest } from "../_shared/stripe.ts";

interface CartLine {
  productId: string;
  variantId?: string | null;
  quantity: number;
}

interface CheckoutBody {
  items: CartLine[];
  email: string;
  name?: string;
  discountCode?: string | null;
  shippingAddress?: Record<string, string>;
  successUrl: string;
  cancelUrl: string;
}

const round = (n: number) => Math.round(n * 100) / 100;

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

  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return json({ error: "Your cart is empty." }, 400);
  }
  if (!body.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) {
    return json({ error: "A valid email address is required." }, 400);
  }
  if (!body.successUrl || !body.cancelUrl) {
    return json({ error: "Missing redirect URLs." }, 400);
  }

  try {
    // Optional signed-in shopper, so the order shows in their history.
    let userId: string | null = null;
    const jwt = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    if (jwt) {
      const { data } = await admin.auth.getUser(jwt);
      userId = data?.user?.id ?? null;
    }

    // --- Price every line from the database --------------------------------
    const priced: {
      productId: string;
      variantId: string | null;
      title: string;
      size: string | null;
      color: string | null;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
      creatorUserId: string | null;
      commissionRate: number;
    }[] = [];

    for (const line of body.items) {
      const quantity = Math.max(1, Math.min(99, Math.floor(Number(line.quantity) || 1)));

      const { data: product } = await admin
        .from("products")
        .select("id, title, price, base_price, creator_commission_rate, status, designs(user_id)")
        .eq("id", line.productId)
        .eq("status", "active")
        .maybeSingle();

      if (!product) {
        return json({ error: "One of the items is no longer available." }, 400);
      }

      let adjustment = 0;
      let size: string | null = null;
      let color: string | null = null;

      if (line.variantId) {
        const { data: variant } = await admin
          .from("product_variants")
          .select("id, size, color, price_adjustment, is_available, product_id")
          .eq("id", line.variantId)
          .eq("product_id", product.id)
          .maybeSingle();

        if (!variant || !variant.is_available) {
          return json({ error: `${product.title} is sold out in that size or color.` }, 400);
        }
        adjustment = Number(variant.price_adjustment ?? 0);
        size = variant.size;
        color = variant.color;
      }

      const unitPrice = round(Number(product.base_price ?? product.price) + adjustment);
      const rate = Number(product.creator_commission_rate ?? 0);

      priced.push({
        productId: product.id,
        variantId: line.variantId ?? null,
        title: product.title,
        size,
        color,
        quantity,
        unitPrice,
        lineTotal: round(unitPrice * quantity),
        creatorUserId: (product as any).designs?.user_id ?? null,
        commissionRate: rate,
      });
    }

    const subtotal = round(priced.reduce((sum, p) => sum + p.lineTotal, 0));

    // --- Validate the discount code ---------------------------------------
    let discountAmount = 0;
    let discountCode: string | null = null;

    if (body.discountCode) {
      const { data: code } = await admin
        .from("discount_codes")
        .select("*")
        .eq("code", body.discountCode.toUpperCase())
        .eq("is_active", true)
        .maybeSingle();

      const now = new Date();
      const withinDates = code &&
        (!code.valid_from || new Date(code.valid_from) <= now) &&
        (!code.valid_until || new Date(code.valid_until) >= now);
      const withinLimit = code && (!code.usage_limit || code.usage_count < code.usage_limit);

      if (code && withinDates && withinLimit) {
        discountCode = code.code;
        discountAmount = code.discount_type === "percentage"
          ? round(subtotal * (Number(code.discount_amount) / 100))
          : round(Math.min(Number(code.discount_amount), subtotal));
      }
    }

    const shippingAmount = 0;
    const taxAmount = 0;
    const total = round(Math.max(0, subtotal - discountAmount) + shippingAmount + taxAmount);

    if (total <= 0) {
      return json({ error: "Order total must be greater than zero." }, 400);
    }

    // --- Persist a pending order ------------------------------------------
    const { data: order, error: orderError } = await admin
      .from("orders")
      .insert({
        user_id: userId,
        customer_email: body.email,
        customer_name: body.name ?? null,
        shipping_address: body.shippingAddress ?? {},
        subtotal,
        discount_code: discountCode,
        discount_amount: discountAmount,
        shipping_amount: shippingAmount,
        tax_amount: taxAmount,
        total_amount: total,
        status: "pending",
        payment_status: "unpaid",
      })
      .select("id")
      .single();

    if (orderError || !order) throw new Error("Could not start the order.");

    // Discount is spread across lines so each stored line total, and each
    // creator's royalty, matches what the customer actually paid.
    const ratio = subtotal > 0 ? (subtotal - discountAmount) / subtotal : 1;

    const itemRows = priced.map((p) => {
      const paidLineTotal = round(p.lineTotal * ratio);
      return {
        order_id: order.id,
        product_id: p.productId,
        variant_id: p.variantId,
        product_title: p.title,
        size: p.size,
        color: p.color,
        quantity: p.quantity,
        unit_price: round(paidLineTotal / p.quantity),
        line_total: paidLineTotal,
        creator_user_id: p.creatorUserId,
        creator_commission_rate: p.commissionRate,
        creator_commission_amount: round(paidLineTotal * p.commissionRate),
      };
    });

    const { error: itemsError } = await admin.from("order_items").insert(itemRows);
    if (itemsError) throw new Error("Could not save the order items.");

    // --- Stripe Checkout ---------------------------------------------------
    const session = await stripeRequest("/checkout/sessions", {
      method: "POST",
      body: {
        mode: "payment",
        customer_email: body.email,
        client_reference_id: order.id,
        success_url: `${body.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: body.cancelUrl,
        shipping_address_collection: { allowed_countries: ["US", "CA"] },
        metadata: { order_id: order.id },
        payment_intent_data: { metadata: { order_id: order.id } },
        line_items: itemRows.map((row) => ({
          quantity: row.quantity,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(Number(row.unit_price) * 100),
            product_data: {
              name: [row.product_title, row.size, row.color].filter(Boolean).join(" - "),
            },
          },
        })),
      },
    });

    await admin
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id);

    return json({ url: session.url, orderId: order.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed.";
    console.error("create-checkout-session failed:", message);
    return json({ error: message }, 500);
  }
});
