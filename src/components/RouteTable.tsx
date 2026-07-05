import type { RouteConfig } from "../lib/schema";

type Props = {
  routes: Record<string, RouteConfig>;
};

export function RouteTable({ routes }: Props) {
  const entries = Object.entries(routes);

  return (
    <section className="card">
      <h2>Routes</h2>
      <table>
        <thead>
          <tr>
            <th>Model</th>
            <th>Strategy</th>
            <th>Providers</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([model, route]) => (
            <tr key={model}>
              <td>{model}</td>
              <td>{route.strategy}</td>
              <td>{route.providers.join(" → ")}</td>
            </tr>
          ))}
          {entries.length === 0 && (
            <tr>
              <td colSpan={3}>No routes loaded.</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
