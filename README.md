# lite_api_local

Local control plane for lite_api_server.

This runs on the user's local machine and provides:

- config editor (providers / routing / models)
- ccswitch import/export
- Claude Code / Codex / OpenCode integration
- request logs viewer
- token/cost dashboard

## Architecture

```text
UI (local machine)
  ↓ REST/WebSocket
lite_api_server (VPS)
  ↓
LLM Providers
```

## Run

```bash
npm install
npm run dev
```

## Env

```
VITE_GATEWAY=http://127.0.0.1:8080
```
