import { useState } from "react";
import { importCcSwitchConfig, mergeImportIntoConfig } from "../importers/ccswitch";
import {
  importClaudeCodeLike,
  importCodexLike,
  importGeminiCliLike,
  importOpenCodeLike,
  mergeImportResults
} from "../importers/clientConfigs";
import type { AppConfig } from "../lib/schema";

type Props = {
  config: AppConfig | null;
  onSave: (config: AppConfig) => Promise<void>;
};

type ImportMode = "ccswitch" | "claude-code" | "codex" | "opencode" | "gemini-cli" | "auto";

export function CcSwitchImportPanel({ config, onSave }: Props) {
  const [rawText, setRawText] = useState("");
  const [mode, setMode] = useState<ImportMode>("auto");
  const [notes, setNotes] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  async function importConfig() {
    setMessage(null);
    setNotes([]);

    if (!config) {
      setMessage("Load server config first.");
      return;
    }

    try {
      const raw = JSON.parse(rawText);
      const results = mode === "auto"
        ? [
            importCcSwitchConfig(raw),
            importClaudeCodeLike(raw),
            importCodexLike(raw),
            importOpenCodeLike(raw),
            importGeminiCliLike(raw)
          ]
        : [
            mode === "ccswitch" ? importCcSwitchConfig(raw) :
            mode === "claude-code" ? importClaudeCodeLike(raw) :
            mode === "codex" ? importCodexLike(raw) :
            mode === "opencode" ? importOpenCodeLike(raw) :
            importGeminiCliLike(raw)
          ];

      const merged = mode === "ccswitch" && results.length === 1
        ? mergeImportIntoConfig(config, results[0])
        : mergeImportResults(config, results);

      setNotes(results.flatMap((result) => result.notes));
      await onSave(merged);
      const providerCount = results.reduce((sum, result) => sum + result.providers.length, 0);
      setMessage(`Imported ${providerCount} provider candidate(s).`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    }
  }

  return (
    <section className="card">
      <h2>ccswitch / Client Config Import</h2>
      <p className="hint">粘贴 ccswitch、Claude Code、Codex、OpenCode 或 Gemini CLI 风格 JSON。Auto 会同时尝试多个解析器。</p>

      <label>Import mode</label>
      <select value={mode} onChange={(event) => setMode(event.target.value as ImportMode)}>
        <option value="auto">auto</option>
        <option value="ccswitch">ccswitch/general</option>
        <option value="claude-code">Claude Code-like</option>
        <option value="codex">Codex-like</option>
        <option value="opencode">OpenCode-like</option>
        <option value="gemini-cli">Gemini CLI-like</option>
      </select>

      <textarea value={rawText} onChange={(e) => setRawText(e.target.value)} placeholder='{"providers":[{"name":"my-api","base_url":"https://example.com/v1","models":["gpt-4o"]}]}' />
      <div className="row-actions top-gap">
        <button onClick={importConfig} disabled={!rawText.trim() || !config}>Import into server config</button>
      </div>
      {message && <p className="notice">{message}</p>}
      {notes.length > 0 && (
        <ul className="hint">
          {notes.map((note) => <li key={note}>{note}</li>)}
        </ul>
      )}
    </section>
  );
}
