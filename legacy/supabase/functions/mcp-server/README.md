# Rendered Youth MCP server

An MCP (Model Context Protocol) endpoint that lets AI clients such as Claude
Desktop, Cursor, or ChatGPT read and act on Rendered Youth data.

Why you deploy this manually: this project uses an external Supabase project
rather than Lovable Cloud. Lovable cannot deploy edge functions into a Supabase
instance it does not manage, so `supabase functions deploy` has to be run by
you. The code lives in the repo and is version-controlled as normal.

## Tools exposed

- `list_artwork_submissions` — browse designs by review status
- `get_artwork_submission` — full detail for one design, plus derived products
- `list_products` — store products, filterable by status or collection slug
- `list_collections` — collections with their public `/collections/<slug>` URLs
- `get_royalty_summary` — aggregated gross, platform fee, and creator share
- `set_artwork_status` — MUTATES DATA; changes a design's review status

## Deploying

You need the Supabase CLI (https://supabase.com/docs/guides/cli) and access to
project `REPLACE_WITH_TEST_PROJECT`.

```bash
supabase login
supabase link --project-ref REPLACE_WITH_TEST_PROJECT
supabase functions deploy mcp-server
```

The function reads three secrets. `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` are injected by Supabase automatically.
`MCP_SERVER_TOKEN` was generated for you and is already stored in Lovable, but
it must also exist in your own Supabase project:

```bash
supabase secrets set MCP_SERVER_TOKEN=<the value from Lovable project settings>
```

Copy the value from Lovable under Settings then Secrets, or set a different one
here. The function only compares against whatever is in your Supabase project.

## Endpoint

```
https://REPLACE_WITH_TEST_PROJECT.supabase.co/functions/v1/mcp-server
```

## Connecting a client

Any MCP client that supports Streamable HTTP with a bearer token works. Example
`claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "rendered-youth": {
      "url": "https://REPLACE_WITH_TEST_PROJECT.supabase.co/functions/v1/mcp-server",
      "headers": {
        "Authorization": "Bearer <MCP_SERVER_TOKEN>"
      }
    }
  }
}
```

For clients that only speak stdio, put `mcp-remote` in front:

```json
{
  "mcpServers": {
    "rendered-youth": {
      "command": "npx",
      "args": [
        "-y", "mcp-remote",
        "https://REPLACE_WITH_TEST_PROJECT.supabase.co/functions/v1/mcp-server",
        "--header", "Authorization: Bearer <MCP_SERVER_TOKEN>"
      ]
    }
  }
}
```

## Verifying after deploy

```bash
curl -s -X POST https://REPLACE_WITH_TEST_PROJECT.supabase.co/functions/v1/mcp-server \
  -H "Authorization: Bearer $MCP_SERVER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

You should get a JSON-RPC result listing six tools. Then try a real query:

```bash
curl -s -X POST https://REPLACE_WITH_TEST_PROJECT.supabase.co/functions/v1/mcp-server \
  -H "Authorization: Bearer $MCP_SERVER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"list_collections","arguments":{}}}'
```

## Security notes

- `MCP_SERVER_TOKEN` is an admin credential. The tools query across all
  creators using the service role key, bypassing RLS. Anyone holding the token
  can read every submission and royalty figure, and can change design statuses.
  Never put it in frontend code or commit it.
- The endpoint runs with `verify_jwt = false` because MCP clients send the
  static bearer token rather than a Supabase user JWT. Authorization is enforced
  in code by comparing against `MCP_SERVER_TOKEN`.
- To revoke access, rotate the secret and redeploy:
  `supabase secrets set MCP_SERVER_TOKEN=<new value>`.
- `set_artwork_status` is the only write tool. For a read-only server, delete it
  from both the `TOOLS` array and the `HANDLERS` map in `index.ts`.

## Logs

https://supabase.com/dashboard/project/REPLACE_WITH_TEST_PROJECT/functions/mcp-server/logs