import { useMemo, useState } from "react";
import type { AppConfig, ProviderStats } from "../lib/schema";

type Props = {
  config: AppConfig | null;
  providerStats: ProviderStats[];
};

function priceScore(provider: unknown, model: string, fallback?: { input_per_1m: number; output_per_1m: number }) {
  const maybeProvider = provider as { pricing?: Record<string, { input_per_1m: number; output_per_1m: number }> } | undefined;
  const providerPrice = maybeProvider?.pricing?.[model];
  const price = providerPrice ?? fallback;
  return price ? price.input_per_1m + price.output_per_1m : Number.MAX_SAFE_INTEGER;
}

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
    const fallbackPrice = config.pricing?.[upstream];

    const providerOrder = route.providers
      .filter((id) => providerMap.get(id)?.enabled)
      .sort((a, b) => {
        const providerA = providerMap.get(a);
        const providerB = providerMap.get(b);

        if (route.strategy === "weighted" || route.strategy === "weighted_random") {
          return (providerB?.weight ?? 0) - (providerA?.weight ?? 0);
        }

        if (route.strategy === "lowest_latency") {
          const latencyA = latencyMap.get(a) ?? Number.MAX_SAFE_INTEGER;
          const latencyB = latencyMap.get(b) ?? Number.MAX_SAFE_INTEGER;
          if (latencyA !== latencyB) return latencyA - latencyB;
        }

        if (route.strategy === "cheapest") {
          const scoreA = priceScore(providerA, upstream, fallbackPrice);
          const scoreB = priceScore(providerB, upstream, fallbackPrice);
          if (scoreA !== scoreB) return scoreA - scoreB;
        }

        return (providerA?.priority ?? 999999) - (providerB?.priority ?? 999999);
      });

    return {
      ok: providerOrder.length > 0,
      requested,
      upstream,
      strategy: route.strategy,
      providerOrder,
      latencies: Object.fromEntries(providerOrder.map((id) => [id, latencyMap.get(id) ?? null])),
      note: route.strategy === "round_robin" ? "Server rotates provider order per request. Local preview shows priority base order." : undefined
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
