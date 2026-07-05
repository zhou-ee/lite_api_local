import type { ModelStats, ProviderStats } from "../lib/schema";

type Props = {
  providerStats: ProviderStats[];
  modelStats: ModelStats[];
};

function money(value?: number) {
  if (value === undefined || value === null) return "-";
  return `$${value.toFixed(6)}`;
}

export function StatsTables({ providerStats, modelStats }: Props) {
  return (
    <div className="grid two">
      <section className="card">
        <h2>Provider Stats · Today</h2>
        <table>
          <thead>
            <tr>
              <th>Provider</th>
              <th>Requests</th>
              <th>Success</th>
              <th>Errors</th>
              <th>Tokens</th>
              <th>Cost</th>
              <th>Avg Latency</th>
            </tr>
          </thead>
          <tbody>
            {providerStats.map((item) => (
              <tr key={item.provider_id}>
                <td>{item.provider_id}</td>
                <td>{item.request_count}</td>
                <td>{item.success_count}</td>
                <td>{item.error_count}</td>
                <td>{item.total_tokens}</td>
                <td>{money(item.estimated_cost_usd)}</td>
                <td>{Math.round(item.avg_latency_ms)}ms</td>
              </tr>
            ))}
            {providerStats.length === 0 && <tr><td colSpan={7}>No provider stats yet.</td></tr>}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2>Model Stats · Today</h2>
        <table>
          <thead>
            <tr>
              <th>Model</th>
              <th>Upstream</th>
              <th>Requests</th>
              <th>Errors</th>
              <th>Tokens</th>
              <th>Cost</th>
              <th>Avg Latency</th>
            </tr>
          </thead>
          <tbody>
            {modelStats.map((item) => (
              <tr key={`${item.requested_model}-${item.upstream_model}`}>
                <td>{item.requested_model}</td>
                <td>{item.upstream_model}</td>
                <td>{item.request_count}</td>
                <td>{item.error_count}</td>
                <td>{item.total_tokens}</td>
                <td>{money(item.estimated_cost_usd)}</td>
                <td>{Math.round(item.avg_latency_ms)}ms</td>
              </tr>
            ))}
            {modelStats.length === 0 && <tr><td colSpan={7}>No model stats yet.</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  );
}
