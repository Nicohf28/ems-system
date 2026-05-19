/**
 * LCAChart.jsx — Grafica del Ciclo de Vida del Software (LCA)
 *
 * Muestra dos visualizaciones combinadas en SVG puro:
 *   1. Barras apiladas por año (desarrollo + mantenimiento + soporte + infra)
 *   2. Linea de TCO acumulado sobre las barras
 *
 * Props:
 *   lca {object} — resultado de lcaService.computeLCA():
 *     { developmentCost, annualOperationalCost, fiveYearTCO, projections, assumptions }
 */

const COLORS = {
  development: '#6366f1', // violeta — costo de desarrollo (año 0)
  maintenance: '#3b82f6', // azul    — mantenimiento
  support:     '#22c55e', // verde   — soporte
  infra:       '#a855f7', // purpura — infraestructura
  tco:         '#0f172a', // negro   — linea TCO acumulado
};

function fmt(n) {
  return `$${n.toLocaleString('es-CO')}`;
}

export default function LCAChart({ lca }) {
  if (!lca) {
    return (
      <div style={{
        background: '#ffffff', borderRadius: '12px', padding: '20px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px',
        color: '#9ca3af', textAlign: 'center', fontSize: '13px',
      }}>
        LCA no disponible — el servicio de costos no respondio.
      </div>
    );
  }

  const { projections, fiveYearTCO, developmentCost,
          annualOperationalCost, assumptions } = lca;

  // ── Dimensiones del SVG ───────────────────────────────────────────────────
  const ML = 72, MR = 16, MT = 22, MB = 44; // margenes
  const W = 460, H = 220;
  const PW = W - ML - MR; // ancho del area de graficacion
  const PH = H - MT - MB; // alto

  const n       = projections.length; // 6 barras (año 0 al 5)
  const barW    = Math.floor((PW / n) * 0.55);
  const barGap  = PW / n;

  // Escala Y: max = TCO acumulado al final
  const maxY    = fiveYearTCO;

  function toX(i) { return ML + i * barGap + (barGap - barW) / 2; }
  function toY(v) { return MT + PH - (v / maxY) * PH; }
  function toH(v) { return (v / maxY) * PH; }

  // Puntos de la linea TCO
  const tcoLine = projections
    .map((p, i) => `${(ML + i * barGap + barGap / 2).toFixed(1)},${toY(p.cumulative).toFixed(1)}`)
    .join(' ');

  // Etiquetas del eje Y (4 niveles)
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => ({
    v: Math.round(maxY * f),
    y: toY(maxY * f),
  }));

  return (
    <div style={{
      background: '#ffffff', borderRadius: '12px',
      padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      marginBottom: '24px',
    }}>
      {/* Encabezado */}
      <div style={{ marginBottom: '4px', fontSize: '12px', fontWeight: '700', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Estimacion del Ciclo de Vida — LCA ({assumptions.projectionYears} anos)
      </div>
      <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '16px' }}>
        Tasas aplicadas: mantenimiento {(assumptions.maintenanceRate * 100).toFixed(0)}% +
        soporte {(assumptions.supportRate * 100).toFixed(0)}% +
        infraestructura {(assumptions.infraRate * 100).toFixed(0)}% del costo de desarrollo / ano
      </div>

      {/* Metricas clave */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'Costo de desarrollo',    value: fmt(developmentCost),       color: COLORS.development },
          { label: 'Costo operativo anual',  value: fmt(annualOperationalCost), color: COLORS.maintenance },
          { label: 'TCO a 5 anos',           value: fmt(fiveYearTCO),           color: COLORS.tco },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: '#f9fafb', borderRadius: '8px', padding: '10px 12px', borderLeft: `3px solid ${color}` }}>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#111827' }}>{value}</div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Grafica SVG */}
      <div style={{ overflowX: 'auto' }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', minWidth: '340px' }}>

          {/* Lineas horizontales de referencia */}
          {yTicks.map(({ v, y }) => (
            <g key={v}>
              <line x1={ML} y1={y} x2={W - MR} y2={y} stroke="#f1f5f9" strokeWidth="1" />
              <text x={ML - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#94a3b8">
                {v === 0 ? '0' : `$${(v / 1000).toFixed(0)}k`}
              </text>
            </g>
          ))}

          {/* Barras apiladas */}
          {projections.map((p, i) => {
            const x = toX(i);
            // Año 0: solo barra de desarrollo (violeta)
            if (i === 0) {
              const bh = toH(p.development);
              return (
                <g key={i}>
                  <rect x={x} y={toY(p.development)} width={barW} height={bh}
                    fill={COLORS.development} rx="3" />
                </g>
              );
            }
            // Años 1-5: mantenimiento + soporte + infra apilados
            const yMaint  = toY(p.maintenance + p.support + p.infra);
            const ySupp   = toY(p.support + p.infra);
            const yInfra  = toY(p.infra);
            return (
              <g key={i}>
                <rect x={x} y={yMaint}  width={barW} height={toH(p.maintenance)} fill={COLORS.maintenance} />
                <rect x={x} y={ySupp}   width={barW} height={toH(p.support)}     fill={COLORS.support} />
                <rect x={x} y={yInfra}  width={barW} height={toH(p.infra)}       fill={COLORS.infra} rx="3" />
                {/* Borde redondeado superior */}
                <rect x={x} y={yMaint}  width={barW} height={4} fill={COLORS.maintenance} rx="3" />
              </g>
            );
          })}

          {/* Linea TCO acumulado */}
          <polyline
            points={tcoLine}
            fill="none"
            stroke={COLORS.tco}
            strokeWidth="2"
            strokeDasharray="5,3"
            strokeLinejoin="round"
          />
          {/* Puntos de la linea */}
          {projections.map((p, i) => (
            <circle
              key={i}
              cx={ML + i * barGap + barGap / 2}
              cy={toY(p.cumulative)}
              r="3"
              fill={COLORS.tco}
            />
          ))}

          {/* Etiquetas eje X */}
          {projections.map((p, i) => (
            <text key={i} x={ML + i * barGap + barGap / 2} y={H - MB + 14}
              textAnchor="middle" fontSize="10" fill="#374151" fontWeight="600">
              {p.label}
            </text>
          ))}

          {/* Etiqueta TCO en el ultimo punto */}
          <text
            x={ML + (projections.length - 1) * barGap + barGap / 2 - 4}
            y={toY(fiveYearTCO) - 8}
            textAnchor="end" fontSize="9" fill={COLORS.tco} fontWeight="700"
          >
            TCO {fmt(fiveYearTCO)}
          </text>
        </svg>
      </div>

      {/* Leyenda */}
      <div style={{ display: 'flex', gap: '14px', marginTop: '12px', flexWrap: 'wrap' }}>
        {[
          { color: COLORS.development, label: 'Desarrollo (entrega)' },
          { color: COLORS.maintenance, label: 'Mantenimiento' },
          { color: COLORS.support,     label: 'Soporte' },
          { color: COLORS.infra,       label: 'Infraestructura' },
          { color: COLORS.tco,         label: 'TCO acumulado', dashed: true },
        ].map(({ color, label, dashed }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {dashed
              ? <svg width="18" height="10"><line x1="0" y1="5" x2="18" y2="5" stroke={color} strokeWidth="2" strokeDasharray="4,2"/></svg>
              : <div style={{ width: '10px', height: '10px', background: color, borderRadius: '2px' }} />
            }
            <span style={{ fontSize: '11px', color: '#6b7280' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
