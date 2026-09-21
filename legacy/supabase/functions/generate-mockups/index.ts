// Generate 4 print-ready shirt designs from a child's drawing using OpenAI's
// image model (gpt-image-1). The creator's own description of their artwork is
// fed into every prompt so the AI renders THEIR vision, not its own invention.
//
// Required secrets (set with `supabase secrets set ...`):
//   OPENAI_API_KEY            - your OpenAI key
//   SUPABASE_URL              - provided automatically
//   SUPABASE_SERVICE_ROLE_KEY - provided automatically

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const STORAGE_BUCKET = "designs";
const OPENAI_IMAGE_EDIT_URL = "https://api.openai.com/v1/images/edits";

/** The four looks each drawing is rendered into. Tweak freely. */
const STYLES = [
  {
    key: "bold_vector",
    label: "Bold & Graphic",
    direction:
      "Bold vector illustration with thick confident outlines, flat solid color fills, " +
      "and strong shapes. Clean modern graphic-tee look, like premium screen-printed apparel.",
  },
  {
    key: "retro_print",
    label: "Retro Print",
    direction:
      "Vintage screen-print style with a warm limited retro palette, subtle halftone texture " +
      "and slightly distressed edges. 1970s-inspired classic tee artwork.",
  },
  {
    key: "playful_cartoon",
    label: "Playful Cartoon",
    direction:
      "Charming polished cartoon illustration with smooth clean linework, cheerful saturated " +
      "colors and soft shading. Friendly, characterful and full of personality.",
  },
  {
    key: "painted",
    label: "Painted",
    direction:
      "Rich hand-painted illustration with expressive brushwork, layered color and gentle " +
      "depth. Artistic and textured while staying crisp enough to print.",
  },
];

/** Rules applied to every style so output is always print-ready. */
const PRINT_RULES =
  "The artwork must be a single centered self-contained design isolated on a plain empty background, " +
  "with nothing behind it. Do NOT draw a t-shirt, garment, mockup, model, hanger, frame, border, " +
  "background scenery, drop shadow on the ground, watermark or signature. " +
  "Do NOT add any text, letters, words or numbers unless they appear in the original drawing. " +
  "Crisp clean edges suitable for direct-to-garment printing. Commercial apparel-graphic quality.";

