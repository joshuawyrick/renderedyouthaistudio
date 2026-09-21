// MCP server for Rendered Youth.
//
// Implements the MCP Streamable HTTP transport (JSON-RPC 2.0 over POST).
// Deploy with:  supabase functions deploy mcp-server --project-ref REPLACE_WITH_TEST_PROJECT
//
// Auth: every request must carry `Authorization: Bearer <MCP_SERVER_TOKEN>`.
// The token is a project secret; it is NOT a user JWT. Because the tools below
// read across all creators, this endpoint is admin-grade — treat the token as
// an admin credential and never embed it in frontend code.

import { createClient } from "npm:@supabase/supabase-js@2";

const PROTOCOL_VERSION = "2024-11-05";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, mcp-session-id",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const jsonHeaders = {
  ...corsHeaders,
  "Content-Type": "application/json",
};

const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } },
);

// ---------------------------------------------------------------- tool schemas

const TOOLS = [
  {
    name: "list_artwork_submissions",
    description:
      "List artwork submissions (designs) with their review status and the creator who submitted them. Use to see what is waiting on review.",
    inputSchema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          description:
            "Filter by review status, e.g. pending_review, mockups_ready, published, consumed. Omit for all.",
        },
        limit: {
          type: "number",
          description: "Max rows to return. Defaults to 25, capped at 100.",
        },
      },
    },
  },
  {
    name: "get_artwork_submission",
    description:
      "Get full detail for one artwork submission by id, including creator profile and any products derived from it.",
    inputSchema: {
      type: "object",
      properties: {
        design_id: { type: "string", description: "UUID of the design." },
      },
      required: ["design_id"],
    },
  },
  {
    name: "list_products",
    description:
      "List store products with pricing, status, commission rate, and the design each one is based on.",
    inputSchema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          description: "Filter by product status, e.g. active or draft. Omit for all.",
        },
        collection_slug: {
          type: "string",
          description: "Restrict to one collection by slug, e.g. animals.",
        },
        limit: {
          type: "number",
          description: "Max rows to return. Defaults to 25, capped at 100.",
        },
      },
    },
  },
  {
    name: "list_collections",
    description:
      "List store collections with their slugs, active flag, and sort order. Useful for resolving public /collections/<slug> URLs.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_royalty_summary",
    description:
      "Summarize creator royalty earnings: gross, platform fee, creator share, and payout status. Optionally scope to one creator.",
    inputSchema: {
      type: "object",
      properties: {
        creator_user_id: {
          type: "string",
          description: "UUID of the creator. Omit for a platform-wide summary.",
        },
        payout_status: {
          type: "string",
          description: "Filter by payout status, e.g. pending or paid.",
        },
      },
    },
  },
  {
    name: "set_artwork_status",
    description:
      "Change the review status of an artwork submission. This mutates live data and affects what appears in the public store.",
    inputSchema: {
      type: "object",
      properties: {
        design_id: { type: "string", description: "UUID of the design." },
        status: {
          type: "string",
          description:
            "New status. One of: pending_review, mockups_ready, published, rejected, consumed.",
        },
      },
      required: ["design_id", "status"],
    },
  },
] as const;

const ALLOWED_STATUSES = [
  "pending_review",
  "mockups_ready",
  "published",
  "rejected",
  "consumed",
];

// ------------------------------------------------------------------ tool impls

function clampLimit(value: unknown): number {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 25;
  return Math.max(1, Math.min(100, Math.trunc(n)));
}

function requireUuid(value: unknown, field: string): string {
  if (typeof value !== "string" || !/^[0-9a-f-]{36}$/i.test(value)) {
    throw new Error(`${field} must be a UUID`);
  }
  return value;
}

async function attachProfiles<T extends { user_id?: string | null }>(rows: T[]) {
  const ids = [...new Set(rows.map((r) => r.user_id).filter(Boolean))] as string[];
  if (!ids.length) return rows.map((r) => ({ ...r, creator: null }));

  const { data } = await admin
    .from("profiles")
    .select("id, first_name, last_name, username, age_bracket")
    .in("id", ids);

  const byId = new Map((data ?? []).map((p) => [p.id, p]));
  return rows.map((r) => ({
    ...r,
    creator: r.user_id ? byId.get(r.user_id) ?? null : null,
  }));
}

