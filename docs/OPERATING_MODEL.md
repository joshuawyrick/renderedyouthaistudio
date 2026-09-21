# Approved direction and implementation decisions

Preserve the live logo, black/yellow/white colors, central homepage composition, and genuine family story. Keep original wording unless it conflicts with the actual operating model or is an unverified placeholder. Stack: React + TypeScript + Vite + Tailwind; server integrations remain separate from browser code.

## Accounts and onboarding

Visitors choose shopping, parent/guardian creation, or school fundraising. Shopping supports guest checkout. Parents own accounts and manage multiple children. No separate child login initially. School organizers apply for authorization; selecting that route never grants organizer privileges. Admin privileges are provisioned privately and enforced server-side.

Parent path: adult registration and email confirmation → identity and verifiable parental consent → child profile → drawing and art selection → product preparation → payout setup and agreement before publication → final parent approval → admin publication. Separate the payout verification required by Stripe from the consent process for child data.

Use Stripe-hosted Connect onboarding for required account and bank details. Return URLs are navigation, not evidence of successful verification. Re-fetch requirements on the server and process account update notifications. Never store bank account numbers in family profiles or expose customer shipping details to creators.

## Profiles and photos

Display name and non-photo avatar are sufficient. Exact age and state are optional parent-approved fields, hidden by default. No birth date, city, street address, or school location is published. Public profile edits require approval and keep a separate published snapshot.

Parents may eventually choose an actual portrait or a caricature from a submitted photo. Before uploads, obtain the required verified consent and disclose the AI processing provider and uses. A caricature can remain identifiable. A private source photo must not become the public profile image accidentally. Delete source originals after the documented processing/review period unless a separately explained purpose requires retention. Provide withdrawal/deletion controls and remove embedded metadata. No automatic face uploads or biometrics are required from children.

## Generation costs

One initial set of four artwork options. No automatic complimentary regeneration batch. Parents request more with a reason; admin approves one batch at a time. Reserve credits atomically per durable job; retry transport failures without consuming another entitlement. Retry only missing/failed outputs rather than replacing successful results. No claim of four ready choices until all four succeeded.

Paid extra generations remain off initially. After measuring actual generation and processing costs, admin may offer a clearly priced one-time purchase to the parent. Do not choose $3 or $5 as a promise before those costs and failure/refund behavior are tested.

## Products, discounts, and earnings

Admin controls garments, sizes/colors offered, placement, retail pricing and margin floors. Creators propose codes for their own items. Admin controls the amount, expiry and usage limits. No cross-creator application or discount stacking initially.

Use integer cents. With list revenue R (excluding customer sales tax), defined actual costs C, creator fraction s and creator-funded discount D: base margin = max(0,R-C); creator share = floor(base margin*s)-D; platform share = base margin-floor(base margin*s). Reject D above the creator's allowed share and reserve headroom for cost uncertainty. Processor cost must reflect the actual payment; fulfillments can change, so reconcile actual costs and apply a documented adjustment policy. Do not silently debit parents for cost overruns.

Rate agreements have versions, effective dates and parent acknowledgment; completed orders retain their original agreement. School campaign sales have a single designated school recipient rule; do not also credit the family automatically.

## Admin workspaces

Today highlights only actionable work. Design queue combines original, chosen artwork, story, approvals and history. Product preparation contains file validation, Printful variants, mockup progress and retail margin. Orders highlight holds, failed fulfillment, unavailable variants, partial shipments and refunds. Earnings distinguish estimates, pending, available and paid. Settings shows connection readiness and configuration needs.

## Sources checked

- FTC COPPA FAQ: https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions
- Stripe hosted onboarding: https://docs.stripe.com/connect/hosted-onboarding
- Stripe separate charges/transfers, including refund reconciliation: https://docs.stripe.com/connect/separate-charges-and-transfers
- Printful API: https://developers.printful.com/docs/

This architecture does not establish legal compliance. Consent notices, data retention, provider terms, public disclosures and launch policies still need review for the implemented service.
