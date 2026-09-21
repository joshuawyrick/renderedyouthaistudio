# Rebuild status — 2026-09-21

## What is in this repository

The full supplied React/TypeScript/Vite application, original public images, the supplied full-size Rendered Youth logo, a new family/admin workflow preview, the Printful server adapter, and tests. Original server functions and migrations are retained under `legacy/supabase` for reference, not deployment. The original project connection and embedded legacy tokens have been removed.

## Implemented in this revision

- Role chooser: shopper, parent/guardian, school organizer information.
- One sample parent account with multiple separate artist profiles.
- Optional age and state visibility, default off; illustrated avatars without uploading photos.
- Parent and admin navigation, sample drawing submission and four-option selection.
- Explicit artwork review, change request, product preparation, parent final approval and publication stages.
- Admin approval of extra generation requests, no automatic free second batch.
- Sample payout setup before publication; a share rate is also required.
- Admin pricing worksheet and tested creator-funded discount arithmetic.
- Preserved original public pages and visual assets, repaired primary shopping CTA and footer legal links.
- Safer responsive header; consistent new onboarding destinations.
- Printful adapter with paid confirmation disabled by default.
- Optimized web images: about 86% less image data, with lossless logos and high-quality WebP for large illustrations. Original PNGs remain in the backup source archive.

## Verification for this revision

TypeScript application check and 10 offline tests passed. A Vite production bundle compiled successfully through the equivalent programmatic build configuration; the standard Windows config loader hit an environment directory-access restriction. Browser verification covered two artists under one parent, submission, four-option selection, admin preparation, parent approval, blocked publication before payout/rate setup, successful sample publication, and a 390px layout without horizontal overflow. These checks do not verify live services.

## Important boundary

New workflows are an in-memory interactive preview, enabled in local development or with `VITE_WORKFLOW_PREVIEW=true`. They deliberately do not collect child photos, run AI, verify anyone, connect a bank, issue a coupon, publish a real product, or print an order. Refresh clears sample data. Their role toggle and checkboxes are not authorization or consent mechanisms.

Production builds without the preview flag show a registration-unavailable screen for the new studio. Connecting a Supabase URL alone does not complete the backend. The existing public shop/cart and policy pages remain inherited code requiring migration and content reconciliation; do not deploy this branch as a live commerce site.

## Still required

1. New database model and permissions for adult users, children, approvals, immutable artwork versions and school campaign recipients.
2. Real authentication, verified parental consent, identity-provider integration, permission withdrawal and deletion workflow.
3. Durable private uploads, secure asynchronous AI jobs, one initial batch allowance, atomic admin credits and failure recovery.
4. Avatar/caricature processing with explicit consent for provider disclosure, source retention/deletion, publication choice, metadata removal and parent review. Caricatures are not anonymous by default.
5. Stripe Connect server endpoints and verified requirements status, checkout/payment events, immutable earnings ledger, refunds/disputes, payout timing and reconciliation.
6. Live Printful catalog/variants, saved mockups, fulfillment queue, signed/verified notifications and shipment reconciliation.
7. Server-enforced creator discount item scope, limits, expiry, cost reserve, and protection from concurrent redemption. A later fulfillment overrun needs an explicit adjustment policy.
8. Full Spanish translation, school campaign implementation, updated operational/policy copy, and accessibility/end-to-end verification of the inherited pages.

No final share percentage, paid regeneration price, or payout schedule has been selected. The pricing worksheet is illustrative. Production requires explicit agreement terms and tested account configuration.
