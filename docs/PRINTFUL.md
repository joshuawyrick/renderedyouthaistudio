# Rendered Youth — Printful integration foundation

Printful is the selected fulfillment provider. This is a server adapter and implementation contract for the rebuild, not a connected production integration or a complete website.

## Configuration

Create one Printful store for Rendered Youth. Configure its private API token and store ID as backend secrets (`PRINTFUL_TOKEN`, `PRINTFUL_STORE_ID`). Never use a VITE_ prefix or put secrets in GitHub or chat. Keep fulfillment disabled during development. No live requests or paid orders were made when testing this package.

## Workflow to implement

1. Parent submits drawing and story; AI generates four artwork options in a separate service.
2. Family chooses one. Admin reviews the artwork, story, rights, and print suitability.
3. Admin chooses from a limited approved Printful catalog: youth tee, adult tee, optional hoodie. Store real catalog variant IDs for every size/color. Do not offer every catalog item automatically.
4. Read Printful print-area requirements. Check actual pixel dimensions at the intended print size; AI output is not automatically print-ready.
5. Generate garment mockups asynchronously. Save completed images to Rendered Youth storage because Printful mockup URLs are temporary. Do not expose the child's original drawing to the fulfillment service.
6. Parent approves the final product preview. Admin publishes the approved artwork revision, story, mockups, sizes, colors, and price together. Changes to artwork or placement invalidate that approval.
7. At checkout, load prices and variant mappings from the server, check availability, obtain a fresh shipping quote, and estimate fulfillment cost. Shipping quotes are not permanent price guarantees. Customer sales-tax calculation is a separate concern.
8. Verified payment event creates a durable fulfillment job in the same database transaction as the paid-order update. Use a unique job per order; do not rely on a browser confirmation page or a read-then-write paid check.
9. Worker locks the job, checks Printful for its stored external reference, and creates a draft only if absent. Persist a unique reference of at most 32 characters; a standard 36-character UUID cannot be used directly. On timeout, reconcile by reference before retrying. Compare costs against the accepted order budget and queue exceptions for admin.
10. Confirm the draft only after payment, approval, fraud/refund state, and cost checks pass. Confirmation starts fulfillment and can charge the store. Begin launch with admin release, then enable automatic release once the full flow has been tested.
11. Verify incoming Printful notifications using the selected API version's documented mechanism. Re-fetch the referenced order from Printful before changing local state. Deduplicate events, handle partial shipments, and periodically reconcile missed updates. Show tracking in buyer and admin dashboards; creator dashboards show aggregate sales without buyer addresses.
12. Record estimated versus actual fulfillment costs, processor fees, refunds, and the applicable revenue-share agreement per sale. Do not calculate creator earnings using the old percentage-of-gross code. Payout eligibility requires a separately defined settlement/returns policy.

## Admin screens

- Catalog and allowed variants, print placement templates, pricing and margin preview.
- Selected artwork queue, print preparation, mockup job progress/retry, parent approval status, publish action.
- Paid orders awaiting release, fulfillment failures, cost changes, unavailable variants, partial shipments and tracking.
- Earnings reconciliation, parent/school recipient, agreement history, payout status.

## Implementation status

Implemented: server-only API adapter for catalog, print specifications/templates, mockup jobs, shipping, estimates, draft orders, reconciliation lookup, and explicitly enabled confirmation. Five offline contract tests cover request boundaries and safeguards.

Pending: database migrations and row permissions, authenticated endpoints, durable workers, frontend/admin integration, payment coupling, webhook verification and handling, permanent mockup storage, account configuration, live catalog/sample validation, and end-to-end testing. Adapter responses not yet modeled are deliberately typed `unknown` until runtime validation is added at the application boundary.

Existing source audit: `generate-mockups` generates AI artwork rather than Printful garment previews. The existing payment finalizer uses a non-atomic read-then-write check and records gross-based commissions; replace it before connecting paid fulfillment.

## Verification

With Node 24: `node --experimental-transform-types --test server/printful.test.ts`.

Official API reference: https://developers.printful.com/docs/
