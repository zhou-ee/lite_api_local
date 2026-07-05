# Routing UI

The local control panel supports editing and previewing route behavior without keeping the UI running on the server.

## Route editor

The route editor writes to the server-side route map. Supported strategies:

- `priority_fallback`
- `weighted`
- `lowest_latency`
- `cheapest`

## Alias editor

Aliases let clients use friendly model names such as `fast`, `smart` or `codex`, while the server maps them to upstream model names.

## Route preview

The route preview panel computes the expected provider order from the currently loaded server config and provider stats. It is useful after importing a config or changing route strategy.

The preview shows:

- requested model
- resolved upstream model
- selected strategy
- provider order
- known average latency values

## Diagnostics panel

The diagnostics panel calls the server diagnostics endpoint and reports route/provider/alias/client/pricing issues. Use it after every config import or manual JSON edit.
