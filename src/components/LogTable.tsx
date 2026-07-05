import type { RequestLog } from "../lib/schema";

type Props = {
  logs: RequestLog[];
};

export function LogTable({ logs }: Props) {
  return (
    <section className="card">
      <h2>Recent Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Client</th>
            <th>Provider</th>
            <th>Model</th>
            <th>Status</th>
            <th>Latency</th>
            <th>Tokens</th>
            <th>Error</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{new Date(log.ts * 1000).toLocaleString()}</td>
              <td>{log.client_name ?? "-"}</td>
              <td>{log.provider_id}</td>
              <td>{log.requested_model} → {log.upstream_model}</td>
              <td>{log.status_code}</td>
              <td>{log.latency_ms}ms</td>
              <td>{log.total_tokens ?? "-"}</td>
              <td>{log.error_type ?? "-"}</td>
            </tr>
          ))}
          {logs.length === 0 && (
            <tr>
              <td colSpan={8}>No request logs yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
