const severities = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' }
];

const statuses = [
  { value: 'active', label: 'Activo' },
  { value: 'mitigated', label: 'Mitigado' },
  { value: 'closed', label: 'Cerrado' }
];

export default function RiskForm({ form, onChange, onSubmit, loading }) {
  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h2>Registrar riesgo</h2>
          <p>Guarda riesgos usando exactamente el contrato JSON del backend.</p>
        </div>
      </div>

      <form className="risk-form" onSubmit={onSubmit}>
        <label>
          Project ID
          <input
            name="projectId"
            type="number"
            min="1"
            value={form.projectId}
            onChange={onChange}
            placeholder="Ej: 1"
          />
        </label>

        <label className="field-wide">
          Riesgo
          <input
            name="risk"
            type="text"
            value={form.risk}
            onChange={onChange}
            placeholder="Ej: Retraso backend"
          />
        </label>

        <label>
          Severidad
          <select name="severity" value={form.severity} onChange={onChange}>
            {severities.map((severity) => (
              <option key={severity.value} value={severity.value}>
                {severity.label} ({severity.value})
              </option>
            ))}
          </select>
        </label>

        <label>
          Estado
          <select name="status" value={form.status} onChange={onChange}>
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label} ({status.value})
              </option>
            ))}
          </select>
        </label>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </section>
  );
}
