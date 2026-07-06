import { useState } from "react";
import type { ProviderConfig } from "../lib/schema";

const emptyProvider: ProviderConfig = {
  id: "",
  kind: "openai_compatible",
  base_url: "https://api.openai.com/v1",
  api_key: "",
  enabled: true,
  priority: 1,
  weight: 10,
  timeout_ms: 60000,
  models: []
};

type Props = {
  providers: ProviderConfig[];
  onSave: (provider: ProviderConfig) => Promise<void>;
  onHealthcheck: (id: string) => Promise<string>;
};

export function ProviderEditor({ providers, onSave, onHealthcheck }: Props) {
  const [draft, setDraft] = useState<ProviderConfig>(emptyProvider);
  const [message, setMessage] = useState<string | null>(null);

  function load(provider: ProviderConfig) {
    setDraft({ ...provider, api_key: provider.api_key });
    setMessage(null);
  }

  async function save() {
    setMessage(null);
    await onSave({
      ...draft,
      id: draft.id.trim(),
      base_url: draft.base_url.trim().replace(/\/$/, ""),
      models: draft.models.map((m) => m.trim()).filter(Boolean)
    });
    setMessage(`Saved provider: ${draft.id}`);
  }

  async function healthcheck(id: string) {
    setMessage(await onHealthcheck(id));
  }

  return (
    <section className="card">
      <h2>Provider Editor</h2>
      <div className="split">
        <div>
          <label>ID</label>
          <input value={draft.id} onChange={(e) => setDraft({ ...draft, id: e.target.value })} />

          <label>Kind</label>
          <select value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value as ProviderConfig["kind"] })}>
            <option value="openai_compatible">openai_compatible</option>
            <option value="anthropic">anthropic</option>
            <option value="gemini">gemini</option>
            <option value="open_code">open_code</option>
          </select>

          <label>Base URL</label>
          <input value={draft.base_url} onChange={(e) => setDraft({ ...draft, base_url: e.target.value })} />

          <label>API Key</label>
          <input type="password" value={draft.api_key} onChange={(e) => setDraft({ ...draft, api_key: e.target.value })} />

          <div className="inline">
            <label><input type="checkbox" checked={draft.enabled} onChange={(e) => setDraft({ ...draft, enabled: e.target.checked })} /> Enabled</label>
            <label>Priority <input type="number" value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: Number(e.target.value) })} /></label>
            <label>Weight <input type="number" value={draft.weight} onChange={(e) => setDraft({ ...draft, weight: Number(e.target.value) })} /></label>
          </div>

          <label>Timeout ms</label>
          <input type="number" value={draft.timeout_ms} onChange={(e) => setDraft({ ...draft, timeout_ms: Number(e.target.value) })} />

          <label>Models, comma separated</label>
          <textarea value={draft.models.join(", ")} onChange={(e) => setDraft({ ...draft, models: e.target.value.split(",") })} />

          {draft.models.map(m => m.trim()).filter(Boolean).length > 0 && (
            <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
              <label style={{ fontWeight: "bold" }}>Model Pricing Overrides per 1M tokens (Optional)</label>
              <table style={{ width: "100%", marginTop: "0.5rem" }}>
                <thead>
                  <tr style={{ fontSize: "0.85em", opacity: 0.8 }}>
                    <th style={{ textAlign: "left", paddingBottom: "4px" }}>Model</th>
                    <th style={{ textAlign: "left", paddingBottom: "4px" }}>Input / 1M ($)</th>
                    <th style={{ textAlign: "left", paddingBottom: "4px" }}>Output / 1M ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {draft.models.map(m => m.trim()).filter(Boolean).map((modelName) => {
                    const price = draft.pricing?.[modelName] ?? { input_per_1m: 0, output_per_1m: 0 };
                    return (
                      <tr key={modelName}>
                        <td style={{ padding: "4px 0" }}><code>{modelName}</code></td>
                        <td style={{ padding: "4px 4px 4px 0" }}>
                          <input
                            type="number"
                            step="0.000001"
                            style={{ margin: 0, padding: "4px", width: "100%" }}
                            value={price.input_per_1m || ""}
                            placeholder="0"
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setDraft({
                                ...draft,
                                pricing: {
                                  ...(draft.pricing ?? {}),
                                  [modelName]: {
                                    ...price,
                                    input_per_1m: val
                                  }
                                }
                              });
                            }}
                          />
                        </td>
                        <td style={{ padding: "4px 0" }}>
                          <input
                            type="number"
                            step="0.000001"
                            style={{ margin: 0, padding: "4px", width: "100%" }}
                            value={price.output_per_1m || ""}
                            placeholder="0"
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setDraft({
                                ...draft,
                                pricing: {
                                  ...(draft.pricing ?? {}),
                                  [modelName]: {
                                    ...price,
                                    output_per_1m: val
                                  }
                                }
                              });
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <button onClick={save} disabled={!draft.id || !draft.base_url}>Save Provider</button>
          {message && <p className="notice">{message}</p>}
        </div>

        <div>
          <h3>Existing Providers</h3>
          <div className="list">
            {providers.map((provider) => (
              <div className="list-item" key={provider.id}>
                <div>
                  <strong>{provider.id}</strong>
                  <small>{provider.kind} · {provider.enabled ? "enabled" : "disabled"}</small>
                </div>
                <div className="row-actions">
                  <button onClick={() => load(provider)}>Edit</button>
                  <button onClick={() => healthcheck(provider.id)}>Check</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
