# Rendered Youth — Bolt Implementation Brief

This document is the full implementation brief for completing the Rendered Youth application. It is saved here so later work can refer to it.

## Repository and starting point

- **Primary repository:** https://github.com/joshuawyrick/renderedyouthaistudio
- **Starting branch:** `codex/printful-foundation`
- **Existing draft PR:** https://github.com/joshuawyrick/renderedyouthaistudio/pull/1
- **Reference checkpoint:** `4c72b2a0f7f4925fd13e74e4e8423291f0f03e07`

The complete source is on the starting branch; `main` only has an initial README. The repository contains the full original React frontend, optimized brand assets, the actual supplied Rendered Youth logo, a family/admin workflow preview, and a server-side Printful adapter. The original backend is in `legacy/supabase/` for migration reference.

## Brand and content preservation

Use the real logo in `public/brand/`. Preserve its artwork and aspect ratio. Keep the black header, yellow accents/navigation/buttons, white backgrounds, restrained gray sections, existing typography, and overall spacing/style. The homepage retains the large centered three-line headline:

> Kids Draw It
> We Render It
> You Wear It.

Keep the existing introduction: "A magical marketplace where children's black marker masterpieces become real T-shirts. Upload, create, and wear imagination." Preserve the actual four process illustrations and genuine Tucker, Joshua, and Vanessa family story.

Do not invent a new logo, palette, brand voice, unrelated stock imagery, generic SaaS layout, fictional testimonials, sales statistics, press coverage, founder history, or school partnerships.

## Product and business model

Children draw original doodles, typically black marker on white paper. A parent helps submit a clear image and the story behind it. AI makes exactly four interpretations. The family selects one. Rendered Youth reviews the art and public story, prepares products and Printful mockups, gets final parent approval, then publishes to the child's storefront and the main marketplace.

Rendered Youth controls retail prices, available garments, colors/sizes offered, print placement, and publishing. Parents and children do not need Printful accounts. Customers buy through Rendered Youth. Printful produces and ships after a verified paid order is released. The parent or designated school receives the agreed share of eligible margin.

Initial market: United States, USD. Build English and Spanish interfaces. Language choice must not enable international shipping. Prepare country configuration for future Canada/Mexico expansion without enabling those destinations now.

No final share rate, paid-regeneration price, or payout schedule has been approved. Build configurable settings and agreement handling; leave consequential unapproved values unset in production.

## User types and onboarding

- **Shopper:** browse without registration, select a valid size/color, use guest checkout, receive order confirmation and tracking. Optional customer account. Secure order lookup with a signed link or authenticated ownership check.
- **Parent/guardian:** adult account registration, email verification, identity and required parental-consent steps, then child profiles. One parent manages multiple children.
- **School organizer:** application/inquiry and authorization before campaign administration. A public role selector must never grant organizer privileges.
- **Admin:** privately provisioned role, protected server-side permissions, and appropriately stronger account security. Never expose a public admin signup or production role-switching button.

Parent flow: account → verification and permission → first child → first drawing → artwork choice → admin product preparation → agreement and payout setup before publication → final parent approval → admin publication. Allow the parent to begin creating before entering bank information. Require the necessary payout readiness and accepted agreement before the first sale is enabled.

## Child profiles, photos, and privacy

Default public identity: parent-approved display name and non-photo illustrated avatar. Allow an optional age and optional US state, independently controlled by the parent and hidden by default. Do not publish date of birth, surname by default, city, street address, contact information, or personal school location.

Implement three profile-picture choices when the prerequisites are ready:
1. Illustrated avatar without a photo.
2. Parent-approved real photo.
3. AI caricature based on a privately uploaded photo.

Photos are optional. Obtain the required verified parental consent before collecting child information or photos. Strip metadata; use private storage and short-lived access; define and implement source-image retention/deletion and failed-job cleanup.

Do not add child messaging, public comments, location discovery, behavioral advertising, or automatic links to children's personal social accounts.

## Database, authorization, and architecture

Keep React, TypeScript, Vite, and Tailwind. Use Supabase for authentication, PostgreSQL, private storage, and supported server-side functions.

Design versioned migrations, constraints, row-level security, storage policies, and server-side authorization for adult accounts, artists, consents, profile revisions, submissions, artwork versions, generation jobs/credits, review events, products/variants, approvals, orders/items, provider mappings, coupons, agreements, earnings entries, payout recipients, webhooks, and school campaigns.

Keep private parent/child records separate from approved public views. Parents access only their family's records; organizers only their authorized campaign scope; admin operations require actual admin privileges. Verify ownership for every submitted ID. Never trust client-provided prices, rates, roles, consent status, payout readiness, or provider IDs.

