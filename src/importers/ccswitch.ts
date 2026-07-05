import type { AppConfig, ProviderConfig } from "../lib/schema";

export type ImportResult = {
  providers: ProviderConfig[];
  aliases: Record<string, string>;
  notes: string[];
};

type AnyRecord = Record<string, unknown>;

function isRecord(value: unknown): value is AnyRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => asString(item)).filter(Boolean) as string[];
  }
  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function normalizeProvider(candidate: AnyRecord, index: number): ProviderConfig | null {
  const id = asString(candidate.id) ?? asString(candidate.name) ?? asString(candidate.profile) ?? `imported-${index + 1}`;
  const baseUrl =
    asString(candidate.base_url) ??
    asString(candidate.baseURL) ??
    asString(candidate.baseUrl) ??
    asString(candidate.api_base) ??
    asString(candidate.apiBase) ??
    asString(candidate.endpoint) ??
    asString(candidate.url);

  if (!baseUrl) return null;

  const key =
    asString(candidate.api_key) ??
    asString(candidate.apiKey) ??
    asString(candidate.key) ??
    asString(candidate.token) ??
    "replace-with-provider-key";

  return {
    id,
    kind: "openai_compatible",
    base_url: baseUrl.replace(/\/$/, ""),
    api_key: key,
    enabled: true,
    priority: Number(candidate.priority ?? index + 1),
    weight: Number(candidate.weight ?? 10),
    timeout_ms: Number(candidate.timeout_ms ?? candidate.timeoutMs ?? 60000),
    models: asStringArray(candidate.models ?? candidate.model ?? candidate.available_models)
  };
}

function collectCandidateArrays(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (!isRecord(raw)) return [];

  const arrays = [
    raw.providers,
    raw.endpoints,
    raw.profiles,
    raw.accounts,
    raw.channels,
    raw.routes,
    raw.configs
  ].filter(Array.isArray) as unknown[][];

  return arrays.flat();
}

function collectAliases(raw: unknown): Record<string, string> {
  if (!isRecord(raw)) return {};
  const aliasesCandidate = raw.aliases ?? raw.model_aliases ?? raw.modelAliases;
  if (!isRecord(aliasesCandidate)) return {};

  return Object.fromEntries(
    Object.entries(aliasesCandidate)
      .map(([key, value]) => [key, asString(value)])
      .filter((entry): entry is [string, string] => Boolean(entry[1]))
  );
}

export function importCcSwitchConfig(raw: unknown): ImportResult {
  const candidates = collectCandidateArrays(raw);
  const providers = candidates
    .filter(isRecord)
    .map(normalizeProvider)
    .filter(Boolean) as ProviderConfig[];

  const aliases = collectAliases(raw);

  const notes = [
    `Scanned ${candidates.length} candidate entries.`,
    `Imported ${providers.length} OpenAI-compatible provider candidates.`,
    Object.keys(aliases).length ? `Imported ${Object.keys(aliases).length} aliases.` : "No aliases found."
  ];

  if (providers.length === 0) {
    notes.push("No provider candidates found. Expected providers/endpoints/profiles/accounts/channels array fields.");
  }

  return { providers, aliases, notes };
}

export function mergeImportIntoConfig(config: AppConfig, result: ImportResult): AppConfig {
  const providerMap = new Map(config.providers.map((provider) => [provider.id, provider]));
  for (const provider of result.providers) {
    providerMap.set(provider.id, provider);
  }

  return {
    ...config,
    providers: Array.from(providerMap.values()),
    aliases: {
      ...config.aliases,
      ...result.aliases
    }
  };
}
