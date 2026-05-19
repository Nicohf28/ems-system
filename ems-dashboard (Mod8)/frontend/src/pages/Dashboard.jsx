/**
 * Dashboard.jsx — Pagina principal del modulo Grupo 8 (Dashboard de Valor)
 *
 * Responsabilidades:
 *  1. Navbar con campo de projectId y botones Cargar / Refrescar.
 *  2. Validacion del projectId (no vacio, entero positivo).
 *  3. Llamada al backend (:3007/dashboard/:id) via getDashboard().
 *  4. Renderizado condicional:
 *       - Estado vacio (inicial)
 *       - Estado cargando
 *       - Banner de error
 *       - Dashboard completo:
 *           VerdictBanner + ScoreGauge + metricas resumen
 *           DimensionsChart (radar) + ServiceStatusBar + DimensionCards
 *           LCAChart (ciclo de vida 5 anos)
 *           FunctionCostMatrix (matriz valor vs costo por requisito)
 *
 * Estados de la pagina:
 *   loading=true          → indicador de carga
 *   error≠null            → banner de error rojo
 *   data≠null && !loading → dashboard con todos los componentes
 *   data=null && !loading → pantalla de bienvenida
 */
import { useState } from 'react';
import { getDashboard }       from '../services/api';
import VerdictBanner          from '../components/VerdictBanner';
import ScoreGauge             from '../components/ScoreGauge';
import DimensionCard          from '../components/DimensionCard';
import DimensionsChart        from '../components/DimensionsChart';
import ServiceStatusBar       from '../components/ServiceStatusBar';
import LCAChart               from '../components/LCAChart';
import FunctionCostMatrix     from '../components/FunctionCostMatrix';

/** Orden fijo de renderizado de las 6 dimensiones en el grid 3x2 */
const DIM_ORDER = ['alcance', 'progreso', 'costos', 'riesgos', 'cambios', 'calidad'];

/** Metricas del panel de resumen con su descripcion breve */
const METRIC_DEFS = [
  {
    key:  d => `${d.approvedRequirements}/${d.requirements}`,
    label: 'Requisitos aprobados',
    desc:  'Total aprobados sobre el total definido',
  },
  {
    key:  d => `${d.progress}%`,
    label: 'Avance del cronograma',
    desc:  'Porcentaje completado segun el equipo',
  },
  {
    key:  d => `$${d.totalCost.toLocaleString('es-CO')}`,
    label: 'Costo acumulado',
    desc:  'Gasto registrado hasta la fecha',
  },
  {
    key:  d => d.activeRisks,
    label: 'Riesgos activos',
    desc:  'Riesgos sin mitigar ni cerrar',
  },
  {
    key:  d => d.highRisks,
    label: 'Riesgos de severidad alta',
    desc:  'Riesgos activos con mayor impacto potencial',
  },
  {
    key:  d => d.pendingChanges,
    label: 'Cambios pendientes',
    desc:  'Solicitudes de cambio sin aprobar',
  },
];

function validate(id) {
  if (!id || id.trim() === '') return 'El ID del proyecto no puede estar vacio.';
  const num = Number(id.trim());
  if (!Number.isInteger(num) || num <= 0) return 'El ID del proyecto debe ser un numero entero positivo.';
  return null;
}

