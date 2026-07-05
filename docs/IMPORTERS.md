# Importers

The local control plane supports best-effort JSON import for several client-style config shapes.

## Supported modes

- auto
- ccswitch/general
- Claude Code-like
- Codex-like
- OpenCode-like
- Gemini CLI-like

## What importers extract

Importers try to normalize common fields into the gateway schema:

- provider id or name
- base URL style endpoint fields
- model list
- priority, weight and timeout when present
- default model aliases when present

## Route creation

Imported providers are now used to create route entries automatically.

For every imported provider model:

- if the model has no route, a new `priority_fallback` route is created
- if the model already has a route, the provider is appended when missing

This makes imported providers usable immediately after import, subject to diagnostics and provider health checks.

## Preview before save

The import panel shows a preview before saving:

- provider IDs
- aliases
- model route plan
- parser notes

Use this preview before writing to the server config.

## Browser limitation

The current Vite app cannot safely read or write arbitrary local config files by itself. Exact file-path import and rewrite should be implemented in a desktop shell later.