interface GenerateRequest {
  designId: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openaiKey) {
    return json({ error: "Image generation is not configured yet." }, 500);
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  let designId: string;

  try {
    const body = (await req.json()) as GenerateRequest;
    designId = body?.designId;
    if (!designId || typeof designId !== "string") {
      return json({ error: "A designId is required." }, 400);
    }
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  try {
    // --- 1. Identify the caller ------------------------------------------
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace("Bearer ", "");
    const { data: userData } = await admin.auth.getUser(jwt);
    const caller = userData?.user;

    if (!caller) {
      return json({ error: "You must be signed in." }, 401);
    }

    // --- 2. Load the design and authorize ---------------------------------
    const { data: design, error: designError } = await admin
      .from("designs")
      .select(
        "id, user_id, title, inspiration, file_url, ai_status, ai_generation_count, " +
          "art_description, art_subject, art_colors, art_mood",
      )
      .eq("id", designId)
      .single();

    if (designError || !design) {
      return json({ error: "Design not found." }, 404);
    }

    const { data: adminRow } = await admin
      .from("admin_users")
      .select("user_id")
      .eq("user_id", caller.id)
      .maybeSingle();

    const isOwner = design.user_id === caller.id;
    const isAdmin = Boolean(adminRow);

    if (!isOwner && !isAdmin) {
      return json({ error: "You do not have access to this design." }, 403);
    }

    if (design.ai_status === "generating") {
      return json({ error: "Designs are already being generated." }, 409);
    }

    // --- 3. Mark as generating -------------------------------------------
    const batch = (design.ai_generation_count ?? 0) + 1;
    await admin
      .from("designs")
      .update({ ai_status: "generating", ai_error: null })
      .eq("id", designId);

    // --- 4. Fetch the child's original drawing ----------------------------
    const drawingResponse = await fetch(design.file_url);
    if (!drawingResponse.ok) {
      throw new Error("Could not read the uploaded artwork.");
    }
    const drawingBlob = await drawingResponse.blob();

    // --- 5. Build the shared description of the creator's intent ----------
    const visionParts = [
      design.art_subject && `The drawing shows: ${design.art_subject}.`,
      design.art_description && `In the artist's words: "${design.art_description}".`,
      design.art_colors && `Preferred colors: ${design.art_colors}.`,
      design.art_mood && `The feeling it should have: ${design.art_mood}.`,
      !design.art_description && design.inspiration &&
        `The artist's inspiration: "${design.inspiration}".`,
    ].filter(Boolean).join(" ");

    const intent =
      `This is an original drawing by a young artist, titled "${design.title}". ` +
      (visionParts ? `${visionParts} ` : "") +
      "Reinterpret this drawing as a professional, polished t-shirt graphic. " +
      "Stay faithful to the artist's idea, subject and composition - keep what makes their " +
      "drawing recognizably theirs - while elevating the craft to commercial quality.";

    // --- 6. Generate the four styles in parallel --------------------------
    const results = await Promise.allSettled(
      STYLES.map((style) =>
        generateOne({
          openaiKey,
          drawingBlob,
          prompt: `${intent} STYLE: ${style.direction} ${PRINT_RULES}`,
        }).then(async (bytes) => {
          const path =
            `ai-mockups/${designId}/batch-${batch}-${style.key}.png`;

          const { error: uploadError } = await admin.storage
            .from(STORAGE_BUCKET)
            .upload(path, bytes, {
              contentType: "image/png",
              upsert: true,
            });

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = admin.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(path);

          return { style, publicUrl };
        })
      ),
    );

    const succeeded = results.filter(
      (r): r is PromiseFulfilledResult<{ style: typeof STYLES[number]; publicUrl: string }> =>
        r.status === "fulfilled",
    );
    const failures = results
      .filter((r): r is PromiseRejectedResult => r.status === "rejected")
      .map((r) => String(r.reason?.message ?? r.reason));

    if (succeeded.length === 0) {
      throw new Error(failures[0] ?? "Image generation failed.");
    }

    // --- 7. Replace any previous AI mockups with the new batch ------------
    await admin
      .from("design_mockups")
      .delete()
      .eq("design_id", designId)
      .eq("is_ai_generated", true);

    const { error: insertError } = await admin
      .from("design_mockups")
      .insert(
        succeeded.map((r, index) => ({
          design_id: designId,
          mockup_url: r.value.publicUrl,
          mockup_order: index + 1,
          style_key: r.value.style.key,
          style_label: r.value.style.label,
          is_ai_generated: true,
          generation_batch: batch,
        })),
      );

    if (insertError) throw insertError;

    await admin
      .from("designs")
      .update({
        ai_status: "ready",
        ai_generated_at: new Date().toISOString(),
        ai_generation_count: batch,
        ai_error: failures.length ? `${failures.length} style(s) failed` : null,
        status: "awaiting_selection",
      })
      .eq("id", designId);

    return json({
      success: true,
      generated: succeeded.length,
      failed: failures.length,
      mockups: succeeded.map((r) => ({
        style: r.value.style.label,
        url: r.value.publicUrl,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("generate-mockups failed:", message);

    await admin
      .from("designs")
      .update({ ai_status: "failed", ai_error: message.slice(0, 500) })
      .eq("id", designId);

    return json({ error: message }, 500);
  }
});

/** Send one styled prompt to OpenAI and return the resulting PNG bytes. */
async function generateOne(opts: {
  openaiKey: string;
  drawingBlob: Blob;
  prompt: string;
}): Promise<Uint8Array> {
  const form = new FormData();
  form.append("model", "gpt-image-1");
  form.append("image", opts.drawingBlob, "drawing.png");
  form.append("prompt", opts.prompt);
  form.append("n", "1");
  form.append("size", "1024x1024");
  form.append("quality", "high");
  form.append("background", "transparent");
  form.append("output_format", "png");

  const response = await fetch(OPENAI_IMAGE_EDIT_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${opts.openaiKey}` },
    body: form,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `OpenAI ${response.status}: ${detail.slice(0, 200)}`,
    );
  }

  const payload = await response.json();
  const b64 = payload?.data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenAI returned no image.");

  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
