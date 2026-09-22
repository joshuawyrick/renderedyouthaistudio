// Generate up to 4 print-ready shirt designs from a young artist's drawing using
// OpenAI's gpt-image-1 image edit model. The creator's story and selected logo
// styles are fed into every prompt so the AI renders THEIR vision.
//
// Required secret: OPENAI_API_KEY (set via Supabase secrets)

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const STORAGE_BUCKET = "designs";
const OPENAI_IMAGE_EDIT_URL = "https://api.openai.com/v1/images/edits";

// ── Logo style definitions (mirrored from src/lib/logoStyles.ts) ──

interface LogoStyle {
  key: string;
  label: string;
  prompt: string;
}

const LOGO_STYLE_MAP: Record<string, LogoStyle> = {
  "nineties-neon": {
    key: "nineties-neon",
    label: "90s Neon Graphic",
    prompt: "90s neon graphic t-shirt logo style. Bold flat color blocks in hot pink, electric teal, bright yellow, and black. Thick black or dark outlines around every shape and letter. High-contrast poster graphic, like a 1990s arcade cabinet or Nickelodeon-era merch print. Colors should look like bright screen-print inks, NOT light-up neon tubes, NOT bloom, NOT lens flare, NOT chrome. Solid fills only. Print-safe flat graphic.",
  },
  "synthwave": {
    key: "synthwave",
    label: "Synthwave / Outrun",
    prompt: "synthwave / outrun t-shirt logo style. Flat stacked sunset color bands in magenta, orange, and deep purple. Simple one-point perspective grid or horizon line as graphic shapes, not a 3D render. Bold geometric lettering. Limited palette, hard edges, poster illustration. No chrome reflections, no glowing bloom, no photoreal sunset, no metallic sheen. Screen-print friendly flat graphic.",
  },
  "seventies-psych": {
    key: "seventies-psych",
    label: "70s Psychedelic",
    prompt: "1970s psychedelic t-shirt logo style. Groovy swirling organic shapes, warped chunky lettering, peace-era poster composition. Palette of harvest gold, burnt orange, avocado green, cream, and brown. Flat fills with thick contours, like a vintage concert poster or hippie iron-on. No photorealism, no neon glow, no 3D. Warm analog screen-print look.",
  },
  "vintage-distressed": {
    key: "vintage-distressed",
    label: "Vintage Distressed Band Tee",
    prompt: "vintage distressed band-tee logo style. Looks like a worn 1980s\u201390s concert shirt graphic. Faded screen-print ink, slight cracked-ink and misregistration texture, muted limited palette (cream, rust, dusty navy, black, olive). Softly aged, not dirty or unreadable. Flat printed graphic sitting on the shirt, not a photo of a shirt. No metallic foil, no photoreal fabric wrinkles as the main subject.",
  },
  "y2k": {
    key: "y2k",
    label: "Y2K Graphic",
    prompt: "early-2000s Y2K graphic t-shirt logo style. Chunky bubble lettering, star and sparkle shapes drawn as flat icons, playful stickers and swooshes. Palette of hot pink, baby blue, lime, white, and black. Fun, glossy-looking only as flat color, NOT actual chrome, NOT holographic foil, NOT iridescent metal. Bold cartoon graphic print, high contrast, thick shapes.",
  },
  "memphis": {
    key: "memphis",
    label: "80s Memphis",
    prompt: "1980s Memphis design t-shirt logo style. Playful postmodern geometry: squiggles, triangles, circles, dashes, and terrazzo-like dots. Clashing flat primaries \u2014 red, cobalt, yellow, black, white, maybe mint. No gradients, no shadows, no 3D. Looks like a Sottsass / 80s pattern poster turned into a logo mark. Clean hard-edge screen print.",
  },
  "grunge": {
    key: "grunge",
    label: "90s Grunge",
    prompt: "1990s grunge alternative t-shirt logo style. Distressed, scuffed, slightly muddy texture. Torn-edge or xeroxed shapes. Palette of black, forest green, maroon, dirty cream, and gray. Feels like Nirvana-era merch or a photocopied flyer printed on a tee. Readable, bold, not a muddy smear. No neon, no gloss, no metal.",
  },
  "streetwear": {
    key: "streetwear",
    label: "Streetwear Wordmark",
    prompt: "modern streetwear wordmark t-shirt logo style. Oversized heavy typography as the hero. Tight custom letterspacing, strong attitude, high contrast. Mostly black, white, and one accent color. Minimal extra illustration. Looks like a boxy graphic-tee print from a streetwear brand, not a corporate logo on a business card. Flat ink, no bevel, no chrome, no drop-shadow glow.",
  },
  "graffiti": {
    key: "graffiti",
    label: "Graffiti / Tag",
    prompt: "graffiti tag t-shirt logo style. Bold wildstyle or throw-up lettering with fat outlines and a few drip shapes drawn as solid graphic elements. High-contrast fill colors. Street-art energy but flattened for fabric printing. Do NOT use airbrush spray mist, haze, or photoreal brick walls. No photoreal paint sheen. Clean printable shapes with thick contours.",
  },
  "punk-zine": {
    key: "punk-zine",
    label: "Punk Zine",
    prompt: "1970s\u201380s punk zine t-shirt logo style. Cut-and-paste collage, ransom-note mixed lettering, xerox / photocopy grain, high-contrast black plus one accent (red or yellow). Crooked baselines, torn paper edges as graphic shapes. Anarchic flyer energy. Flat print, not a photo of paper on a table. No metallic, no neon glow.",
  },
  "heavy-metal": {
    key: "heavy-metal",
    label: "Heavy Metal Badge",
    prompt: "heavy metal band badge t-shirt logo style. Circular or shield emblem, gothic / blackletter-inspired lettering, spikes, banners, flames drawn as flat graphic shapes. Dark limited palette: black, bone, blood red, dull gold as flat ochre (not shiny metal). Concert-merch crest. No photoreal chrome, no 3D bevel, no glowing fire.",
  },
  "collegiate-badge": {
    key: "collegiate-badge",
    label: "Badge / Crest / Collegiate",
    prompt: "vintage collegiate badge / crest t-shirt logo style. Circle, shield, or athletic seal with an inner icon, arched type, and a banner ribbon. Two or three flat colors such as navy, cream, and burgundy. Varsity / prep / national-park patch energy. Clean emblem, centered, printable. No metallic gold foil, no embroidery thread texture unless implied as flat illustration.",
  },
  "pop-art": {
    key: "pop-art",
    label: "Comic / Pop Art",
    prompt: "comic book / pop art t-shirt logo style. Thick black outlines, Ben-Day or halftone dots for shading, flat primary fills of red, yellow, blue, plus black and white. Lichtenstein / vintage comic energy. Graphic and punchy. Halftone dots must be large enough to print. No photoreal faces, no airbrush, no metallic.",
  },
  "trad-tattoo": {
    key: "trad-tattoo",
    label: "Traditional Tattoo",
    prompt: "traditional American tattoo flash t-shirt logo style. Very thick black outlines, limited solid fills (red, yellow, green, black, cream), classic tattoo motifs if relevant (banners, roses, eagles, daggers) simplified into a logo. Sailor Jerry / flash-sheet look. High contrast, no gray wash realism, no watercolor bleed, no fine single-needle lines.",
  },
  "pixel-8bit": {
    key: "pixel-8bit",
    label: "Pixel / 8-bit",
    prompt: "8-bit pixel art t-shirt logo style. Large chunky pixels, like a NES / Game Boy sprite scaled up for a shirt. Limited palette (8 colors or fewer). Blocky readable silhouette. Each pixel cluster big enough to print on fabric. No tiny 1-pixel noise, no photoreal, no CRT glow, no scanline bloom.",
  },
  "minimal-vector": {
    key: "minimal-vector",
    label: "Minimal Flat Vector",
    prompt: "minimalist flat vector t-shirt logo style. Simple geometric shapes, generous clarity, 2\u20133 solid colors only. Clean edges, balanced negative space, icon-like mark that still works as a tee graphic. No gradients, no shadows, no textures, no fine hairlines, no photorealism. Screen-print / DTG friendly.",
  },
  "hand-drawn": {
    key: "hand-drawn",
    label: "Hand-drawn Sketch",
    prompt: "hand-drawn ink sketch t-shirt logo style. Imperfect human doodle energy with BOLD marker / brush strokes, not faint pencil. Slightly wobbly but readable lettering and icons. High-contrast black (plus one optional accent). Looks like a Sharpie drawing, not a light graphite sketch. No hairline scratches that would vanish on fabric.",
  },
  "japanese-graphic": {
    key: "japanese-graphic",
    label: "Japanese Graphic",
    prompt: "Japanese graphic t-shirt logo style. Either ukiyo-e woodblock flat color planes or clean anime-style thick line art. Bold limited palette, strong silhouette, poster-like composition. Inspired by vintage Japanese matchbox / woodblock merch or modern anime logo tees. Flat prints only. No photoreal, no metallic gold leaf, no glow.",
  },
};

