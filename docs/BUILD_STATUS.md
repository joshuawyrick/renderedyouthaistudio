# Rendered Youth — Build Status

## Current milestone: A — Foundation (COMPLETE)

### What was implemented

**Database (Supabase)**
- Migration `0001_parent_account_foundation` applied with 5 tables:
  - `profiles` — extends `auth.users` with role (`parent`/`admin`), display name, onboarding step, consent accepted, payout ready
  - `artists` — child profiles owned by a parent (display name, illustrated avatar, optional age/state with visibility toggles, bio, goal)
  - `designs` — drawing submissions with the full workflow state machine (draft → generating → choose → review → changes → mockup → parent_approval → ready → published)
  - `design_events` — immutable audit log of design state transitions
  - `app_settings` — admin-controlled configurable platform settings
- Row Level Security enabled on all tables with ownership-scoped policies
- Database triggers: auto-create profile on signup, protect `role`/`payout_ready` columns from non-admin updates, auto-update timestamps, log stage transitions to design history
- A trigger prevents non-admin users from changing their own `role` or `payout_ready` — these are server-controlled only

**Authentication**
- Real Supabase auth context (`AuthContext.tsx`) replacing the in-memory studio account state
- Email/password sign-up and sign-in with session persistence
- Profile auto-created on signup via database trigger
- Onboarding state tracked on the server (`onboarding_step` column)
- Sign-out clears session and profile state

**Studio component**
- Rewired to use real Supabase auth and database instead of in-memory `useState`
- `useArtists` hook — loads, adds, and deletes child profiles from the database
- `useDesigns` hook — loads, creates, and updates designs from the database
- Parent onboarding flow: sign up → consent → add artists → create designs
- Admin access checked against server-side `profile.role` — no client-side role switching
- Visual design preserved entirely (black header, yellow accents, studio CSS unchanged)

**Type safety**
- Updated `src/integrations/supabase/types.ts` with new schema + legacy table types for backward compatibility
- Updated `src/integrations/supabase/client.ts` to use real credentials
- All existing services and pages continue to compile

### What was verified
- TypeScript typecheck: 0 errors
- Offline test suite: 10/10 pass (workflow state machine, earnings math, permissions)
- Production build: succeeds
- Database tables: 5 tables live with RLS enabled and correct policies
- Security posture: ownership-scoped policies confirmed via `get_security_posture`

### What still uses mocks/simulations
- Studio design generation: shows sample style cards instead of real AI images (Milestone C)
- Studio payout setup: "Preview completed Stripe setup" button simulates Stripe Connect (Milestone E)
- Studio product preview: shows a shirt icon instead of real Printful mockups (Milestone D)
- Studio earnings: $0.00 hard-coded (Milestone E)
- Studio sharing: no real shop links or QR codes (Milestone D)
- Admin orders, families, and settings pages: placeholder content (later milestones)
- Old storefront pages (Store, ProductDetail, Cart, Checkout, Orders) still reference legacy schema and will be rewired in Milestone D

### Secrets/configuration needed next
- **AI image provider** API key — needed for Milestone C (four-option generation)
- **Printful** store API key — needed for Milestone D (catalog, mockups, fulfillment)
- **Stripe** API keys — needed for Milestone E (Checkout + Connect)
- **Identity/parental-consent provider** (e.g., Persona) — needed for Milestone B (verified consent)
- **Admin account** — needs to be provisioned by directly setting `role='admin'` on a profile in the database (no public admin signup)

### Decisions made
1. Started with a fresh database schema rather than deploying legacy migrations — the old schema had security issues and didn't match the brief's requirements
2. Kept legacy table types in TypeScript for backward compatibility — old services will be rewired in later milestones
3. Used `SECURITY DEFINER` triggers for profile column protection and auto-creation — ensures enforcement even if RLS policies are changed
4. Admin role is server-provisioned only — no public admin signup or role-switching button

### Remaining work
- **Milestone B:** Persistent multi-child accounts, consent gates, profile draft/public separation, resumable onboarding, deletion lifecycle
- **Milestone C:** Drawing upload, durable four-option generation, credits, selection, versioned approvals
- **Milestone D:** Printful catalog, print validation, mockup persistence, publishing, real storefront
- **Milestone E:** Stripe Checkout/Connect, fulfillment jobs, ledger, refunds, discounts
- **Milestone F:** Photo/caricature, Spanish, school campaigns, accessibility, security testing, deployment
