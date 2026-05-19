/**
 * VerdictBanner.jsx — Banner principal de veredicto de rentabilidad
 *
 * Muestra el resultado global con franja lateral coloreada según el veredicto:
 *   RENTABLE      → verde
 *   EN RIESGO     → ámbar
 *   NO RENTABLE   → rojo
 *
 * Props:
 *   verdict          {string}  — "RENTABLE" | "EN RIESGO" | "NO RENTABLE"
 *   rentabilityScore {number}  — 0-100
 *   verdictReason    {string}  — descripción de la dimensión que más afecta
 */

const STYLES = {
  RENTABLE:      { accent: '#16a34a', bg: '#f0fdf4', textColor: '#14532d', badgeBg: '#16a34a', badgeColor: '#fff' },
  'EN RIESGO':   { accent: '#f59e0b', bg: '#fffbeb', textColor: '#78350f', badgeBg: '#f59e0b', badgeColor: '#1c1917' },
  'NO RENTABLE': { accent: '#dc2626', bg: '#fef2f2', textColor: '#7f1d1d', badgeBg: '#dc2626', badgeColor: '#fff' },
};

const DESCRIPTIONS = {
  RENTABLE:      'El proyecto cumple los indicadores clave y genera valor dentro del presupuesto y plazos establecidos.',
  'EN RIESGO':   'El proyecto presenta alertas en una o más dimensiones que requieren atención para evitar pérdidas.',
  'NO RENTABLE': 'El proyecto supera los umbrales críticos. Se recomienda revisar el alcance, costos o riesgos de inmediato.',
};

export default function VerdictBanner({ verdict, rentabilityScore, verdictReason }) {
  const s = STYLES[verdict] ?? STYLES['EN RIESGO'];
  const description = DESCRIPTIONS[verdict] ?? '';

  return (
    <div style={{
      background: s.bg,
      borderRadius: '12px',
      marginBottom: '24px',
      display: 'flex',
      overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      border: `1px solid ${s.accent}30`,
    }}>
      {/* Franja lateral de color */}
      <div style={{ width: '6px', background: s.accent, flexShrink: 0 }} />

      <div style={{ flex: 1, padding: '22px 28px', display: 'flex', alignItems: 'center', gap: '28px' }}>
        {/* Texto principal */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <span style={{
              background: s.badgeBg,
              color: s.badgeColor,
              fontWeight: '800',
              fontSize: '15px',
              padding: '4px 14px',
              borderRadius: '20px',
              letterSpacing: '0.08em',
            }}>
              {verdict}
            </span>
          </div>
          <div style={{ fontSize: '13px', color: s.textColor, lineHeight: 1.6, maxWidth: '520px' }}>
            {description}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px', fontStyle: 'italic' }}>
            Factor principal: {verdictReason}
          </div>
        </div>

        {/* Score */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Score global
          </div>
          <div style={{ fontSize: '56px', fontWeight: '900', color: s.accent, lineHeight: 1 }}>
            {rentabilityScore}
          </div>
          <div style={{ fontSize: '13px', color: '#9ca3af' }}>/ 100</div>
        </div>
      </div>
    </div>
  );
}
