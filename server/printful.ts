/** Server-only Printful adapter. Never import this module into the browser app. */
export class PrintfulError extends Error {
  constructor(public status: number, public retryAfter: string | null) {
    super(`Printful request failed (${status}).`);
  }
}

type Item = { variant_id: number; quantity: number; files?: { type: string; url: string }[] };
type Recipient = { name?: string; address1?: string; city?: string; state_code: string; country_code: string; zip?: string };
type OrderInput = { external_id: string; recipient: Recipient; items: Item[]; shipping: string };

export function createPrintfulClient(config: {
  token: string;
  storeId: string;
  fetch?: typeof fetch;
  fulfillmentEnabled?: boolean;
}) {
  if (!config.token || !/^\d+$/.test(config.storeId)) throw new Error('Printful server configuration is missing.');
  const transport = config.fetch ?? fetch;
  async function request<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
    const response = await transport(`https://api.printful.com${path}`, {
      method,
      headers: { Authorization: `Bearer ${config.token}`, 'X-PF-Store-Id': config.storeId, 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(30_000),
    });
    // No automatic POST retries: a timeout may occur after Printful accepted an order.
    if (!response.ok) throw new PrintfulError(response.status, response.headers.get('retry-after'));
    const payload = await response.json();
    if (!Object.hasOwn(payload, 'result')) throw new Error('Unexpected Printful response.');
    return payload.result as T;
  }
  const id = (value: number) => {
    if (!Number.isSafeInteger(value) || value < 1) throw new Error('Invalid Printful ID.');
    return value;
  };
  const orderRef = (value: string) => {
    if (!/^[A-Za-z0-9_-]{1,32}$/.test(value)) throw new Error('Order reference must be 1–32 letters, numbers, dashes, or underscores.');
    return encodeURIComponent(`@${value}`);
  };
  const validateItems = (items: Item[]) => {
    if (!items.length) throw new Error('An order needs items.');
    for (const item of items) {
      id(item.variant_id);
      if (!Number.isSafeInteger(item.quantity) || item.quantity < 1) throw new Error('Invalid quantity.');
    }
  };
  return {
    catalog: () => request<unknown[]>('/products'),
    product: (productId: number) => request<unknown>(`/products/${id(productId)}`),
    printFiles: (productId: number) => request<unknown>(`/mockup-generator/printfiles/${id(productId)}`),
    mockupTemplates: (productId: number) => request<unknown>(`/mockup-generator/templates/${id(productId)}`),
    createMockup: (productId: number, input: {
      variant_ids: number[];
      format: 'png' | 'jpg';
      files: { placement: string; image_url: string; position: { area_width: number; area_height: number; width: number; height: number; top: number; left: number } }[];
    }) => request<{ task_key: string; status: string }>(`/mockup-generator/create-task/${id(productId)}`, 'POST', input),
    mockupResult: (taskKey: string) => request<unknown>(`/mockup-generator/task?task_key=${encodeURIComponent(taskKey)}`),
    shipping: (recipient: Recipient, items: Item[], locale: 'en_US' | 'es_ES' = 'en_US') => {
      validateItems(items);
      return request<unknown[]>('/shipping/rates', 'POST', { recipient, items, currency: 'USD', locale });
    },
    estimate: (input: OrderInput) => {
      validateItems(input.items);
      return request<unknown>('/orders/estimate-costs', 'POST', input);
    },
    getOrder: (externalId: string) => request<{ id: number; status: string; [key: string]: unknown }>(`/orders/${orderRef(externalId)}`),
    createDraft: (input: OrderInput) => {
      orderRef(input.external_id);
      validateItems(input.items);
      return request<{ id: number; status: string }>('/orders?confirm=0', 'POST', input);
    },
    confirm: (externalId: string) => {
      if (!config.fulfillmentEnabled) throw new Error('Paid fulfillment is disabled.');
      return request<unknown>(`/orders/${orderRef(externalId)}/confirm`, 'POST');
    },
  };
}
