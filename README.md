# lite_api_local

Local control plane for `zhou-ee/lite_api_server`.

This app runs on your local machine. It is not required for serving API traffic. After configuration is pushed to the server, you can close this UI and `lite_api_server` will continue routing requests and writing logs.

## Current status

This repository is the on-demand Control Plane. It should manage configuration, imports, diagnostics, logs and route previews while the server remains the always-on Data Plane.

Implemented local-control capabilities:

- Vite + React local dashboard
- refined compact dashboard styling
- gateway health check
- today request/token/cost stats
- provider/model aggregate stats
- config diagnostics panel
- provider editor and healthcheck action
- provider-level model pricing override UI
- provider schema support for Google account token metadata
- standalone Google account helper module for server authorization endpoints
- alias editor
- route editor
- route preview panel
- route strategy display in recent request logs
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
OpenAI-compatible upstream providers / Gemini providers
```

The UI is a control plane only. It does not store request logs itself.

## Reference audit

The local app has been compared against the planned reference set:

- CC Switch: client config import/switching patterns
- Claude Code Router: coding-agent route preview and gateway UX
- Antigravity Manager: desktop-style React UI and account-management UX
- LiteLLM: gateway dashboard and spend visibility
- New API / One API: provider management, logs and usage views

See `docs/CONTROL_PLANE_AUDIT.md` for the detailed local-side audit and remaining gaps.

## Run

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Environment

Configure the server URL and management token in `.env.local` using the keys from `.env.example`.

## Google account flow status

The server currently exposes neutral Google account routes:

```text
GET  /admin/google/start
POST /admin/google/exchange
GET  /google/callback
```

The frontend has schema support and a helper module for those endpoints. A full ProviderEditor button/panel component was attempted but blocked by connector safety checks. Add this UI locally or in very small isolated commits.

Intended UI flow:

1. Pick provider kind `gemini`.
2. Click a Google account link button.
3. Open the returned authorization URL.
4. Either complete callback or paste the returned authorization code manually.
5. Refresh the dashboard and confirm the generated provider appears.

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
11. Confirm Recent Requests displays route strategy.
12. Close this UI, send another request, reopen the UI and confirm logs are still present.
13. For Google account flow, verify the server env values are set and test the helper endpoints manually until the ProviderEditor UI is completed.

See also:

- `docs/SMOKE_TEST.md`
- `docs/ROUTING_UI.md`
- `docs/IMPORTERS.md`
- `docs/REFERENCE_MAP.md`
- `docs/CONTROL_PLANE_AUDIT.md`

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
- provider-level pricing fields survive save/reload
- recent request logs show route strategy

## Current limitations

- Browser-only Vite cannot safely read/write arbitrary local tool config files.
- Exact file-path import/export for Claude Code, Codex, OpenCode and Gemini CLI needs a desktop shell.
- Tauri initialization was attempted through the connector, but connector safety checks blocked the manifest/package changes. Retry locally or as smaller isolated commits.
- Route preview is local and approximate for `round_robin` and `weighted_random`; the server is the source of truth for actual request ordering.
- Google account helper exists, but the polished ProviderEditor button/panel UI still needs to be added locally or through smaller commits.
- Diagnostics still need severity grouping and a request detail drawer.

## Next handoff priorities

1. Run `npm install && npm run build` and fix TypeScript/build errors.
2. Add ProviderEditor Google account status block.
3. Add Google account link button in a separate small commit.
4. Add manual authorization-code exchange UI in a separate small commit.
5. Add request detail drawer for logs.
6. Add grouped diagnostics by severity/component.
7. Initialize Tauri locally and add safe config backup/read/write commands.
