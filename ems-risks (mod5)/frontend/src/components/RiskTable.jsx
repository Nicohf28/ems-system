function SeverityBadge({ value }) {
  return <span className={`badge severity-${value}`}>{value}</span>;
}

function StatusBadge({ value }) {
  return <span className={`badge status-${value}`}>{value}</span>;
}

export default function RiskTable({ risks }) {
  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h2>Tabla de riesgos</h2>
          <p>Respuesta esperada del backend: success true y data como arreglo.</p>
        </div>
        <span className="count-pill">{risks.length} registros</span>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Project ID</th>
              <th>Riesgo</th>
              <th>Severidad</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {risks.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-cell">
                  No hay riesgos registrados para este proyecto.
                </td>
              </tr>
            ) : (
              risks.map((risk) => (
                <tr key={risk.id}>
                  <td>{risk.id}</td>
                  <td>{risk.projectId}</td>
                  <td className="risk-text">{risk.risk}</td>
                  <td><SeverityBadge value={risk.severity} /></td>
                  <td><StatusBadge value={risk.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
