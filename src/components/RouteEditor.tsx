import { useState } from "react";
import type { ProviderConfig, RouteConfig } from "../lib/schema";

type Props = {
  providers: ProviderConfig[];
  routes: Record<string, RouteConfig>;
  onSave: (routes: Record<string, RouteConfig>) => Promise<void>;
};

export function RouteEditor({ providers, routes, onSave }: Props) {
  const [model, setModel] = useState("");
  const [strategy, setStrategy] = useState("priority_fallback");
  const [providerList, setProviderList] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function load(modelName: string, route: RouteConfig) {
    setModel(modelName);
    setStrategy(route.strategy);
    setProviderList(route.providers.join(", "));
    setMessage(null);
  }

  async function save() {
    const modelName = model.trim();
    if (!modelName) return;

    const nextRoutes = {
      ...routes,
      [modelName]: {
        strategy,
        providers: providerList.split(",").map((p) => p.trim()).filter(Boolean)
      }
    };

    await onSave(nextRoutes);
    setMessage(`Saved route: ${modelName}`);
  }

  return (
    <section className="card">
      <h2>Route Editor</h2>
      <div className="split">
        <div>
          <label>Model / upstream model</label>
          <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="gpt-5-mini" />

          <label>Strategy</label>
          <select value={strategy} onChange={(e) => setStrategy(e.target.value)}>
            <option value="priority_fallback">priority_fallback</option>
            <option value="weighted" disabled>weighted · later</option>
            <option value="lowest_latency" disabled>lowest_latency · later</option>
            <option value="cheapest" disabled>cheapest · later</option>
          </select>

          <label>Providers, comma separated</label>
          <textarea value={providerList} onChange={(e) => setProviderList(e.target.value)} placeholder="openai-main, backup" />

          <div className="hint">
            Available providers: {providers.map((p) => p.id).join(", ") || "none"}
          </div>

          <button onClick={save} disabled={!model.trim() || !providerList.trim()}>Save Route</button>
          {message && <p className="notice">{message}</p>}
        </div>

        <div>
          <h3>Existing Routes</h3>
          <div className="list">
            {Object.entries(routes).map(([name, route]) => (
              <div className="list-item" key={name}>
                <div>
                  <strong>{name}</strong>
                  <small>{route.strategy} · {route.providers.join(" → ")}</small>
                </div>
                <button onClick={() => load(name, route)}>Edit</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
