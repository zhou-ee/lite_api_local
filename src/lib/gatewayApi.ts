import type { AppConfig, ProviderConfig, RequestLog, RouteConfig } from "./schema";

const BASE = import.meta.env.VITE_GATEWAY_ADMIN_URL ?? "http://127.0.0.1:8080";
const TOKEN = import.meta.env.VITE_GATEWAY_ADMIN_TOKEN ?? "change-me-admin-token";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${TOKEN}`);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

export const gatewayApi = {
  health: () => fetch(`${BASE}/healthz`).then((r) => r.json()),
  config: () => request<AppConfig>("/admin/config"),
  updateConfig: (config: AppConfig) => request<{ ok: boolean }>("/admin/config", {
    method: "PUT",
    body: JSON.stringify(config)
  }),
  providers: () => request<{ data: ProviderConfig[] }>("/admin/providers"),
  upsertProvider: (provider: ProviderConfig) => request<{ ok: boolean; provider_id: string }>("/admin/providers", {
    method: "POST",
    body: JSON.stringify(provider)
  }),
  routes: () => request<{ data: Record<string, RouteConfig> }>("/admin/routes"),
  updateRoutes: (routes: Record<string, RouteConfig>) => request<{ ok: boolean }>("/admin/routes", {
    method: "PUT",
    body: JSON.stringify(routes)
  }),
  logs: (limit = 100) => request<{ data: RequestLog[] }>(`/admin/logs?limit=${limit}`),
  statsToday: () => request<Record<string, unknown>>("/admin/stats/today")
};
