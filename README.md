# lite_api_local

Local control plane for `zhou-ee/lite_api_server`.

This app runs on your local machine. It is not required for serving API traffic. After configuration is pushed to the server, you can close this UI and `lite_api_server` will continue routing requests and writing logs.

## Implemented MVP

- Vite + React local dashboard
- gateway health check
- today token/request stats
- provider pool table
- route table
- recent request logs
- typed Admin API client
- placeholder ccswitch importer module

## Architecture

```text
UI (local machine)
  ↓ REST/WebSocket later
lite_api_server (VPS)
  ↓
LLM Providers
```

## Run

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Env

```bash
VITE_GATEWAY_ADMIN_URL=http://127.0.0.1:8080
VITE_GATEWAY_ADMIN_TOKEN=change-me-admin-token
```

## Next steps

- provider editor form
- route editor form
- ccswitch / Claude Code / Codex / OpenCode config importers
- Tauri desktop wrapper
- WebSocket realtime request stream