Store secrets only in server environment settings. Browser Supabase values are public configuration; service-role, Stripe, Printful, AI, identity-provider, and email secrets must never have a VITE_ prefix or appear in source/logs/GitHub.

## Drawing and AI artwork workflow

Provide clear camera/photo guidance, upload validation, progress, saved drafts, title/story fields, and optional creative guidance. Protect upload endpoints with verified permissions, size/type checks, metadata cleanup, and safe file handling.

Use an image-capable model that accepts the original drawing as input. Generate four distinct polished apparel interpretations, not pictures of shirts. Keep the artwork separate from garment mockups. Preserve transparency where supported.

Default allowance: one initial batch of four. No automatic free second batch. A parent may request another batch with a reason; admin approves a specific additional entitlement. Reserve entitlements and deduplicate generation jobs atomically. Retry failed/missing outputs without billing or consuming a second allowance for the same logical job.

Keep paid regenerations disabled initially. Build a configurable extension point for a parent-funded one-time purchase later.

## Review and publication

Implement a server-enforced state machine with understandable labels:
Draft → Generating → Choose artwork → Admin review → Product preparation → Parent final approval → Ready to publish → Published.

Include changes requested, rejected, failed/retryable, withdrawn, and archived states where needed. Store immutable version references. The approved artwork, print placement, story, product variants and final preview must correspond to the published revision.

Admin can see the original drawing, all four options, selected option, story, consent/recipient readiness, print-file checks and history together. Require a reason when asking for changes or rejecting.

Final publication requires completed review, final parent approval, valid product mapping, approved pricing, accepted share terms, and payout readiness. Previewing a design must not publish it. Sharing becomes available only after publication.

## Printful integration

Printful is the chosen fulfillment provider. Use one Rendered Youth Printful store and the existing server adapter as a starting point.

Implement:
- A cached catalog and admin-approved launch assortment: initially a youth tee and adult tee; optional hoodie after samples.
- Real size/color catalog variant mappings, availability checks, garment details and size charts.
- Product-specific print areas, placement, resolution validation and file preparation.
- Asynchronous garment mockup generation from the approved artwork; persist final images because provider mockup URLs can expire.
- Fresh checkout shipping quotes for the actual destination, basket, quantities and currency.
- Fulfillment cost estimation, cost-change review, and availability exceptions.
- A durable order job created from verified payment state, followed by a Printful draft and controlled confirmation for fulfillment.
- Duplicate prevention, reconciliation after ambiguous timeouts, and a unique stable external reference no longer than the documented limit (32 characters).
- Verified provider notifications, event deduplication, tracking, partial shipments, holds, failure handling and periodic reconciliation.

Never send a child's original profile photo to Printful. Start with admin release of paid drafts during the pilot.

## Shopping, payments, and customer support

Complete the main shop, filters, product pages, creator shops, cart, checkout, confirmation, order history/lookup, and tracking pages. Preserve selected variants and validate the cart again on the server. Show accurate product images, materials, sizes, colors, price, shipping and tax before payment.

Use Stripe Checkout or a supported equivalent with server-priced orders and verified webhooks. Support duplicate/out-of-order events and delayed payment outcomes. Restrict return URLs to approved origins. Prevent duplicate orders from repeated clicks and sessions.

Use Stripe Connect for adult/school recipients. Prefer Stripe-hosted onboarding for required identity and bank details. Implement authenticated creation of short-lived onboarding links, safe refresh/return handling, requirement rechecks, and status updates.

Build support handling for cancellations, address issues, fulfillment failures, refunds, disputes and reprints.

## Earnings and creator-funded discounts

Use integer USD cents and basis points. Version agreements and preserve their effective rate on each sale. Admin rate changes must not rewrite history. Track estimated, pending, available, transferred and paid amounts accurately.

Define eligible revenue, discounts, shipping collected, fulfillment charges, payment fees, taxes and adjustments explicitly. Exclude customer sales tax from distributable revenue. Allocate basket-level amounts deterministically across items/recipients and preserve totals. Separate estimates from final actual costs. Use an immutable ledger with compensating entries for refunds and corrections.

Creator discounts apply only to that creator's eligible items and must be funded by that sale's creator earnings, not another artist's share or the platform's agreed share. Parents may propose a code; admin controls amount, expiry, eligible items, redemption limits and approval. Disable stacking initially. Revalidate on the server and reserve redemptions atomically.

For a simplified line calculation with list revenue R excluding pass-through tax, defined actual costs C, creator fraction s, and creator-funded discount D: base margin = max(0, R−C); creator before discount = floor(base margin × s); creator earnings = creator before discount − D; platform share = base margin − creator before discount. Reject D above the permitted creator allowance.

