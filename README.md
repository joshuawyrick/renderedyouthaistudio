# Rendered Youth AI Studio

Rebuild in progress. Preserve the original Rendered Youth logo, black/yellow/white palette, and approved brand copy.

Target: React, TypeScript, Vite, Tailwind and a server-side backend compatible with the Bolt workflow.

This repository now contains the full original website source plus the new family/admin workflow preview. Printful is the selected fulfillment provider. The complete site is **not production-ready**: the new workflows use sample in-memory data and real service integrations are pending. See [build status](docs/BUILD_STATUS.md), [operating model](docs/OPERATING_MODEL.md), and [Printful foundation](docs/PRINTFUL.md).

## Run locally or import into Bolt

Use Node 24 or later. Run `npm ci`, then `npm run dev`. The original homepage opens at `/`; start the new workflow at `/start`. No backend credentials are needed to review the sample workflow. Refreshing clears sample family data.

`npm run build` creates a production bundle. `npm run typecheck` checks the React application. `npm test` runs the offline workflow and Printful tests.

To review a hosted test build, set `VITE_WORKFLOW_PREVIEW=true` before building. Leave it off for production; do not deploy this revision for live commerce. Never enter real child, identity, bank, or payment data in the preview.

## Code organization

- `src/`: full original frontend, with new flows under `src/features/studio`.
- `public/`: original imagery and full-size supplied logo.
- `server/`: server-only Printful adapter and tests; not yet exposed through authenticated endpoints.
- `legacy/supabase/`: original backend retained as migration reference. Do not deploy unchanged.
- `docs/`: decisions, remaining work, and provider integration plan.

The original Supabase project and its embedded public token have been removed. Configure a new test backend through `.env.local` only when its schema and permissions are ready. Keep all provider secrets server-side and out of GitHub.
