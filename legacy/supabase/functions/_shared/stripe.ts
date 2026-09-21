// Minimal Stripe REST helpers - avoids pulling the whole SDK into the function.

const STRIPE_API = "https://api.stripe.com/v1";

export const getStripeKey = (): string | null =>
  Deno.env.get("STRIPE_SECRET_KEY") ?? null;

/** Flattens a nested object into Stripe's bracketed form-encoding. */
export const toForm = (
  obj: Record<string, unknown>,
  prefix = "",
  form = new URLSearchParams(),
): URLSearchParams => {
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;
    const name = prefix ? `${prefix}[${key}]` : key;
    if (Array.isArray(value)) {
      value.forEach((entry, index) => {
        if (entry !== null && typeof entry === "object") {
          toForm(entry as Record<string, unknown>, `${name}[${index}]`, form);
        } else {
          form.append(`${name}[${index}]`, String(entry));
        }
      });
    } else if (typeof value === "object") {
      toForm(value as Record<string, unknown>, name, form);
    } else {
      form.append(name, String(value));
    }
  }
  return form;
};

export async function stripeRequest(
  path: string,
  init: { method?: "GET" | "POST"; body?: Record<string, unknown> } = {},
): Promise<any> {
  const key = getStripeKey();
  if (!key) {
    throw new Error(
      "Card payments are not switched on yet. Add the Stripe secret key to enable checkout.",
    );
  }

  const method = init.method ?? "GET";
  const response = await fetch(`${STRIPE_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: init.body ? toForm(init.body).toString() : undefined,
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error?.message ?? `Stripe error ${response.status}`);
  }
  return payload;
}
