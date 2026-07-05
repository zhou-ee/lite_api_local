type Props = {
  health: unknown;
  stats: Record<string, unknown> | null;
};

export function StatusCards({ health, stats }: Props) {
  return (
    <div className="grid two">
      <section className="card">
        <h2>Gateway Status</h2>
        <pre>{JSON.stringify(health, null, 2)}</pre>
      </section>
      <section className="card">
        <h2>Today Usage</h2>
        <div className="stats">
          <div><strong>{String(stats?.request_count ?? "-")}</strong><span>Requests</span></div>
          <div><strong>{String(stats?.total_tokens ?? "-")}</strong><span>Total tokens</span></div>
          <div><strong>{String(stats?.avg_latency_ms ?? "-")}</strong><span>Avg latency ms</span></div>
        </div>
        <pre>{JSON.stringify(stats, null, 2)}</pre>
      </section>
    </div>
  );
}
