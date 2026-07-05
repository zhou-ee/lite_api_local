import type { AppConfig, ProviderConfig } from "../lib/schema";
import type { ImportResult } from "./ccswitch";

type AnyRecord = Record<string, unknown>;

function isRecord(value: unknown): value is AnyRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function textList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(text).filter(Boolean) as string[];
  if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
}

function providerFromRecord(record: AnyRecord, fallbackId: string): ProviderConfig | null {
  const baseUrl =
    text(record.base_url) ??
    text(record.baseURL) ??
    text(record.baseUrl) ??
    text(record.endpoint) ??
    text(record.url) ??
    text(record.server);

  if (!baseUrl) return null;

  return {
    id: text(record.id) ?? text(record.name) ?? fallbackId,
    kind: "openai_compatible",
    base_url: baseUrl.replace(/\/$/, ""),
    api_key: text(record.api_key) ?? text(record.apiKey) ?? text(record.key) ?? text(record.token) ?? "__REPLACE_ME__",
    enabled: true,
    priority: Number(record.priority ?? 1),
    weight: Number(record.weight ?? 10),
    timeout_ms: Number(record.timeout_ms ?? record.timeoutMs ?? 60000),
    models: textList(record.models ?? record.model ?? record.available_models)
  };
}

function result(name: string, providers: ProviderConfig[], aliases: Record<string, string> = {}): ImportResult {
  return {
    providers,
    aliases,
    notes: [
      `${name}: imported ${providers.length} provider candidate(s).`,
      Object.keys(aliases).length ? `${name}: imported ${Object.keys(aliases).length} alias candidate(s).` : `${name}: no aliases found.`
    ]
  };
}

export function importClaudeCodeLike(raw: unknown): ImportResult {
  if (!isRecord(raw)) return result("Claude Code", []);

  const candidates = [
    raw.env,
    raw.provider,
    raw.api,
    raw.openai,
    raw.anthropic,
    raw
  ].filter(isRecord);

  const providers = candidates
    .map((candidate, index) => providerFromRecord(candidate, `claude-code-${index + 1}`))
    .filter(Boolean) as ProviderConfig[];

  const model = text(raw.model) ?? text(raw.default_model) ?? text(raw.defaultModel);
  const aliases = model ? { claude: model } : {};
  return result("Claude Code", providers, aliases);
}

export function importCodexLike(raw: unknown): ImportResult {
  if (!isRecord(raw)) return result("Codex", []);

  const candidates = [raw.model_provider, raw.modelProvider, raw.provider, raw.openai, raw].filter(isRecord);
  const providers = candidates
    .map((candidate, index) => providerFromRecord(candidate, `codex-${index + 1}`))
    .filter(Boolean) as ProviderConfig[];

  const model = text(raw.model) ?? text(raw.default_model) ?? text(raw.defaultModel);
  const aliases = model ? { codex: model } : {};
  return result("Codex", providers, aliases);
}

export function importOpenCodeLike(raw: unknown): ImportResult {
  if (!isRecord(raw)) return result("OpenCode", []);

  const providerRoot = isRecord(raw.provider) ? raw.provider : raw.providers;
  const candidates = Array.isArray(providerRoot)
    ? providerRoot.filter(isRecord)
    : isRecord(providerRoot)
      ? Object.entries(providerRoot).map(([id, value]) => isRecord(value) ? { id, ...value } : null).filter(isRecord)
      : [raw].filter(isRecord);

  const providers = candidates
    .map((candidate, index) => providerFromRecord(candidate, `opencode-${index + 1}`))
    .filter(Boolean) as ProviderConfig[];

  const model = text(raw.model) ?? text(raw.default_model) ?? text(raw.defaultModel);
  const aliases = model ? { opencode: model } : {};
  return result("OpenCode", providers, aliases);
}

export function importGeminiCliLike(raw: unknown): ImportResult {
  if (!isRecord(raw)) return result("Gemini CLI", []);

  const candidates = [raw.provider, raw.api, raw.gemini, raw].filter(isRecord);
  const providers = candidates
    .map((candidate, index) => providerFromRecord(candidate, `gemini-cli-${index + 1}`))
    .filter(Boolean) as ProviderConfig[];

  const model = text(raw.model) ?? text(raw.default_model) ?? text(raw.defaultModel);
  const aliases = model ? { gemini: model } : {};
  return result("Gemini CLI", providers, aliases);
}

export function mergeImportResults(config: AppConfig, imports: ImportResult[]): AppConfig {
  const providerMap = new Map(config.providers.map((provider) => [provider.id, provider]));
  const aliases = { ...config.aliases };

  for (const importResult of imports) {
    for (const provider of importResult.providers) providerMap.set(provider.id, provider);
    Object.assign(aliases, importResult.aliases);
  }

  return {
    ...config,
    providers: Array.from(providerMap.values()),
    aliases
  };
}
