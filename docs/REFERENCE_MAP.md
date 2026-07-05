# Reference Project Feature Map

`lite_api_local` is the local control plane for `lite_api_server`.

## CC Switch comparison

CC Switch is a useful reference because it manages Claude Code, Claude Desktop, Codex, Gemini CLI, OpenCode, OpenClaw and Hermes Agent style clients from a local desktop app.

Mapped here:

- local-only UI
- provider and route editing
- alias editing
- generic JSON import path for ccswitch-like exports
- full config import/export

Not yet implemented:

- exact file-path detection for each client
- safe rewrite of client config files
- Tauri desktop packaging

## LiteLLM comparison

LiteLLM's dashboard and gateway inspired the local view of provider/model stats, logs and config.

Mapped here:

- provider table
- route table
- daily usage cards
- provider/model aggregate stats
- cost display when the server emits estimated cost

Not yet implemented:

- realtime streaming dashboard
- team/user budget UI
- guardrail UI

## Design rule

This app should be safe to close. It does not collect logs itself. The server writes logs and this UI only reads or edits server-side config.
