function ChangesTable({ changes, onRefresh, onUpdate }) {
  return (
    <div className="card table-card">
      <div className="card-header">
        <h2 className="card-title">Cambios Registrados</h2>
        <button onClick={onRefresh} className="btn btn-secondary">
          Refrescar
        </button>
      </div>

      {changes.length === 0 ? (
        <p className="empty-msg">No hay cambios registrados para este proyecto</p>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Proyecto ID</th>
                <th>Cambio</th>
                <th>Impacto</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {changes.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.projectId}</td>
                  <td>{c.change}</td>
                  <td>
                    <span className={`badge impact-${c.impact}`}>{c.impact}</span>
                  </td>
                  <td>
                    <span className={`badge status-${c.status}`}>{c.status}</span>
                  </td>
                  <td>
                    <button
                      onClick={() => onUpdate(c)}
                      className="btn btn-warning btn-sm"
                    >
                      Actualizar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ChangesTable
