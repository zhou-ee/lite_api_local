import { useState } from "react";

type Props = {
  aliases: Record<string, string>;
  onSave: (aliases: Record<string, string>) => Promise<void>;
};

export function AliasEditor({ aliases, onSave }: Props) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function load(alias: string, upstream: string) {
    setName(alias);
    setTarget(upstream);
    setMessage(null);
  }

  async function save() {
    const alias = name.trim();
    const upstream = target.trim();
    if (!alias || !upstream) return;

    await onSave({ ...aliases, [alias]: upstream });
    setMessage(`Saved alias: ${alias} → ${upstream}`);
  }

  async function remove(alias: string) {
    const next = { ...aliases };
    delete next[alias];
    await onSave(next);
    setMessage(`Removed alias: ${alias}`);
  }

  return (
    <section className="card">
      <h2>Alias Editor</h2>
      <div className="split">
        <div>
          <label>Alias</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="fast" />

          <label>Target upstream model</label>
          <input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="gpt-5-mini" />

          <button onClick={save} disabled={!name.trim() || !target.trim()}>Save Alias</button>
          {message && <p className="notice">{message}</p>}
        </div>

        <div>
          <h3>Existing Aliases</h3>
          <div className="list">
            {Object.entries(aliases).map(([alias, upstream]) => (
              <div className="list-item" key={alias}>
                <div>
                  <strong>{alias}</strong>
                  <small>{upstream}</small>
                </div>
                <div className="row-actions">
                  <button onClick={() => load(alias, upstream)}>Edit</button>
                  <button onClick={() => remove(alias)}>Remove</button>
                </div>
              </div>
            ))}
            {Object.keys(aliases).length === 0 && <p className="hint">No aliases loaded.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
