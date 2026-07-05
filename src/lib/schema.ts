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

export type PricingConfig = {
  input_per_1m: number;
  output_per_1m: number;
};

export type ClientConfig = {
  api_key: string;
  allowed_models: string[];
  max_daily_requests?: number | null;
  max_daily_tokens?: number | null;
  max_daily_cost_usd?: number | null;
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
  clients: Record<string, ClientConfig>;
  pricing?: Record<string, PricingConfig>;
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

export type ProviderStats = {
  provider_id: string;
  request_count: number;
  success_count: number;
  error_count: number;
  total_tokens: number;
  estimated_cost_usd?: number;
  avg_latency_ms: number;
};

export type ModelStats = {
  requested_model: string;
  upstream_model: string;
  request_count: number;
  success_count: number;
  error_count: number;
  total_tokens: number;
  estimated_cost_usd?: number;
  avg_latency_ms: number;
};

export type HealthcheckResult = {
  ok: boolean;
  provider_id: string;
  status?: number;
  latency_ms?: number;
  error?: string;
};

export type DiagnosticLevel = "error" | "warning" | "info";

export type DiagnosticItem = {
  level: DiagnosticLevel;
  code: string;
  message: string;
};

export type DiagnosticReport = {
  ok: boolean;
  errors: number;
  warnings: number;
  items: DiagnosticItem[];
};

export type RoutePreview = {
  ok: boolean;
  requested_model: string;
  upstream_model?: string;
  provider_order?: string[];
  latency_snapshot_ms?: Record<string, number>;
  error?: string;
};
