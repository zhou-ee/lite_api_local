import type { ProviderConfig } from "../lib/schema";

export type ImportResult = {
  providers: ProviderConfig[];
  aliases: Record<string, string>;
  notes: string[];
};

/**
 * Placeholder for ccswitch import.
 *
 * Next implementation should:
 * - detect ccswitch config path
 * - parse provider endpoint/key/model entries
 * - convert them into lite_api_server ProviderConfig and routes
 * - optionally rewrite local clients to point at lite_api_server
 */
export function importCcSwitchConfig(raw: unknown): ImportResult {
  return {
    providers: [],
    aliases: {},
    notes: ["ccswitch importer placeholder", JSON.stringify(raw).slice(0, 200)]
  };
}