async function listArtworkSubmissions(args: Record<string, unknown>) {
  let query = admin
    .from("designs")
    .select("id, title, status, file_url, inspiration, user_id, collection_id, created_at")
    .order("created_at", { ascending: false })
    .limit(clampLimit(args.limit));

  if (typeof args.status === "string" && args.status) {
    query = query.eq("status", args.status);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return { count: data?.length ?? 0, submissions: await attachProfiles(data ?? []) };
}

async function getArtworkSubmission(args: Record<string, unknown>) {
  const designId = requireUuid(args.design_id, "design_id");

  const { data: design, error } = await admin
    .from("designs")
    .select("*")
    .eq("id", designId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!design) throw new Error(`No design found with id ${designId}`);

  const [{ data: products }, { data: mockups }] = await Promise.all([
    admin.from("products").select("id, title, status, price").eq("design_id", designId),
    admin.from("design_mockups").select("id").eq("design_id", designId),
  ]);

  const [withCreator] = await attachProfiles([design]);
  return {
    ...withCreator,
    products: products ?? [],
    mockup_count: mockups?.length ?? 0,
  };
}

async function listProducts(args: Record<string, unknown>) {
  let collectionId: string | undefined;
  if (typeof args.collection_slug === "string" && args.collection_slug) {
    const { data } = await admin
      .from("collections")
      .select("id")
      .eq("slug", args.collection_slug)
      .maybeSingle();
    if (!data) throw new Error(`No collection with slug "${args.collection_slug}"`);
    collectionId = data.id;
  }

  let query = admin
    .from("products")
    .select(
      "id, title, description, status, price, base_price, creator_commission_rate, collection_id, design_id, created_at, designs(title, file_url, status)",
    )
    .order("created_at", { ascending: false })
    .limit(clampLimit(args.limit));

  if (typeof args.status === "string" && args.status) query = query.eq("status", args.status);
  if (collectionId) query = query.eq("collection_id", collectionId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return { count: data?.length ?? 0, products: data ?? [] };
}

async function listCollections() {
  const { data, error } = await admin
    .from("collections")
    .select("id, name, slug, description, is_active, sort_order")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return {
    count: data?.length ?? 0,
    collections: (data ?? []).map((c) => ({ ...c, public_url: `/collections/${c.slug}` })),
  };
}

async function getRoyaltySummary(args: Record<string, unknown>) {
  let query = admin
    .from("creator_earnings")
    .select("creator_user_id, gross_amount, platform_fee, creator_share, payout_status");

  if (args.creator_user_id !== undefined) {
    query = query.eq("creator_user_id", requireUuid(args.creator_user_id, "creator_user_id"));
  }
  if (typeof args.payout_status === "string" && args.payout_status) {
    query = query.eq("payout_status", args.payout_status);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const rows = data ?? [];
  const sum = (key: "gross_amount" | "platform_fee" | "creator_share") =>
    Number(rows.reduce((acc, r) => acc + Number(r[key] ?? 0), 0).toFixed(2));

  const byStatus: Record<string, number> = {};
  for (const r of rows) {
    const key = r.payout_status ?? "unknown";
    byStatus[key] = (byStatus[key] ?? 0) + 1;
  }

  return {
    entry_count: rows.length,
    distinct_creators: new Set(rows.map((r) => r.creator_user_id)).size,
    gross_amount: sum("gross_amount"),
    platform_fee: sum("platform_fee"),
    creator_share: sum("creator_share"),
    entries_by_payout_status: byStatus,
  };
}

async function setArtworkStatus(args: Record<string, unknown>) {
  const designId = requireUuid(args.design_id, "design_id");
  const status = args.status;

  if (typeof status !== "string" || !ALLOWED_STATUSES.includes(status)) {
    throw new Error(`status must be one of: ${ALLOWED_STATUSES.join(", ")}`);
  }

  const { data, error } = await admin
    .from("designs")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", designId)
    .select("id, title, status, updated_at")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error(`No design found with id ${designId}`);
  return { updated: data };
}

const HANDLERS: Record<string, (args: Record<string, unknown>) => Promise<unknown>> = {
  list_artwork_submissions: listArtworkSubmissions,
  get_artwork_submission: getArtworkSubmission,
  list_products: listProducts,
  list_collections: listCollections,
  get_royalty_summary: getRoyaltySummary,
  set_artwork_status: setArtworkStatus,
};

// ------------------------------------------------------------------- JSON-RPC

function rpcResult(id: unknown, result: unknown) {
  return { jsonrpc: "2.0", id, result };
}

function rpcError(id: unknown, code: number, message: string) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

async function handleRpc(message: Record<string, unknown>) {
  const { method, id, params } = message as {
    method?: string;
    id?: unknown;
    params?: Record<string, unknown>;
  };

  switch (method) {
    case "initialize":
      return rpcResult(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: { name: "rendered-youth", version: "1.0.0" },
      });

    case "ping":
      return rpcResult(id, {});

    case "tools/list":
      return rpcResult(id, { tools: TOOLS });

    case "tools/call": {
      const name = params?.name as string | undefined;
      const handler = name ? HANDLERS[name] : undefined;
      if (!handler) return rpcError(id, -32602, `Unknown tool: ${name}`);

      try {
        const output = await handler((params?.arguments as Record<string, unknown>) ?? {});
        return rpcResult(id, {
          content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
        });
      } catch (err) {
        // Tool failures are reported in-band so the model can recover.
        return rpcResult(id, {
          content: [
            { type: "text", text: err instanceof Error ? err.message : "Tool execution failed" },
          ],
          isError: true,
        });
      }
    }

    default:
      // Notifications have no id and expect no response.
      if (id === undefined) return null;
      return rpcError(id, -32601, `Method not found: ${method}`);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Use POST for MCP requests" }), {
      status: 405,
      headers: jsonHeaders,
    });
  }

  const expected = Deno.env.get("MCP_SERVER_TOKEN");
  if (!expected) {
    return new Response(JSON.stringify({ error: "Server is missing MCP_SERVER_TOKEN" }), {
      status: 500,
      headers: jsonHeaders,
    });
  }

  const auth = req.headers.get("Authorization") ?? "";
  if (auth !== `Bearer ${expected}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: jsonHeaders,
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify(rpcError(null, -32700, "Parse error")), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  // A client may send a single message or a batch.
  if (Array.isArray(body)) {
    const responses = (
      await Promise.all(body.map((m) => handleRpc(m as Record<string, unknown>)))
    ).filter((r) => r !== null);
    return new Response(responses.length ? JSON.stringify(responses) : "", {
      status: responses.length ? 200 : 202,
      headers: jsonHeaders,
    });
  }

  const response = await handleRpc((body ?? {}) as Record<string, unknown>);
  if (response === null) {
    return new Response("", { status: 202, headers: corsHeaders });
  }

  return new Response(JSON.stringify(response), { status: 200, headers: jsonHeaders });
});