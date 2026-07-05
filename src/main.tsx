import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { LogTable } from "./components/LogTable";
import { ProviderTable } from "./components/ProviderTable";
import { RouteTable } from "./components/RouteTable";
import { StatusCards } from "./components/StatusCards";
import { gatewayApi } from "./lib/gatewayApi";
import type { ProviderConfig, RequestLog, RouteConfig } from "./lib/schema";
import "./style.css";

function App() {
  const [health, setHealth] = useState<unknown>(null);
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [providers, setProviders] = useState<ProviderConfig[]>([]);
  const [routes, setRoutes] = useState<Record<string, RouteConfig>>({});
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const [healthResult, statsResult, providersResult, routesResult, logsResult] = await Promise.all([
        gatewayApi.health(),
        gatewayApi.statsToday(),
        gatewayApi.providers(),
        gatewayApi.routes(),
        gatewayApi.logs(50)
      ]);

      setHealth(healthResult);
      setStats(statsResult);
      setProviders(providersResult.data ?? []);
      setRoutes(routesResult.data ?? {});
      setLogs(logsResult.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
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
      <ProviderTable providers={providers} />
      <RouteTable routes={routes} />
      <LogTable logs={logs} />

      <section className="card muted">
        <h2>Next modules</h2>
        <ul>
          <li>Provider editor form</li>
          <li>Route editor</li>
          <li>ccswitch / Claude Code / Codex / OpenCode importers</li>
          <li>WebSocket realtime request stream</li>
          <li>Tauri desktop packaging</li>
        </ul>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
