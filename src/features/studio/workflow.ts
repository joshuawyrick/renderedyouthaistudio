export type Stage = 'draft' | 'generating' | 'choose' | 'review' | 'changes' | 'mockup' | 'parent_approval' | 'ready' | 'published';
export type Action = 'generate' | 'finish' | 'select' | 'request_changes' | 'resubmit' | 'prepare' | 'send_preview' | 'approve' | 'publish';
export type Actor = 'parent' | 'admin' | 'worker';
const transitions: Partial<Record<Stage, Partial<Record<Action, [Actor, Stage]>>>> = {
  draft: { generate: ['parent', 'generating'] },
  generating: { finish: ['worker', 'choose'] },
  choose: { select: ['parent', 'review'] },
  review: { request_changes: ['admin', 'changes'], prepare: ['admin', 'mockup'] },
  changes: { resubmit: ['parent', 'review'] },
  mockup: { send_preview: ['admin', 'parent_approval'] },
  parent_approval: { approve: ['parent', 'ready'] },
  ready: { publish: ['admin', 'published'] },
};
export function transition(stage: Stage, action: Action, actor: Actor): Stage {
  const rule = transitions[stage]?.[action];
  if (!rule || rule[0] !== actor) throw new Error('This action is not available at this step.');
  return rule[1];
}
export function publicationReady(input: { stage: Stage; payoutReady: boolean; verifiedConsent: boolean; rateSet: boolean; variantsReady: boolean }) {
  return input.stage === 'ready' && input.payoutReady && input.verifiedConsent && input.rateSet && input.variantsReady;
}
export function canGenerate(input: { completedBatches: number; adminCredits: number; activeJob: boolean; verifiedConsent: boolean }) {
  return input.verifiedConsent && !input.activeJob && (input.completedBatches === 0 || input.adminCredits > 0);
}
/** All money is integer USD cents. Cost includes fulfillment and actual processor fees; excludes pass-through customer sales tax. */
export function splitEarnings(input: { revenue: number; costs: number; shareBps: number; creatorDiscount: number }) {
  const { revenue, costs, shareBps, creatorDiscount } = input;
  for (const amount of [revenue, costs, shareBps, creatorDiscount]) {
    if (!Number.isSafeInteger(amount) || amount < 0) throw new Error('Amounts must be nonnegative integers.');
  }
  if (shareBps > 10000) throw new Error('Share must be between 0 and 100%.');
  const margin = Math.max(0, revenue - costs);
  const beforeDiscount = Math.floor(margin * shareBps / 10000);
  if (creatorDiscount > beforeDiscount) throw new Error('This discount exceeds the creator earnings available for this sale.');
  return { creator: beforeDiscount - creatorDiscount, platform: margin - beforeDiscount, maxDiscount: beforeDiscount, loss: Math.max(0, costs - revenue) };
}
export const stageLabels: Record<Stage, string> = {
  draft: 'Draft', generating: 'Creating four options', choose: 'Choose your artwork', review: 'Admin review', changes: 'Changes requested',
  mockup: 'Preparing your shirt', parent_approval: 'Approve your product', ready: 'Ready to publish', published: 'Live in your shop',
};