const PRINT_CONSTRAINTS =
  "This is a print-ready T-shirt logo graphic for Printify/Printful DTG or DTF. Isolated centered artwork on a plain white or transparent background. Flat colors, thick shapes, high contrast, limited palette. Screen-print friendly. No photorealism, no photographic fabric mockup, no model wearing a shirt, no hangtag, no watermark. No metallic chrome, no foil, no holographic rainbow sheen, no glowing neon tubes, no lens flare, no soft airbrush mist, no fade-to-transparent gradients. No tiny unreadable text, no hairline strokes. Bold silhouette that stays clear when printed on cotton.";

const DEFAULT_STYLES: LogoStyle[] = [
  {
    key: "bold_vector",
    label: "Bold & Graphic",
    prompt:
      "Bold vector illustration with thick confident outlines, flat solid color fills, " +
      "and strong shapes. Clean modern graphic-tee look, like premium screen-printed apparel.",
  },
  {
    key: "retro_print",
    label: "Retro Print",
    prompt:
      "Vintage screen-print style with a warm limited retro palette, subtle halftone texture " +
      "and slightly distressed edges. 1970s-inspired classic tee artwork.",
  },
  {
    key: "playful_cartoon",
    label: "Playful Cartoon",
    prompt:
      "Charming polished cartoon illustration with smooth clean linework, cheerful saturated " +
      "colors and soft shading. Friendly, characterful and full of personality.",
  },
  {
    key: "painted",
    label: "Painted",
    prompt:
      "Rich hand-painted illustration with expressive brushwork, layered color and gentle " +
      "depth. Artistic and textured while staying crisp enough to print.",
  },
];

