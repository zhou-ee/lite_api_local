import { useMemo, useState } from "react";
import type { AppConfig, ProviderStats } from "../lib/schema";

type Props = {
  config: AppConfig | null;
  providerStats: ProviderStats[];
};

export function RoutePreviewPanel({ config, providerStats }: Props) {
  const [model, setModel] = useState("");

  const preview = useMemo(() => {
    if (!config || !model.trim()) return null;

    const requested = model.trim();
    const upstream = config.aliases[requested] ?? requested;
    const route = config.routes[upstream];
    if (!route) {
      return { ok: false, error: `No route configured for ${requested} -> ${upstream}` };
    }

    const providerMap = new Map(config.providers.map((provider) => [provider.id, provider]));
    const latencyMap = new Map(providerStats.map((item) => [item.provider_id, item.avg_latency_ms]));
    const pricing = config.pricing?.[upstream];

    const providerOrder = route.providers
      .filter((id) => providerMap.get(id)?.enabled)
      .sort((a, b) => {
        const providerA = providerMap.get(a);
        const providerB = providerMap.get(b);

        if (route.strategy === "weighted") {
          return (providerB?.weight ?? 0) - (providerA?.weight ?? 0);
        }

        if (route.strategy === "lowest_latency") {
          const latencyA = latencyMap.get(a) ?? Number.MAX_SAFE_INTEGER;
          const latencyB = latencyMap.get(b) ?? Number.MAX_SAFE_INTEGER;
          if (latencyA !== latencyB) return latencyA - latencyB;
        }

        if (route.strategy === "cheapest" && pricing) {
          // Pricing is model-level today, so priority breaks ties until provider-level pricing exists.
          return (providerA?.priority ?? 999999) - (providerB?.priority ?? 999999);
        }

        return (providerA?.priority ?? 999999) - (providerB?.priority ?? 999999);
      });

    return {
      ok: providerOrder.length > 0,
      requested,
      upstream,
      strategy: route.strategy,
      providerOrder,
      latencies: Object.fromEntries(providerOrder.map((id) => [id, latencyMap.get(id) ?? null]))
    };
  }, [config, model, providerStats]);

  return (
    <section className="card">
      <h2>Route Preview</h2>
      <p className="hint">输入模型名，预览 alias 解析、路由策略和 provider 顺序。这个本地预览会用当前 dashboard 已加载的 provider stats。</p>
      <label>Model</label>
      <input value={model} onChange={(event) => setModel(event.target.value)} placeholder="fast" />
      <pre>{JSON.stringify(preview, null, 2)}</pre>
    </section>
  );
}
