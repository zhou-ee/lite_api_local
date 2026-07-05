# Local UI Smoke Test

Use this checklist after starting `lite_api_local`.

## 1. Start server first

`lite_api_local` reads server Admin API. Start `lite_api_server` before opening the UI.

## 2. Configure env

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open the Vite URL in your browser.

## 3. Dashboard load

Expected panels:

- Gateway Status
- Today Usage
- Config Diagnostics
- Provider Stats
- Model Stats
- Provider Editor
- Alias Editor
- Route Editor
- Route Preview
- Import panel
- Config JSON editor
- Logs

## 4. Diagnostics

After loading the page, check Config Diagnostics first. Fix errors before sending requests.

## 5. Provider healthcheck

Use Provider Editor -> Check. A healthy OpenAI-compatible provider should return a success status and latency.

## 6. Route preview

Enter a model alias such as `fast` in Route Preview. Confirm:

- requested model
- resolved upstream model
- selected strategy
- provider order

## 7. Import test

Paste a small JSON object into the import panel:

```json
{
  "providers": [
    {
      "name": "example-provider",
      "base_url": "https://example.com/v1",
      "models": ["example-model"]
    }
  ],
  "aliases": {
    "example": "example-model"
  }
}
```

Import it, then confirm provider and alias appear in the dashboard.

## 8. Close UI test

Close the local UI, send one request to `lite_api_server`, reopen UI and confirm logs were recorded by the server.
