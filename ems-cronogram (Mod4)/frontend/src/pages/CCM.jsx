import React, { useState } from 'react'
import api from '../services/api'
import './CCM.css'

export default function CCMPage() {
  const [projectId, setProjectId] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const analyze = async () => {
    if (!projectId || isNaN(Number(projectId))) return
    setLoading(true)
    setError(null)
    try {
      const res = await api.getCCM(projectId)
      setData(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al analizar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ccm-page">
      <div className="page-header">
        <div>
          <h1>Análisis de Cadena Crítica <span style={{ color: 'var(--accent)' }}>CCM</span></h1>
          <p style={{ color: 'var(--text2)', marginTop: 4 }}>
            Critical Chain Method · Buffers · Crashing vs Fast Tracking
          </p>
        </div>
        <div className="project-selector">
          <input type="number" placeholder="Project ID" value={projectId}
            onChange={e => setProjectId(e.target.value)} style={{ width: 140 }} />
          <button className="btn btn-primary" onClick={analyze} disabled={loading}>
            {loading ? 'Analizando...' : '⚡ Analizar'}
          </button>
        </div>
      </div>

      {error && <div className="card" style={{ borderColor: 'var(--critical)', color: 'var(--critical)', marginBottom: 20 }}>{error}</div>}

      {data && (
        <>
          {/* KPIs */}
          <div className="stat-grid" style={{ marginBottom: 24 }}>
            <div className="stat-card">
              <div className="stat-label">Duración Cadena Crítica</div>
              <div className="stat-value accent">{data.totalDuration}d</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Project Buffer (PB)</div>
              <div className="stat-value warn">{data.projectBuffer}d</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Duración Total + PB</div>
              <div className="stat-value purple">{data.totalDurationWithBuffer}d</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Progreso Global</div>
              <div className="stat-value success">{data.progress}%</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Feeding Buffers</div>
              <div className="stat-value" style={{ color: 'var(--accent3)' }}>{data.feedingBuffers.length}</div>
            </div>
          </div>

          {/* Cadena Crítica */}
          <section className="ccm-section card">
            <h2 className="section-title">
              <span className="section-dot critical" />
              Cadena Crítica
            </h2>
            <p style={{ color: 'var(--text2)', marginBottom: 14, fontSize: 13 }}>
              Ruta más larga del proyecto usando tiempos agresivos (50%). Las tareas de esta cadena determinan la duración mínima del proyecto.
            </p>
            {data.criticalChain.length === 0 ? (
              <p style={{ color: 'var(--text2)' }}>No hay tareas suficientes para calcular la cadena crítica.</p>
            ) : (
              <div className="chain-flow">
                {data.criticalChain.map((id, i) => (
                  <React.Fragment key={id}>
                    <div className="chain-node">
                      <span className="chain-id">#{id}</span>
                    </div>
                    {i < data.criticalChain.length - 1 && <div className="chain-arrow">→</div>}
                  </React.Fragment>
                ))}
                <div className="chain-arrow">→</div>
                <div className="chain-node buffer-node">
                  <span className="chain-id">PB {data.projectBuffer}d</span>
                </div>
                <div className="chain-arrow">→</div>
                <div className="chain-node end-node">FIN</div>
              </div>
            )}
          </section>

          {/* Feeding Buffers */}
          {data.feedingBuffers.length > 0 && (
            <section className="ccm-section card">
              <h2 className="section-title">
                <span className="section-dot feeding" />
                Feeding Buffers (FB)
              </h2>
              <p style={{ color: 'var(--text2)', marginBottom: 14, fontSize: 13 }}>
                Colchones de tiempo que protegen la cadena crítica de retrasos en cadenas alimentadoras.
              </p>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Cadena Alimentadora</th>
                    <th>Conecta a Tarea</th>
                    <th>Feeding Buffer</th>
                  </tr>
                </thead>
                <tbody>
                  {data.feedingBuffers.map((fb, i) => (
                    <tr key={i}>
                      <td style={{ color: 'var(--text2)' }}>FB{i + 1}</td>
                      <td style={{ color: 'var(--accent3)' }}>
                        {fb.feedingChain.map(id => `#${id}`).join(' → ')}
                      </td>
                      <td>#{fb.insertBefore}</td>
                      <td><span className="tag tag-feeding">{fb.feedingBuffer}d</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* Crashing */}
          <section className="ccm-section card">
            <h2 className="section-title">
              <span className="section-dot crash" />
              Crashing — Reducción por Recursos
            </h2>
            <p style={{ color: 'var(--text2)', marginBottom: 14, fontSize: 13 }}>
              Acortar la cadena crítica añadiendo recursos adicionales. Mayor costo, menor tiempo.
            </p>
            <div className="stat-grid" style={{ marginBottom: 16 }}>
              <div className="stat-card">
                <div className="stat-label">Reducción máxima posible</div>
                <div className="stat-value warn">{data.crashing.totalPotentialReduction}d</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Costo total de crashing</div>
                <div className="stat-value critical">${data.crashing.totalCrashCost}</div>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Tarea</th>
                  <th>Días actuales</th>
                  <th>Mínimo</th>
                  <th>Reducción</th>
                  <th>Costo</th>
                  <th>Recomendación</th>
                </tr>
              </thead>
              <tbody>
                {data.crashing.options.map(opt => (
                  <tr key={opt.taskId}>
                    <td>#{opt.taskId} {opt.taskName}</td>
                    <td>{opt.currentDays}d</td>
                    <td>{opt.minDays}d</td>
                    <td><span className="tag tag-high">{opt.maxReductionDays}d</span></td>
                    <td style={{ color: 'var(--warn)' }}>${opt.crashCost}</td>
                    <td style={{ color: 'var(--text2)', fontSize: 12 }}>{opt.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Fast Tracking */}
          <section className="ccm-section card">
            <h2 className="section-title">
              <span className="section-dot ft" />
              Fast Tracking — Solapamiento de Tareas
            </h2>
            <p style={{ color: 'var(--text2)', marginBottom: 14, fontSize: 13 }}>
              Ejecutar tareas en paralelo para ganar tiempo. Mayor riesgo de retrabajo, pero sin costo adicional.
            </p>
            <div className="stat-grid" style={{ marginBottom: 16 }}>
              <div className="stat-card">
                <div className="stat-label">Días ahorrados (50% overlap)</div>
                <div className="stat-value success">{data.fastTracking.totalSavedDays}d</div>
              </div>
            </div>

            {data.fastTracking.pairs.length === 0 ? (
              <p style={{ color: 'var(--text2)' }}>Se necesitan al menos 2 tareas en la cadena crítica.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Tarea 1</th>
                    <th>Tarea 2 (Solapar)</th>
                    <th>Overlap</th>
                    <th>Días Ahorrados</th>
                    <th>Riesgo</th>
                    <th>Recomendación</th>
                  </tr>
                </thead>
                <tbody>
                  {data.fastTracking.pairs.map((p, i) => (
                    <tr key={i}>
                      <td>#{p.task1Id} {p.task1Name}</td>
                      <td>#{p.task2Id} {p.task2Name}</td>
                      <td>{p.overlapPercent}%</td>
                      <td><span className="tag tag-low">{p.savedDays}d</span></td>
                      <td><span className={`tag tag-${p.riskLevel}`}>{p.riskLevel}</span></td>
                      <td style={{ color: 'var(--text2)', fontSize: 12 }}>{p.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {/* Comparativa */}
          <section className="ccm-section card">
            <h2 className="section-title">
              <span className="section-dot compare" />
              Comparativa: Crashing vs Fast Tracking
            </h2>
            <div className="compare-grid">
              <div className="compare-card crash-card">
                <h3>⚡ Crashing</h3>
                <ul>
                  <li>Reducción: <strong>{data.crashing.totalPotentialReduction} días</strong></li>
                  <li>Costo adicional: <strong>${data.crashing.totalCrashCost}</strong></li>
                  <li>Riesgo: <span style={{ color: 'var(--warn)' }}>Moderado</span></li>
                  <li>Método: Más recursos, misma secuencia</li>
                </ul>
              </div>
              <div className="compare-card ft-card">
                <h3>🔀 Fast Tracking</h3>
                <ul>
                  <li>Reducción: <strong>{data.fastTracking.totalSavedDays} días</strong></li>
                  <li>Costo adicional: <strong>$0</strong></li>
                  <li>Riesgo: <span style={{ color: 'var(--critical)' }}>Alto (retrabajo)</span></li>
                  <li>Método: Tareas en paralelo</li>
                </ul>
              </div>
            </div>
          </section>
        </>
      )}

      {!data && !loading && (
        <div className="empty-state card">
          <div className="empty-icon">⛓</div>
          <p>Ingresa un Project ID y presiona Analizar para calcular la Cadena Crítica.</p>
        </div>
      )}
    </div>
  )
}
