import type { DiagnosticReport } from "../lib/schema";

type Props = {
  report: DiagnosticReport | null;
};

export function DiagnosticsPanel({ report }: Props) {
  if (!report) {
    return (
      <section className="card">
        <h2>Config Diagnostics</h2>
        <p className="hint">No diagnostics loaded yet.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Config Diagnostics</h2>
      <div className="stats">
        <div><strong>{report.ok ? "OK" : "Check"}</strong><span>Status</span></div>
        <div><strong>{report.errors}</strong><span>Errors</span></div>
        <div><strong>{report.warnings}</strong><span>Warnings</span></div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Level</th>
            <th>Code</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {report.items.map((item, index) => (
            <tr key={`${item.code}-${index}`}>
              <td>{item.level}</td>
              <td className="mono">{item.code}</td>
              <td>{item.message}</td>
            </tr>
          ))}
          {report.items.length === 0 && (
            <tr><td colSpan={3}>No config issues detected.</td></tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
