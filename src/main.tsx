import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { LogTable } from "./components/LogTable";
import { ProviderEditor } from "./components/ProviderEditor";
import { ProviderTable } from "./components/ProviderTable";
import { RouteEditor } from "./components/RouteEditor";
import { RouteTable } from "./components/RouteTable";
import { StatsTables } from "./components/StatsTables";
import { StatusCards } from "./components/StatusCards";
import { gatewayApi } from "./lib/gatewayApi";
import type { ModelStats, ProviderConfig, ProviderStats, RequestLog, RouteConfig } from "./lib/schema";
import "./style.css";

function App() {
  const [health, setHealth] = useState<unknown>(null);
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [providerStats, setProviderStats] = useState<ProviderStats[]>([]);
  const [modelStats, setModelStats] = useState<ModelStats[]>([]);
  const [providers, setProviders] = useState<ProviderConfig[]>([]);
  const [routes, setRoutes] = useState<Record<string, RouteConfig>>({});
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const [healthResult, statsResult, providerStatsResult, modelStatsResult, providersResult, routesResult, logsResult] = await Promise.all([
        gatewayApi.health(),
        gatewayApi.statsToday(),
        gatewayApi.statsProviders(),
        gatewayApi.statsModels(),
        gatewayApi.providers(),
        gatewayApi.routes(),
        gatewayApi.logs(50)
      ]);

      setHealth(healthResult);
      setStats(statsResult);
      setProviderStats(providerStatsResult.data ?? []);
      setModelStats(modelStatsResult.data ?? []);
      setProviders(providersResult.data ?? []);
      setRoutes(routesResult.data ?? {});
      setLogs(logsResult.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function saveProvider(provider: ProviderConfig) {
    await gatewayApi.upsertProvider(provider);
    await refresh();
  }

  async function saveRoutes(nextRoutes: Record<string, RouteConfig>) {
    await gatewayApi.updateRoutes(nextRoutes);
    await refresh();
  }

  async function healthcheckProvider(id: string) {
    const result = await gatewayApi.healthcheckProvider(id);
    return result.ok
      ? `Provider ${id} OK · ${result.status ?? "unknown"} · ${result.latency_ms ?? "?"}ms`
      : `Provider ${id} failed · ${result.error ?? result.status ?? "unknown"}`;
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <main>
      <header className="hero">
        <div>
          <p className="eyebrow">lite_api_local</p>
          <h1>Lite API Control Plane</h1>
          <p>本地控制台：查看服务器状态、Provider、模型路由和请求日志。本地关闭不影响服务器继续转发和记录日志。</p>
        </div>
        <button onClick={refresh} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</button>
      </header>

      {error && <section className="error">{error}</section>}

      <StatusCards health={health} stats={stats} />
      <StatsTables providerStats={providerStats} modelStats={modelStats} />
      <ProviderEditor providers={providers} onSave={saveProvider} onHealthcheck={healthcheckProvider} />
      <RouteEditor providers={providers} routes={routes} onSave={saveRoutes} />
      <ProviderTable providers={providers} />
      <RouteTable routes={routes} />
      <LogTable logs={logs} />

      <section className="card muted">
        <h2>Next modules</h2>
        <ul>
          <li>ccswitch / Claude Code / Codex / OpenCode importers</li>
          <li>Alias editor</li>
          <li>WebSocket realtime request stream</li>
          <li>Tauri desktop packaging</li>
        </ul>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
