/**
 * DimensionCard.jsx — Tarjeta de una dimensión de rentabilidad
 *
 * Muestra el score, status, descripción explicativa y detalle cuantitativo
 * de una de las 6 dimensiones. El borde refleja el status con color semafórico:
 *   ok          → borde verde
 *   warning     → borde ámbar
 *   critical    → borde rojo
 *   unavailable → borde gris
 *
 * Props:
 *   name      {string} — alcance | progreso | costos | riesgos | cambios | calidad
 *   dimension {object} — { score: number|null, status: string, detail: string }
 */

const STATUS_CONFIG = {
  ok:          { border: '#16a34a', badgeBg: '#dcfce7', badgeColor: '#15803d', label: 'OK' },
  warning:     { border: '#f59e0b', badgeBg: '#fef3c7', badgeColor: '#d97706', label: 'ADVERTENCIA' },
  critical:    { border: '#dc2626', badgeBg: '#fee2e2', badgeColor: '#b91c1c', label: 'CRITICO' },
  unavailable: { border: '#9ca3af', badgeBg: '#f3f4f6', badgeColor: '#6b7280', label: 'NO DISPONIBLE' },
};

const DIM_META = {
  alcance:  {
    label: 'Alcance',
    description: 'Porcentaje de requisitos aprobados sobre el total definido para el proyecto.',
  },
  progreso: {
    label: 'Progreso',
    description: 'Avance real del cronograma reportado por el equipo de desarrollo.',
  },
  costos:   {
    label: 'Costos',
    description: 'Consumo presupuestal respecto al presupuesto base. A mayor gasto, menor score.',
  },
  riesgos:  {
    label: 'Riesgos',
    description: 'Exposicion a riesgos activos. Los de severidad alta tienen mayor penalizacion.',
  },
  cambios:  {
    label: 'Cambios',
    description: 'Impacto de solicitudes de cambio pendientes sobre el alcance del proyecto.',
  },
  calidad:  {
    label: 'Calidad',
    description: 'Proporcion de revisiones de QA aprobadas sobre el total evaluado.',
  },
};

export default function DimensionCard({ name, dimension }) {
  const { score, status, detail } = dimension;
  const cfg  = STATUS_CONFIG[status] ?? STATUS_CONFIG.unavailable;
  const meta = DIM_META[name] ?? { label: name, description: '' };

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '12px',
      border: `2px solid ${cfg.border}`,
      padding: '18px 20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
      {/* Header: nombre + badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>{meta.label}</span>
        <span style={{
          background: cfg.badgeBg,
          color: cfg.badgeColor,
          fontSize: '10px',
          fontWeight: '700',
          padding: '3px 9px',
          borderRadius: '20px',
          letterSpacing: '0.04em',
          flexShrink: 0,
          marginLeft: '8px',
        }}>
          {cfg.label}
        </span>
      </div>

      {/* Descripción breve */}
      <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5 }}>
        {meta.description}
      </div>

      {/* Score */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        {score !== null ? (
          <>
            <span style={{ fontSize: '38px', fontWeight: '900', color: cfg.border, lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: '14px', color: '#9ca3af' }}>/ 100</span>
          </>
        ) : (
          <span style={{ fontSize: '26px', color: '#9ca3af' }}>Sin datos</span>
        )}
      </div>

      {/* Barra de progreso */}
      {score !== null && (
        <div style={{ width: '100%', height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${score}%`, height: '100%', background: cfg.border, borderRadius: '3px' }} />
        </div>
      )}

      {/* Detalle cuantitativo */}
      <div style={{
        fontSize: '12px',
        color: '#374151',
        background: '#f9fafb',
        borderRadius: '6px',
        padding: '6px 10px',
        lineHeight: 1.4,
      }}>
        {detail}
      </div>
    </div>
  );
}
