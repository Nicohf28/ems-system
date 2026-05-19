import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import RiskForm from '../components/RiskForm.jsx';
import RiskTable from '../components/RiskTable.jsx';
import { createRisk, getRisksByProject } from '../services/riskService.js';

const VALID_SEVERITIES = ['low', 'medium', 'high'];
const VALID_STATUSES = ['active', 'mitigated', 'closed'];

const initialForm = {
  projectId: '1',
  risk: '',
  severity: 'medium',
  status: 'active'
};

function validateRisk(payload) {
  if (!Number.isInteger(payload.projectId) || payload.projectId <= 0) {
    return 'projectId debe ser numérico, entero y mayor que cero.';
  }

  if (!payload.risk.trim()) {
    return 'El campo risk es obligatorio.';
  }

  if (!VALID_SEVERITIES.includes(payload.severity)) {
    return 'severity solo puede ser low, medium o high.';
  }

  if (!VALID_STATUSES.includes(payload.status)) {
    return 'status solo puede ser active, mitigated o closed.';
  }

  return null;
}

function getErrorMessage(error) {
  return error?.response?.data?.message || 'No se pudo conectar con el backend en http://localhost:3004.';
}

export default function RiskPage() {
  const [form, setForm] = useState(initialForm);
  const [queryProjectId, setQueryProjectId] = useState('1');
  const [risks, setRisks] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const stats = useMemo(() => {
    return {
      total: risks.length,
      active: risks.filter((risk) => risk.status === 'active').length,
      high: risks.filter((risk) => risk.severity === 'high').length
    };
  }, [risks]);

  async function loadRisks(projectId = queryProjectId, customMessage = 'Riesgos cargados correctamente.') {
    const numericProjectId = Number(projectId);

    if (!Number.isInteger(numericProjectId) || numericProjectId <= 0) {
      setError('El Project ID de consulta debe ser numérico, entero y mayor que cero.');
      setMessage('');
      setRisks([]);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await getRisksByProject(numericProjectId);

      if (!response.success || !Array.isArray(response.data)) {
        throw new Error('La respuesta del backend no cumple con { success: true, data: [] }.');
      }

      setRisks(response.data);
      setMessage(customMessage);
    } catch (err) {
      setRisks([]);
      setMessage('');
      setError(err.message || getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRisks('1', 'Consulta inicial lista.');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      projectId: Number(form.projectId),
      risk: form.risk.trim(),
      severity: form.severity,
      status: form.status
    };

    const validationError = validateRisk(payload);

    if (validationError) {
      setError(validationError);
      setMessage('');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const response = await createRisk(payload);

      if (!response.success) {
        throw new Error(response.message || 'El backend rechazó la creación del riesgo.');
      }

      setMessage('Riesgo guardado correctamente.');
      setQueryProjectId(String(payload.projectId));
      setForm({ ...initialForm, projectId: String(payload.projectId) });
      await loadRisks(payload.projectId, 'Riesgo guardado y tabla actualizada.');
    } catch (err) {
      setMessage('');
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  function handleUpdateClick() {
    loadRisks(queryProjectId, 'Lista actualizada correctamente.');
  }

  function handleRefreshClick() {
    loadRisks(queryProjectId, 'Consulta refrescada correctamente.');
  }

  return (
    <div className="app-shell">
      <Navbar />

      <main className="layout">
        <section className="hero card">
          <div>
            <p className="eyebrow">Backend esperado: http://localhost:3004</p>
            <h2>Prototipo frontend del módulo de riesgos</h2>
            <p>
              Registra y consulta riesgos por proyecto usando los endpoints oficiales
              <strong> POST /risks</strong> y <strong>GET /risks/:projectId</strong>.
            </p>
          </div>
          <div className="stats-grid">
            <article>
              <span>{stats.total}</span>
              <p>Total</p>
            </article>
            <article>
              <span>{stats.active}</span>
              <p>Activos</p>
            </article>
            <article>
              <span>{stats.high}</span>
              <p>Altos</p>
            </article>
          </div>
        </section>

        {(message || error) && (
          <div className={error ? 'alert alert-error' : 'alert alert-success'}>
            {error || message}
          </div>
        )}

        <div className="grid-two">
          <RiskForm
            form={form}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            loading={saving}
          />

          <section className="card">
            <div className="card-header">
              <div>
                <h2>Consultar por proyecto</h2>
                <p>Consulta los riesgos asociados a un projectId numérico.</p>
              </div>
            </div>

            <div className="query-box">
              <label>
                Project ID
                <input
                  type="number"
                  min="1"
                  value={queryProjectId}
                  onChange={(event) => setQueryProjectId(event.target.value)}
                  placeholder="Ej: 1"
                />
              </label>

              <div className="button-row">
                <button className="btn btn-secondary" type="button" onClick={handleUpdateClick} disabled={loading}>
                  {loading ? 'Actualizando...' : 'Actualizar'}
                </button>
                <button className="btn btn-ghost" type="button" onClick={handleRefreshClick} disabled={loading}>
                  Refrescar
                </button>
              </div>
            </div>
          </section>
        </div>

        <RiskTable risks={risks} />
      </main>
    </div>
  );
}
