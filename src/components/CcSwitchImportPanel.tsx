import { useState } from "react";
import { importCcSwitchConfig, mergeImportIntoConfig } from "../importers/ccswitch";
import type { AppConfig } from "../lib/schema";

type Props = {
  config: AppConfig | null;
  onSave: (config: AppConfig) => Promise<void>;
};

export function CcSwitchImportPanel({ config, onSave }: Props) {
  const [rawText, setRawText] = useState("");
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
      const result = importCcSwitchConfig(raw);
      const merged = mergeImportIntoConfig(config, result);
      setNotes(result.notes);
      await onSave(merged);
      setMessage(`Imported ${result.providers.length} provider candidates.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    }
  }

  return (
    <section className="card">
      <h2>ccswitch / Client Config Import</h2>
      <p className="hint">粘贴 ccswitch 或其他客户端导出的 JSON。当前支持 best-effort 解析 providers/endpoints/profiles/accounts/channels 数组。</p>
      <textarea value={rawText} onChange={(e) => setRawText(e.target.value)} placeholder='{"providers":[{"name":"my-api","base_url":"https://example.com/v1","api_key":"...","models":["gpt-4o"]}]}' />
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
