export type ProviderKind = "openai_compatible" | "anthropic" | "gemini" | "open_code";

export type ProviderConfig = {
  id: string;
  kind: ProviderKind;
  base_url: string;
  api_key: string;
  enabled: boolean;
  priority: number;
  weight: number;
  timeout_ms: number;
  models: string[];
};

export type RouteConfig = {
  strategy: string;
  providers: string[];
};

export type AppConfig = {
  server: {
    bind: string;
    admin_token: string;
  };
  telemetry: {
    sqlite_path: string;
    save_bodies: boolean;
    retention_days: number;
  };
  providers: ProviderConfig[];
  aliases: Record<string, string>;
  routes: Record<string, RouteConfig>;
  clients: Record<string, {
    api_key: string;
    allowed_models: string[];
  }>;
};

export type RequestLog = {
  id: string;
  ts: number;
  client_name?: string | null;
  provider_id: string;
  requested_model: string;
  upstream_model: string;
  status_code: number;
  error_type?: string | null;
  latency_ms: number;
  input_tokens?: number | null;
  output_tokens?: number | null;
  total_tokens?: number | null;
  estimated_cost_usd?: number | null;
};
