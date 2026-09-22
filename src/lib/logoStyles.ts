export interface LogoStyle {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export const LOGO_STYLES: LogoStyle[] = [
  {
    id: 'nineties-neon',
    name: '90s Neon Graphic',
    description: 'Hot pink, electric teal, and yellow with thick outlines. Arcade energy, no real glow.',
    prompt: '90s neon graphic t-shirt logo style. Bold flat color blocks in hot pink, electric teal, bright yellow, and black. Thick black or dark outlines around every shape and letter. High-contrast poster graphic, like a 1990s arcade cabinet or Nickelodeon-era merch print. Colors should look like bright screen-print inks, NOT light-up neon tubes, NOT bloom, NOT lens flare, NOT chrome. Solid fills only. Print-safe flat graphic.',
  },
  {
    id: 'synthwave',
    name: 'Synthwave / Outrun',
    description: 'Retro sunset bands and a simple grid. Flat 80s poster colors.',
    prompt: 'synthwave / outrun t-shirt logo style. Flat stacked sunset color bands in magenta, orange, and deep purple. Simple one-point perspective grid or horizon line as graphic shapes, not a 3D render. Bold geometric lettering. Limited palette, hard edges, poster illustration. No chrome reflections, no glowing bloom, no photoreal sunset, no metallic sheen. Screen-print friendly flat graphic.',
  },
  {
    id: 'seventies-psych',
    name: '70s Psychedelic',
    description: 'Groovy swirls, chunky type, mustard / avocado / burnt orange.',
    prompt: '1970s psychedelic t-shirt logo style. Groovy swirling organic shapes, warped chunky lettering, peace-era poster composition. Palette of harvest gold, burnt orange, avocado green, cream, and brown. Flat fills with thick contours, like a vintage concert poster or hippie iron-on. No photorealism, no neon glow, no 3D. Warm analog screen-print look.',
  },
  {
    id: 'vintage-distressed',
    name: 'Vintage Distressed Band Tee',
    description: 'Faded concert merch, cracked ink, muted limited colors.',
    prompt: 'vintage distressed band-tee logo style. Looks like a worn 1980s\u201390s concert shirt graphic. Faded screen-print ink, slight cracked-ink and misregistration texture, muted limited palette (cream, rust, dusty navy, black, olive). Softly aged, not dirty or unreadable. Flat printed graphic sitting on the shirt, not a photo of a shirt. No metallic foil, no photoreal fabric wrinkles as the main subject.',
  },
  {
    id: 'y2k',
    name: 'Y2K Graphic',
    description: 'Chunky bubble type, stars, pink / baby blue / lime. No chrome.',
    prompt: 'early-2000s Y2K graphic t-shirt logo style. Chunky bubble lettering, star and sparkle shapes drawn as flat icons, playful stickers and swooshes. Palette of hot pink, baby blue, lime, white, and black. Fun, glossy-looking only as flat color, NOT actual chrome, NOT holographic foil, NOT iridescent metal. Bold cartoon graphic print, high contrast, thick shapes.',
  },
  {
    id: 'memphis',
    name: '80s Memphis',
    description: 'Squiggles, triangles, dots, clashing primaries.',
    prompt: '1980s Memphis design t-shirt logo style. Playful postmodern geometry: squiggles, triangles, circles, dashes, and terrazzo-like dots. Clashing flat primaries \u2014 red, cobalt, yellow, black, white, maybe mint. No gradients, no shadows, no 3D. Looks like a Sottsass / 80s pattern poster turned into a logo mark. Clean hard-edge screen print.',
  },
  {
    id: 'grunge',
    name: '90s Grunge',
    description: 'Dirty texture, torn edges, forest green / maroon / black.',
    prompt: '1990s grunge alternative t-shirt logo style. Distressed, scuffed, slightly muddy texture. Torn-edge or xeroxed shapes. Palette of black, forest green, maroon, dirty cream, and gray. Feels like Nirvana-era merch or a photocopied flyer printed on a tee. Readable, bold, not a muddy smear. No neon, no gloss, no metal.',
  },
  {
    id: 'streetwear',
    name: 'Streetwear Wordmark',
    description: 'Huge bold type, 1\u20133 colors, high-contrast merch energy.',
    prompt: 'modern streetwear wordmark t-shirt logo style. Oversized heavy typography as the hero. Tight custom letterspacing, strong attitude, high contrast. Mostly black, white, and one accent color. Minimal extra illustration. Looks like a boxy graphic-tee print from a streetwear brand, not a corporate logo on a business card. Flat ink, no bevel, no chrome, no drop-shadow glow.',
  },
  {
    id: 'graffiti',
    name: 'Graffiti / Tag',
    description: 'Wildstyle letters and drip shapes. Drawn drips, not spray mist.',
    prompt: 'graffiti tag t-shirt logo style. Bold wildstyle or throw-up lettering with fat outlines and a few drip shapes drawn as solid graphic elements. High-contrast fill colors. Street-art energy but flattened for fabric printing. Do NOT use airbrush spray mist, haze, or photoreal brick walls. No photoreal paint sheen. Clean printable shapes with thick contours.',
  },
  {
    id: 'punk-zine',
    name: 'Punk Zine',
    description: 'Cut-and-paste collage, ransom type, photocopy grain.',
    prompt: '1970s\u201380s punk zine t-shirt logo style. Cut-and-paste collage, ransom-note mixed lettering, xerox / photocopy grain, high-contrast black plus one accent (red or yellow). Crooked baselines, torn paper edges as graphic shapes. Anarchic flyer energy. Flat print, not a photo of paper on a table. No metallic, no neon glow.',
  },
  {
    id: 'heavy-metal',
    name: 'Heavy Metal Badge',
    description: 'Spikes, banners, gothic type as solid emblem shapes.',
    prompt: 'heavy metal band badge t-shirt logo style. Circular or shield emblem, gothic / blackletter-inspired lettering, spikes, banners, flames drawn as flat graphic shapes. Dark limited palette: black, bone, blood red, dull gold as flat ochre (not shiny metal). Concert-merch crest. No photoreal chrome, no 3D bevel, no glowing fire.',
  },
  {
    id: 'collegiate-badge',
    name: 'Badge / Crest / Collegiate',
    description: 'Circle or shield, banners, varsity two-tone.',
    prompt: 'vintage collegiate badge / crest t-shirt logo style. Circle, shield, or athletic seal with an inner icon, arched type, and a banner ribbon. Two or three flat colors such as navy, cream, and burgundy. Varsity / prep / national-park patch energy. Clean emblem, centered, printable. No metallic gold foil, no embroidery thread texture unless implied as flat illustration.',
  },
  {
    id: 'pop-art',
    name: 'Comic / Pop Art',
    description: 'Bold outlines, halftone dots, primary colors.',
    prompt: 'comic book / pop art t-shirt logo style. Thick black outlines, Ben-Day or halftone dots for shading, flat primary fills of red, yellow, blue, plus black and white. Lichtenstein / vintage comic energy. Graphic and punchy. Halftone dots must be large enough to print. No photoreal faces, no airbrush, no metallic.',
  },
  {
    id: 'trad-tattoo',
    name: 'Traditional Tattoo',
    description: 'Sailor Jerry outlines, limited fills, flash-sheet look.',
    prompt: 'traditional American tattoo flash t-shirt logo style. Very thick black outlines, limited solid fills (red, yellow, green, black, cream), classic tattoo motifs if relevant (banners, roses, eagles, daggers) simplified into a logo. Sailor Jerry / flash-sheet look. High contrast, no gray wash realism, no watercolor bleed, no fine single-needle lines.',
  },
  {
    id: 'pixel-8bit',
    name: 'Pixel / 8-bit',
    description: 'Chunky arcade pixels, limited palette, large blocks.',
    prompt: '8-bit pixel art t-shirt logo style. Large chunky pixels, like a NES / Game Boy sprite scaled up for a shirt. Limited palette (8 colors or fewer). Blocky readable silhouette. Each pixel cluster big enough to print on fabric. No tiny 1-pixel noise, no photoreal, no CRT glow, no scanline bloom.',
  },
  {
    id: 'minimal-vector',
    name: 'Minimal Flat Vector',
    description: 'Simple geometry, 2\u20133 colors, lots of clarity.',
    prompt: 'minimalist flat vector t-shirt logo style. Simple geometric shapes, generous clarity, 2\u20133 solid colors only. Clean edges, balanced negative space, icon-like mark that still works as a tee graphic. No gradients, no shadows, no textures, no fine hairlines, no photorealism. Screen-print / DTG friendly.',
  },
  {
    id: 'hand-drawn',
    name: 'Hand-drawn Sketch',
    description: 'Bold ink doodle, imperfect but thick enough to print.',
    prompt: 'hand-drawn ink sketch t-shirt logo style. Imperfect human doodle energy with BOLD marker / brush strokes, not faint pencil. Slightly wobbly but readable lettering and icons. High-contrast black (plus one optional accent). Looks like a Sharpie drawing, not a light graphite sketch. No hairline scratches that would vanish on fabric.',
  },
  {
    id: 'japanese-graphic',
    name: 'Japanese Graphic',
    description: 'Ukiyo-e flats or thick anime outlines, limited colors.',
    prompt: 'Japanese graphic t-shirt logo style. Either ukiyo-e woodblock flat color planes or clean anime-style thick line art. Bold limited palette, strong silhouette, poster-like composition. Inspired by vintage Japanese matchbox / woodblock merch or modern anime logo tees. Flat prints only. No photoreal, no metallic gold leaf, no glow.',
  },
];

export const PRINT_CONSTRAINTS =
  'This is a print-ready T-shirt logo graphic for Printify/Printful DTG or DTF. Isolated centered artwork on a plain white or transparent background. Flat colors, thick shapes, high contrast, limited palette. Screen-print friendly. No photorealism, no photographic fabric mockup, no model wearing a shirt, no hangtag, no watermark. No metallic chrome, no foil, no holographic rainbow sheen, no glowing neon tubes, no lens flare, no soft airbrush mist, no fade-to-transparent gradients. No tiny unreadable text, no hairline strokes. Bold silhouette that stays clear when printed on cotton.';

const DEFAULT_STYLE =
  'Default style: clean bold flat graphic t-shirt logo, limited colors, thick shapes, high contrast.';

const styleMap = new Map(LOGO_STYLES.map((s) => [s.id, s]));

export function getStyleById(id: string): LogoStyle | undefined {
  return styleMap.get(id);
}

export function getStylesByIds(ids: string[]): LogoStyle[] {
  return ids.map((id) => styleMap.get(id)).filter((s): s is LogoStyle => !!s);
}

export function buildImagePrompt(opts: {
  userIdea: string;
  selectedStyleIds: string[];
  colors?: string;
}): string {
  const parts: string[] = [];

  parts.push(`A T-shirt logo design of: ${opts.userIdea}.`);

  const selected = getStylesByIds(opts.selectedStyleIds);

  if (selected.length === 0) {
    parts.push(DEFAULT_STYLE);
  } else if (selected.length === 1) {
    parts.push(`Style direction:\n${selected[0].prompt}`);
  } else {
    parts.push(`Style direction:\n${selected[0].prompt}`);
    for (let i = 1; i < selected.length; i++) {
      parts.push(`Also mix in:\n${selected[i].prompt}`);
    }
    parts.push(
      'Blend the selected styles into ONE cohesive logo, not a collage of separate marks. Let the first selected style lead; the others are supporting flavor.',
    );
  }

  parts.push(PRINT_CONSTRAINTS);

  if (opts.colors) {
    parts.push(`Preferred colors: ${opts.colors}.`);
  }

  return parts.join('\n\n');
}
