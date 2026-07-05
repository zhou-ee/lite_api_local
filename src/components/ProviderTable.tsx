import type { ProviderConfig } from "../lib/schema";

type Props = {
  providers: ProviderConfig[];
};

export function ProviderTable({ providers }: Props) {
  return (
    <section className="card">
      <h2>Providers</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Kind</th>
            <th>Base URL</th>
            <th>Priority</th>
            <th>Weight</th>
            <th>Status</th>
            <th>Models</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((provider) => (
            <tr key={provider.id}>
              <td>{provider.id}</td>
              <td>{provider.kind}</td>
              <td className="mono">{provider.base_url}</td>
              <td>{provider.priority}</td>
              <td>{provider.weight}</td>
              <td>{provider.enabled ? "enabled" : "disabled"}</td>
              <td>{provider.models.join(", ")}</td>
            </tr>
          ))}
          {providers.length === 0 && (
            <tr>
              <td colSpan={7}>No providers loaded.</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
