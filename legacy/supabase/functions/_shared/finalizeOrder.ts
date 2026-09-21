// Marks an order paid and records the sale + creator royalties.
// Safe to call more than once - the paid check makes it idempotent, so the
// Stripe webhook and the confirmation page can both call it.

import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function finalizeOrder(
  admin: SupabaseClient,
  orderId: string,
  paymentIntentId: string | null,
): Promise<{ alreadyPaid: boolean }> {
  const { data: order, error } = await admin
    .from("orders")
    .select("id, payment_status, discount_code, subtotal, total_amount, customer_email, customer_name")
    .eq("id", orderId)
    .single();

  if (error || !order) throw new Error("Order not found.");
  if (order.payment_status === "paid") return { alreadyPaid: true };

  const { data: items } = await admin
    .from("order_items")
    .select("product_id, quantity, unit_price, line_total, creator_commission_amount, creator_commission_rate, creator_user_id")
    .eq("order_id", orderId);

  await admin
    .from("orders")
    .update({
      payment_status: "paid",
      status: "processing",
      stripe_payment_intent_id: paymentIntentId,
    })
    .eq("id", orderId);

  // Record each line as a sale, then the creator's royalty against it.
  for (const item of items ?? []) {
    if (!item.product_id) continue;

    const gross = Number(item.line_total ?? 0);
    const commission = Number(item.creator_commission_amount ?? 0);

    const { data: sale } = await admin
      .from("sales")
      .insert({
        product_id: item.product_id,
        customer_email: order.customer_email,
        customer_name: order.customer_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_amount: gross,
        creator_commission: commission,
        admin_revenue: gross - commission,
        order_status: "paid",
      })
      .select("id")
      .single();

    if (sale && item.creator_user_id) {
      await admin.from("creator_earnings").insert({
        creator_user_id: item.creator_user_id,
        product_id: item.product_id,
        sale_id: sale.id,
        gross_amount: gross,
        platform_fee: gross - commission,
        creator_share: commission,
        commission_rate: item.creator_commission_rate ?? 0,
        payout_status: "pending",
      });
    }
  }

  // Count the discount code usage only once payment actually succeeded.
  if (order.discount_code) {
    const { data: code } = await admin
      .from("discount_codes")
      .select("id, usage_count")
      .eq("code", order.discount_code)
      .maybeSingle();

    if (code) {
      await admin
        .from("discount_codes")
        .update({ usage_count: (code.usage_count ?? 0) + 1 })
        .eq("id", code.id);
    }
  }

  return { alreadyPaid: false };
}