function resolveStyles(logoStyleIds: string[] | null | undefined): LogoStyle[] {
  if (!logoStyleIds || logoStyleIds.length === 0) {
    return DEFAULT_STYLES;
  }

  const resolved: LogoStyle[] = [];
  for (const id of logoStyleIds) {
    const style = LOGO_STYLE_MAP[id];
    if (style) resolved.push(style);
  }

  if (resolved.length === 0) return DEFAULT_STYLES;
  return resolved.slice(0, 4);
}

function buildPrompt(design: { title: string; story: string }, style: LogoStyle, allStyles: LogoStyle[]): string {
  const parts: string[] = [];

  parts.push(
    `This is an original drawing by a young artist, titled "${design.title}". ` +
    `The story behind it: ${design.story}. ` +
    "Reinterpret this drawing as a professional, polished t-shirt graphic. " +
    "Stay faithful to the artist's idea, subject and composition — keep what makes their " +
    "drawing recognizably theirs — while elevating the craft to commercial quality.",
  );

  parts.push(`STYLE: ${style.prompt}`);

  if (allStyles.length > 1) {
    const others = allStyles.filter((s) => s.key !== style.key);
    if (others.length > 0) {
      parts.push(
        "The artist also selected these supporting style flavors (blend subtly, do not override the primary style): " +
        others.map((s) => s.label).join(", ") + ".",
      );
    }
  }

  parts.push(PRINT_CONSTRAINTS);

  return parts.join("\n\n");
}

