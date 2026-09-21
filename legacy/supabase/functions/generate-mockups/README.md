# AI mockup generation

Turns a child's uploaded drawing into four polished, print-ready shirt designs
using OpenAI's `gpt-image-1` image model. The creator's own answers about their
artwork (what it is, details, colors, mood) are fed into every prompt so the AI
renders *their* vision rather than inventing its own.

## What it does

1. Verifies the caller owns the design (or is an admin).
2. Downloads the original drawing.
3. Sends it to OpenAI four times, once per art style.
4. Uploads each result to the `designs` storage bucket under `ai-mockups/`.
5. Inserts rows into `design_mockups` so the existing "pick your favorite"
   page works with no changes, and sets `designs.ai_status = 'ready'`.

Partial failures are tolerated: if three of four styles succeed, those three are
saved and the creator can still choose.

## Setup

**1. Apply the database migration** (adds the vision + status columns):

```bash
supabase link --project-ref REPLACE_WITH_TEST_PROJECT
supabase db push
```

**2. Add your OpenAI key as a secret** (never commit it):

```bash
supabase secrets set OPENAI_API_KEY=sk-your-key-here
```

**3. Deploy the function:**

```bash
supabase functions deploy generate-mockups
```

## Cost

Roughly 4-8 cents per drawing (four `high` quality images). Generation is
triggered automatically on upload; to make it admin-only instead, remove the
`generateMockups(...)` call in `src/pages/CreatorUpload.tsx` and use the
"Generate AI Designs" button in the admin dashboard.

## Output format

Images are 1024x1024 PNGs with a **transparent** background, which is what
print-on-demand services need - a baked-in white background would print as a
white box on colored shirts. The site previews them against white.

For large prints (12"x16"), 1024px lands under Printful's preferred 150 DPI.
It is fine for standard chest prints; add an upscaling step before fulfillment
if you sell oversized prints.

## Tuning the styles

Edit the `STYLES` array in `index.ts`. Each entry has a `key` (stored in the
database), a `label` (shown to the creator) and a `direction` (the prompt text).
`PRINT_RULES` is appended to every prompt and enforces the isolated,
print-ready output - change it with care.
