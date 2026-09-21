import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPrintfulClient, PrintfulError } from './printful.ts';

function fixture(status = 200) {
  const calls: { url: string; init: RequestInit }[] = [];
  const client = createPrintfulClient({ token: 'test-token', storeId: '123', fetch: (async (url, init) => {
    calls.push({ url: String(url), init: init! });
    return new Response(JSON.stringify({ result: { id: 1, status: 'draft' } }), { status, headers: { 'retry-after': '60' } });
  }) as typeof fetch });
  return { client, calls };
}
const order = { external_id: 'ry-order-1', recipient: { country_code: 'US', state_code: 'CA' }, items: [{ variant_id: 1, quantity: 1 }], shipping: 'STANDARD' };
test('orders are drafts and store-scoped', async () => {
  const { client, calls } = fixture();
  await client.createDraft(order);
  assert.equal(calls[0].url, 'https://api.printful.com/orders?confirm=0');
  assert.equal((calls[0].init.headers as Record<string, string>)['X-PF-Store-Id'], '123');
});
test('fulfillment is blocked by default without any network call', () => {
  const { client, calls } = fixture();
  assert.throws(() => client.confirm('ry-order-1'), /disabled/);
  assert.equal(calls.length, 0);
});
test('invalid quantities and overlong references never reach Printful', () => {
  const { client, calls } = fixture();
  assert.throws(() => client.createDraft({ ...order, items: [{ variant_id: 1, quantity: -1 }] }));
  assert.throws(() => client.getOrder('a'.repeat(33)));
  assert.equal(calls.length, 0);
});
test('a failed order write is not automatically repeated', async () => {
  const { client, calls } = fixture(429);
  await assert.rejects(client.createDraft(order), (error: PrintfulError) => error.status === 429 && error.retryAfter === '60');
  assert.equal(calls.length, 1);
});
test('shipping carries the requested language and currency', async () => {
  const { client, calls } = fixture();
  await client.shipping(order.recipient, order.items, 'es_ES');
  const body = JSON.parse(calls[0].init.body as string);
  assert.equal(body.locale, 'es_ES');
  assert.equal(body.currency, 'USD');
});