interface GenerateRequest {
  designId: string;
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      return json({ error: "Image generation is not configured. Set OPENAI_API_KEY in Supabase secrets." }, 500);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const admin = createClient(supabaseUrl, serviceRoleKey);

    let designId: string;
    try {
      const body = await req.json() as GenerateRequest;
      designId = body?.designId;
      if (!designId || typeof designId !== "string") {
        return json({ error: "A designId is required." }, 400);
      }
    } catch {
      return json({ error: "Invalid request body." }, 400);
    }

    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace("Bearer ", "");
    const { data: userData } = await admin.auth.getUser(jwt);
    const caller = userData?.user;

    if (!caller) {
      return json({ error: "You must be signed in." }, 401);
    }

    const { data: design, error: designError } = await admin
      .from("designs")
      .select("id, parent_id, title, story, drawing_url, ai_status, ai_generation_count, logo_styles")
      .eq("id", designId)
      .maybeSingle();

    if (designError || !design) {
      return json({ error: "Design not found." }, 404);
    }

    const isOwner = design.parent_id === caller.id;

    const { data: profile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", caller.id)
      .maybeSingle();

    const isAdmin = profile?.role === "admin";

    if (!isOwner && !isAdmin) {
      return json({ error: "You do not have access to this design." }, 403);
    }

    if (design.ai_status === "generating") {
      return json({ error: "Generation is already in progress." }, 409);
    }

    if (!design.drawing_url) {
      return json({ error: "This design has no drawing to generate from. Upload a drawing first." }, 400);
    }

    const batch = (design.ai_generation_count ?? 0) + 1;
    await admin
      .from("designs")
      .update({ ai_status: "generating", ai_error: null })
      .eq("id", designId);

    const { data: drawingData, error: downloadError } = await admin
      .storage
      .from("drawings")
      .download(design.drawing_url);

    if (downloadError || !drawingData) {
      throw new Error("Could not read the uploaded drawing from storage.");
    }

    const drawingBlob = new Blob([drawingData], { type: drawingData.type || "image/png" });

    const styles = resolveStyles(design.logo_styles as string[] | null);

    const results = await Promise.allSettled(
      styles.map((style) =>
        generateOne({
          openaiKey,
          drawingBlob,
          prompt: buildPrompt(design, style, styles),
        }).then(async (bytes) => {
          const path = `ai-mockups/${designId}/batch-${batch}-${style.key}.png`;

          const { error: uploadError } = await admin
            .storage
            .from(STORAGE_BUCKET)
            .upload(path, bytes, {
              contentType: "image/png",
              upsert: true,
            });

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = admin
            .storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(path);

          return { style, publicUrl };
        })
      ),
    );

    const succeeded = results.filter(
      (r): r is PromiseFulfilledResult<{ style: LogoStyle; publicUrl: string }> =>
        r.status === "fulfilled",
    );
    const failures = results
      .filter((r): r is PromiseRejectedResult => r.status === "rejected")
      .map((r) => String(r.reason?.message ?? r.reason));

    if (succeeded.length === 0) {
      throw new Error(failures[0] ?? "Image generation failed.");
    }

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
    return json({ error: message }, 500);
  }
});

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
    throw new Error(`OpenAI ${response.status}: ${detail.slice(0, 200)}`);
  }

  const payload = await response.json();
  const b64 = payload?.data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenAI returned no image.");

  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
