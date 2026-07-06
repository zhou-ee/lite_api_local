const BASE = import.meta.env.VITE_GATEWAY_ADMIN_URL ?? "http://127.0.0.1:8080";
const TOKEN = import.meta.env.VITE_GATEWAY_ADMIN_TOKEN ?? "change-me-admin-token";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${TOKEN}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

export const googleAccount = {
  start: (providerId: string, redirectUri?: string) => {
    const params = new URLSearchParams({ provider_id: providerId });
    if (redirectUri) params.set("redirect_uri", redirectUri);
    return request<{ url: string }>(`/admin/google/start?${params.toString()}`);
  },
  exchange: (code: string, providerId: string, redirectUri?: string) => request<{ ok: boolean; provider_id: string; oauth_email?: string | null }>("/admin/google/exchange", {
    method: "POST",
    body: JSON.stringify({ code, provider_id: providerId, redirect_uri: redirectUri })
  })
};