Configure payout timing, reserves/minimums and refund treatment before enabling live sales.

## Admin dashboard

Build an action-oriented workspace in the existing brand style:
- Today: items requiring action, organized by priority and age.
- Designs: review, changes, generation requests, approval history.
- Product preparation: print validation, variants, mockup jobs, pricing and publication.
- Orders: payment/fulfillment state, holds, failures, shipments, support and refunds.
- Families/artists: scoped account help, consent status, public-profile review, suspensions and deletion requests.
- Schools/campaigns: organizers, participation, approvals, dates, goals and recipients.
- Earnings/payouts: agreement history, estimates versus actuals, adjustments and failed payouts.
- Discounts: requests, limits, eligibility and redemption history.
- Settings: catalog, prices, generation budgets, notification settings, integration readiness and feature flags.

## Schools, sharing, and education

Complete the family pilot first. Keep school self-service behind a feature flag until its own end-to-end flow is tested; a genuine school inquiry page can be available earlier.

A campaign has an authorized organizer, defined goal/dates, approved parent participation and a verified school recipient. Families use the same creation pipeline. Campaign sales have one explicit recipient rule that does not accidentally also credit the family.

Published shops/campaigns receive permanent links, QR codes and parent-friendly sharing materials. Preserve privacy in URLs and generated QR payloads. Keep Future Founders as Coming Soon.

## English, Spanish, quality, and deployment

Implement structured localization for navigation, onboarding, dashboards, validation, checkout messaging, emails and core public content. Preserve language choice without altering access rights or shipping eligibility. Keep child stories in the submitted language unless a parent approves a translation.

Split the large studio component into maintainable feature modules as real services replace it. Use typed schemas, shared components, reusable form validation and clear API boundaries. Keep meaningful tests for money, permissions, state transitions, idempotency and provider failures.

Use responsive images, lazy-loaded routes, bounded/paginated queries, accessible labels, keyboard navigation, visible focus, adequate contrast, useful loading/error states, and appropriate SEO for approved public pages. Private pages should not be indexed.

Consult current official Stripe, Printful, Supabase, identity and AI-provider documentation before implementing integration details. Record the selected versions and deployment instructions.

No production domain cutover, real charges, paid print orders, or live payouts without explicit approval.

## Milestones

**A — Establish the foundation:** verify branch/files; read project docs; run baseline checks; audit current routes and simulations; produce a route/role matrix, data model and migration plan; implement the real server-backed parent account foundation. Preserve the current visual design.

**B — Family and privacy:** persistent multi-child accounts, role permissions, verified-consent integration, profile draft/public separation, resumable onboarding and deletion/withdrawal lifecycle. Photo uploads remain disabled until their prerequisites work.

**C — Creative pipeline:** private drawing upload, durable four-option generation, credits/spend controls, selection, change requests, versioned approvals and parent/admin notifications.

**D — Products:** live Printful assortment/mappings, print validation, mockup persistence, final parent approval, publishing and real storefront/cart behavior.

**E — Commerce:** Stripe Checkout/Connect, fulfillment jobs, verified events, tracking, deterministic ledger, refunds/disputes and tightly scoped discounts. Perform sandbox end-to-end tests before an approved physical sample order.

**F — Completion:** supported photo/caricature option, Spanish review, school campaign pilot, accessibility/mobile checks, security and failure-path testing, support/policy content and deployment handoff. Keep incomplete features explicitly gated.

After each milestone, update `docs/BUILD_STATUS.md`, a decisions log, a concise remaining-work list and test results.

## Acceptance criteria

The eventual finished site must demonstrate:
- A real parent can sign in, resume setup, and manage two children without another family accessing their records.
- Unverified parents cannot bypass consent gates or upload restricted child information.
- Four real image options are generated through one controlled job; failures and retries cannot create unbounded costs.
- Artwork choice, admin review, product preparation, parent approval and publishing reference the correct immutable versions.
- Printful variants, mockups, costs and shipping are genuine and persisted appropriately.
- Payment events create one order and one logical fulfillment job despite duplicates or timeouts.
- Payout onboarding state is verified server-side and private bank data never appears in application profiles.
- Discounts cannot cross creator boundaries, overspend earnings, or silently reduce the agreed platform share.
- Refunds, cancellations, partial shipments, cost changes and payout failures are represented honestly and reconciled.
- Photo/caricature consent, private processing, explicit publication choice and deletion work before enabling that feature.
- A school campaign credits its approved recipient correctly and respects each family's permissions.
- The agreed English/Spanish experiences work on mobile and desktop while retaining Rendered Youth's original aesthetics.
- GitHub contains runnable source, migrations, tests, safe configuration examples and clear deployment instructions.
