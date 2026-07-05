import { useEffect, useState } from "react";
import type { AppConfig } from "../lib/schema";

type Props = {
  config: AppConfig | null;
  onSave: (config: AppConfig) => Promise<void>;
};

export function ConfigJsonEditor({ config, onSave }: Props) {
  const [text, setText] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (config) {
      setText(JSON.stringify(config, null, 2));
    }
  }, [config]);

  async function save() {
    setMessage(null);
    try {
      const parsed = JSON.parse(text) as AppConfig;
      await onSave(parsed);
      setMessage("Config saved to server.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(text);
    setMessage("Config copied to clipboard.");
  }

  function download() {
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lite-api-config.json";
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Config exported.");
  }

  return (
    <section className="card">
      <h2>Config Import / Export</h2>
      <p className="hint">直接编辑完整 JSON 配置。适合从 ccswitch / Claude Code / Codex / OpenCode 导入器生成后统一写入服务器。</p>
      <textarea className="config-editor" value={text} onChange={(e) => setText(e.target.value)} />
      <div className="row-actions top-gap">
        <button onClick={save} disabled={!text.trim()}>Save full config</button>
        <button onClick={copy} disabled={!text.trim()}>Copy</button>
        <button onClick={download} disabled={!text.trim()}>Download JSON</button>
      </div>
      {message && <p className="notice">{message}</p>}
    </section>
  );
}
