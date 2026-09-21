import { test } from 'node:test';
import assert from 'node:assert/strict';
import { transition, publicationReady, canGenerate, splitEarnings } from './workflow.ts';
test('a family cannot publish or bypass admin preparation', () => {
  assert.throws(() => transition('review', 'publish', 'parent'));
  assert.throws(() => transition('review', 'prepare', 'parent'));
  assert.equal(transition('review', 'prepare', 'admin'), 'mockup');
});
test('publication needs approvals, recipient setup, a share agreement and variants', () => {
  const ready = { stage: 'ready' as const, payoutReady: true, verifiedConsent: true, rateSet: true, variantsReady: true };
  assert.equal(publicationReady(ready), true);
  for (const key of ['payoutReady', 'verifiedConsent', 'rateSet', 'variantsReady']) assert.equal(publicationReady({ ...ready, [key]: false }), false);
});
test('first generation is allowed once; extra batches need admin credit', () => {
  assert.equal(canGenerate({ completedBatches: 0, adminCredits: 0, activeJob: false, verifiedConsent: true }), true);
  assert.equal(canGenerate({ completedBatches: 1, adminCredits: 0, activeJob: false, verifiedConsent: true }), false);
  assert.equal(canGenerate({ completedBatches: 1, adminCredits: 1, activeJob: true, verifiedConsent: true }), false);
  assert.equal(canGenerate({ completedBatches: 1, adminCredits: 1, activeJob: false, verifiedConsent: false }), false);
});
test('creator-funded discount leaves the platform share unchanged and cannot overspend', () => {
  const base = { revenue: 3000, costs: 2117, shareBps: 3000, creatorDiscount: 0 };
  const normal = splitEarnings(base);
  const discounted = splitEarnings({ ...base, creatorDiscount: 100 });
  assert.equal(discounted.platform, normal.platform);
  assert.equal(discounted.creator, normal.creator - 100);
  assert.equal(discounted.creator + discounted.platform, 783);
  assert.throws(() => splitEarnings({ ...base, creatorDiscount: 265 }));
  assert.throws(() => splitEarnings({ ...base, shareBps: 10001 }));
});
test('losses never produce negative creator earnings', () => {
  assert.deepEqual(splitEarnings({ revenue: 1000, costs: 1100, shareBps: 3000, creatorDiscount: 0 }), { creator: 0, platform: 0, maxDiscount: 0, loss: 100 });
});
