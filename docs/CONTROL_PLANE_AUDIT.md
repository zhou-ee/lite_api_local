# Control Plane Audit

This audit compares `lite_api_local` against the planned local Control Plane.

## Target role

The local app is an on-demand management surface:

- provider editor
- alias editor
- route editor
- diagnostics viewer
- usage dashboard
- import preview
- request log viewer

The server remains the always-on Data Plane.

## Reference capability map

| Reference | Capability to learn from | Current status |
|---|---|---|
| CC Switch | client config import and switching | Best-effort JSON importers exist |
| Claude Code Router | route preview and coding-agent route UX | Route editor and preview exist |
| Antigravity Manager | compact desktop-style React UI | Styling was improved; desktop shell is pending |
| LiteLLM | gateway admin dashboard and spend visibility | Stats, provider tables and model pricing fields exist |
| New API / One API | provider management and usage logs | Provider editor, logs and stats exist |

## Current capabilities

- Dashboard loads gateway health, diagnostics, stats and logs.
- Provider editor supports basic settings and model price overrides.
- Schema includes provider account metadata fields.
- Route editor exposes all implemented strategies.
- Route preview uses loaded config and provider stats.
- Importers can create providers, aliases and model routes from common JSON shapes.
- Styling is denser and clearer than the initial scaffold.

## Remaining gaps

- Desktop shell is not complete.
- Exact local client config read/write is not complete.
- Provider editor still needs a small account-linking panel.
- Request logs should show route strategy.
- Diagnostics should be grouped by severity and component.
- Request details need a drawer or expanded row.

## Recommended next order

1. Run `npm run build`.
2. Add route strategy to `LogTable`.
3. Add a small provider account-status block.
4. Add account-linking controls in isolated commits.
5. Add desktop shell locally.
6. Add local config backup and restore before any rewrite.

## Manual checks

- Dashboard loads with server online.
- Provider editor can save providers.
- Provider-level pricing survives save and reload.
- Route editor saves all strategies.
- Route preview matches expected provider order.
- Import preview creates providers, aliases and model routes.
- Logs update after a server request.
- Closing the UI does not stop server-side logging.
