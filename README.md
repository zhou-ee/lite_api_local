# lite_api_local

Local control plane for `zhou-ee/lite_api_server`.

This app runs on your local machine. It is not required for serving API traffic. After configuration is pushed to the server, you can close this UI and `lite_api_server` will continue routing requests and writing logs.

## Current progress

Implemented local-control capabilities:

- Vite + React local dashboard
- gateway health check
- today request/token/cost stats
- provider/model aggregate stats
- config diagnostics panel
- provider editor and healthcheck action
- alias editor
- route editor
- route preview panel
- full config JSON import/export editor
- ccswitch/general JSON importer
- Claude Code-like JSON importer
- Codex-like JSON importer
- OpenCode-like JSON importer
- Gemini CLI-like JSON importer
- import preview before saving
- automatic route creation from imported provider models
- recent request logs

## Runtime split

```text
Local UI
  ↓ Admin API
lite_api_server
  ↓ provider routing
OpenAI-compatible upstream providers
```

The UI is a control plane only. It does not store request logs itself.

## Run

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Environment

Configure the server URL and management token in `.env.local` using the keys from `.env.example`.

## Smoke test flow

1. Start `lite_api_server` first.
2. Start this UI with `npm run dev`.
3. Confirm Gateway Status loads.
4. Check Config Diagnostics and fix errors.
5. Check Provider Stats and Model Stats.
6. Use Provider Editor -> Check on at least one provider.
7. Use Route Editor to choose a strategy:
   - `priority_fallback`
   - `weighted`
   - `round_robin`
   - `weighted_random`
   - `lowest_latency`
   - `cheapest`
8. Use Route Preview to confirm expected provider order.
9. Import a sample JSON config and review the import preview before saving.
10. Send a request through the server and confirm Recent Requests updates.
11. Close this UI, send another request, reopen the UI and confirm logs are still present.

See also:

- `docs/SMOKE_TEST.md`
- `docs/ROUTING_UI.md`
- `docs/IMPORTERS.md`
- `docs/REFERENCE_MAP.md`

## Import behavior

Importers normalize common client-style JSON into the server config. When an imported provider declares models, the UI now creates route entries automatically:

- missing model route -> create `priority_fallback` route
- existing model route -> append provider when missing

The import panel shows a preview before saving:

- provider IDs
- aliases
- model route plan
- parser notes

## Development checklist

Before considering a UI change usable:

```bash
npm install
npm run build
```

Manual checks:

- diagnostics panel loads
- provider editor can save a provider
- alias editor can save an alias
- route editor can save all supported strategies
- route preview updates after route changes
- import preview appears before saving
- full config JSON editor can round-trip current config

## Current limitations

- Browser-only Vite cannot safely read/write arbitrary local tool config files.
- Exact file-path import/export for Claude Code, Codex, OpenCode and Gemini CLI needs a desktop shell.
- Tauri initialization was attempted through the connector, but connector safety checks blocked the manifest/package changes. This should be retried locally or as smaller isolated commits.
- Route preview is local and approximate for `round_robin` and `weighted_random`; the server is the source of truth for actual request ordering.
