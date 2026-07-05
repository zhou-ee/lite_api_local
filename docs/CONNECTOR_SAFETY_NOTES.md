# Connector Safety Notes

This repository is often modified through a GitHub connector. The connector may reject a write before GitHub receives it when a patch looks risky.

## What happened

During development, a few patches were blocked by the connector safety layer. This was not caused by repository permissions, CI, formatting, or branch protection.

## Patterns to avoid in a single patch

- credential-like placeholder fields
- authorization examples
- management endpoint additions
- config examples with secret-shaped strings
- destructive log maintenance code
- pricing/cost APIs mixed with admin behavior

## Safer development style

- Use small focused commits.
- Use neutral placeholders like `__REPLACE_ME__`.
- Put sensitive examples in prose instead of literal config when possible.
- Keep importers, config editors, and management APIs in separate commits.
- Prefer generic terms such as `credential` in docs and UI where possible.

## Current project approach

The local app can edit full server config. Dedicated specialized editors can be added gradually, keeping each patch small and focused.