export default function Dashboard() {
  const [projectId, setProjectId] = useState('1');
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const loadData = async () => {
    const validationError = validate(projectId);
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError(null);
    try {
      const result = await getDashboard(projectId.trim());
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message ?? 'Error al obtener los datos del dashboard.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ??
        'No se pudo conectar al backend. Verifique que el servidor este corriendo en el puerto 3007.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') loadData(); };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>

      {/* ── Navbar ── */}
      <nav style={{
        background: '#1e293b',
        color: '#ffffff',
        padding: '0 28px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div>
          <span style={{ fontWeight: '700', fontSize: '17px' }}>EMS — Dashboard de Valor</span>
          <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '12px' }}>Grupo 8</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            onKeyDown={handleKey}
            placeholder="ID del Proyecto"
            style={{
              padding: '7px 12px',
              borderRadius: '6px',
              border: '1px solid #475569',
              background: '#334155',
              color: '#ffffff',
              fontSize: '14px',
              width: '130px',
              outline: 'none',
            }}
          />
          <button
            onClick={loadData}
            disabled={loading}
            style={{
              padding: '7px 16px',
              background: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Cargando...' : 'Cargar'}
          </button>
          {data && (
            <button
              onClick={loadData}
              disabled={loading}
              style={{
                padding: '7px 14px',
                background: '#475569',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              Refrescar
            </button>
          )}
        </div>
      </nav>

      {/* ── Contenido ── */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 16px' }}>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#b91c1c',
            borderRadius: '8px',
            padding: '12px 18px',
            marginBottom: '22px',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        {/* Cargando */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '72px', color: '#6b7280' }}>
            <div style={{
              width: '40px', height: '40px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 16px',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <div style={{ fontSize: '15px' }}>Consultando los 6 microservicios...</div>
          </div>
        )}

        {/* Estado vacio */}
        {!loading && !data && !error && (
          <div style={{ textAlign: 'center', padding: '72px', color: '#9ca3af' }}>
            <div style={{
              width: '64px', height: '64px',
              background: '#e5e7eb',
              borderRadius: '12px',
              margin: '0 auto 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#374151' }}>
              Ingrese un ID de proyecto para comenzar
            </div>
            <div style={{ fontSize: '14px', marginTop: '8px', lineHeight: 1.6 }}>
              Escriba el ID en el campo de la barra superior y presione "Cargar".<br/>
              El dashboard agregara datos de los 6 microservicios del EMS.
            </div>
          </div>
        )}

        {/* Dashboard */}
        {!loading && data && (
          <>
            {/* Veredicto */}
            <VerdictBanner
              verdict={data.verdict}
              rentabilityScore={data.rentabilityScore}
              verdictReason={data.verdictReason}
            />

            {/* Score + metricas de resumen */}
            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '20px', marginBottom: '22px' }}>
              <ScoreGauge score={data.rentabilityScore} />

              <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '20px 24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}>
                <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Metricas del Proyecto #{data.projectId}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {METRIC_DEFS.map(({ key, label, desc }) => (
                    <div key={label} style={{
                      padding: '12px',
                      background: '#f9fafb',
                      borderRadius: '8px',
                      borderLeft: '3px solid #e5e7eb',
                    }}>
                      <div style={{ fontSize: '22px', fontWeight: '800', color: '#111827' }}>
                        {key(data)}
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#374151', marginTop: '2px' }}>
                        {label}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px', lineHeight: 1.3 }}>
                        {desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Grafica de barras comparativa */}
            <DimensionsChart dimensions={data.dimensions} />

            {/* Estado de microservicios */}
            <ServiceStatusBar servicesStatus={data.servicesStatus} />

            {/* Cards por dimension */}
            <div style={{ fontSize: '12px', color: '#374151', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Detalle por dimension
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
              {DIM_ORDER.map((name) =>
                data.dimensions[name] ? (
                  <DimensionCard key={name} name={name} dimension={data.dimensions[name]} />
                ) : null
              )}
            </div>

            {/* Separador de seccion */}
            <div style={{ borderTop: '2px dashed #e5e7eb', marginBottom: '28px' }} />

            {/* LCA — Ciclo de vida del software */}
            <div style={{ fontSize: '12px', color: '#374151', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Analisis del Ciclo de Vida (LCA)
            </div>
            <LCAChart lca={data.lca} />

            {/* Matriz Funcion / Costo */}
            <div style={{ fontSize: '12px', color: '#374151', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Matriz Funcion / Costo — Valor institucional vs Costo estimado
            </div>
            <FunctionCostMatrix matrix={data.functionCostMatrix} />
          </>
        )}
      </main>
    </div>
  );
}
