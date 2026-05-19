
import { useEffect, useState, useCallback } from 'react';

import {
  getRequirements,
  updateRequirement
} from '../services/requirementService';

function RequirementTable() {

  const [projectId, setProjectId] = useState(1);
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadRequirements = useCallback(async () => {

    setError('');

    if (!projectId) {
      setRequirements([]);
      return;
    }

    try {

      setLoading(true);

      const response = await getRequirements(projectId);

      setRequirements(response.data.data);

    } catch {

      setError('Error cargando requisitos');

    } finally {

      setLoading(false);
    }

  }, [projectId]);

  useEffect(() => {

    const timeout = setTimeout(() => {
      loadRequirements();
    }, 0);

    return () => clearTimeout(timeout);

  }, [loadRequirements]);

  const handleStatusChange = async (id, newStatus) => {

    try {

      await updateRequirement(id, {
        status: newStatus
      });

      await loadRequirements();

    } catch {

      setError('Error actualizando requisito');
    }
  };

  return (

    <section className="card">

      {/* HEADER */}
      <div className="table-header">

        <div className="table-title-wrapper">

          <div className="card-header-eyebrow">
            <span className="card-header-step">02</span>
            <span className="card-header-divider"></span>
            <span>Trazabilidad</span>
          </div>

          <h2>
            Lista de Requisitos
          </h2>

          <p>
            Visualiza requisitos registrados, monitorea
            estados de aprobación y valida la trazabilidad
            funcional dentro del ecosistema EMS.
          </p>

        </div>

        {/* FILTROS Y ACCIONES */}
        <div className="actions">

          <div className="filter-group">
            <span className="filter-label">Proyecto</span>
            <input
              type="number"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="Project ID"
            />
          </div>

          <button
            className="primary-button"
            onClick={loadRequirements}
          >
            🔄 Refrescar
          </button>

        </div>

      </div>

      {/* SEPARADOR */}
      <div className="form-section-divider">
        <span className="form-section-label">
          {requirements.length > 0
            ? `${requirements.length} requisito${requirements.length !== 1 ? 's' : ''} encontrado${requirements.length !== 1 ? 's' : ''}`
            : 'Sin resultados'}
        </span>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="loading-message">
          ⏳ Cargando requisitos del proyecto...
        </p>
      )}

      {/* ERROR */}
      {error && (
        <p className="error-message">
          ⚠️ {error}
        </p>
      )}

      {/* TABLA */}
      <div className="table-container">

        <table>

          <thead>

            <tr>
              <th>Identificación</th>
              <th>Proyecto</th>
              <th>Requisito</th>
              <th>Descripción Funcional</th>
              <th>Estado</th>
              <th>Actualizar Estado</th>
            </tr>

          </thead>

          <tbody>

            {requirements.length > 0 ? (

              requirements.map((requirement) => (

                <tr key={requirement.id}>

                  <td>
                    <strong>
                      #{requirement.id}
                    </strong>
                  </td>

                  <td>
                    Proyecto {requirement.projectId}
                  </td>

                  <td>
                    <strong>
                      {requirement.title}
                    </strong>
                  </td>

                  <td>
                    {requirement.description || (
                      <span style={{ opacity: 0.45, fontStyle: 'italic' }}>
                        Sin descripción registrada
                      </span>
                    )}
                  </td>

                  <td>

                    <span
                      className={`status ${requirement.status}`}
                    >
                      {requirement.status}
                    </span>

                  </td>

                  <td>

                    <select
                      value={requirement.status}
                      onChange={(e) =>
                        handleStatusChange(
                          requirement.id,
                          e.target.value
                        )
                      }
                    >
                      <option value="pending">pending</option>
                      <option value="approved">approved</option>
                      <option value="rejected">rejected</option>

                    </select>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="6"
                  style={{
                    textAlign: 'center',
                    padding: '48px 20px'
                  }}
                >
                  <div className="empty-state">
                    <div className="empty-state-icon">📭</div>
                    <p className="empty-state-title">Sin requisitos registrados</p>
                    <p className="empty-state-sub">No existen requisitos para este proyecto.</p>
                  </div>
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </section>
  );
}

export default RequirementTable;
