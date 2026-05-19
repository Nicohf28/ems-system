/**
 * DimensionsChart.jsx — Grafica de radar (araña) para las 6 dimensiones
 *
 * Muestra el score de cada dimension como un poligono sobre una cuadricula
 * hexagonal. Implementada con SVG puro (sin dependencias externas).
 * Permite ver de un vistazo que dimensiones tienen mayor/menor score y como
 * se compara la forma del proyecto contra la forma ideal (hexagono completo).
 *
 * Props:
 *   dimensions {object} — objeto con las 6 dimensiones del dashboard
 */

const DIM_ORDER  = ['alcance', 'progreso', 'costos', 'riesgos', 'cambios', 'calidad'];
const DIM_LABELS = {
  alcance:  'Alcance',
  progreso: 'Progreso',
  costos:   'Costos',
  riesgos:  'Riesgos',
  cambios:  'Cambios',
  calidad:  'Calidad',
};

const STATUS_COLOR = {
  ok:          '#16a34a',
  warning:     '#f59e0b',
  critical:    '#dc2626',
  unavailable: '#9ca3af',
};

// Geometria del radar
const CX = 150, CY = 128, R = 92, LABEL_R = 114;
const N = DIM_ORDER.length;

/** Angulo del eje i (empieza arriba, sentido horario) */
function axisAngle(i) {
  return -Math.PI / 2 + i * (2 * Math.PI / N);
}

/** Punto sobre el eje i a fraccion f del radio */
function axisPoint(i, f = 1) {
  const a = axisAngle(i);
  return {
    x: +(CX + R * f * Math.cos(a)).toFixed(2),
    y: +(CY + R * f * Math.sin(a)).toFixed(2),
  };
}

/** Convierte un array de {x,y} en un string de puntos para <polygon> */
function toPoints(pts) {
  return pts.map(p => `${p.x},${p.y}`).join(' ');
}

export default function DimensionsChart({ dimensions }) {
  // Poligono del score (si el servicio no responde, se usa 0)
  const scorePts = DIM_ORDER.map((name, i) => {
    const score = dimensions[name]?.score ?? 0;
    return axisPoint(i, score / 100);
  });

  // Cuadricula hexagonal en 3 niveles: 33%, 66%, 100%
  const gridLevels = [0.33, 0.66, 1];

  // Etiquetas de los ejes (posicionadas fuera del radio)
  const axisLabels = DIM_ORDER.map((name, i) => {
    const p = axisPoint(i, LABEL_R / R);
    // Alineacion horizontal segun posicion
    let anchor;
    if (Math.abs(p.x - CX) < 8) anchor = 'middle';
    else anchor = p.x > CX ? 'start' : 'end';
    return { name, x: p.x, y: p.y, anchor };
  });

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '12px',
      padding: '20px 24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      marginBottom: '24px',
    }}>
      <div style={{
        fontSize: '12px', fontWeight: '700', color: '#374151',
        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px',
      }}>
        Vista de radar — 6 dimensiones
      </div>
      <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '16px' }}>
        La forma ideal es el hexagono exterior (score 100 en todas las dimensiones).
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg
          width="100%"
          viewBox="0 0 300 265"
          style={{ display: 'block', maxWidth: '380px' }}
        >
          {/* ── Cuadricula hexagonal ── */}
          {gridLevels.map(f => (
            <polygon
              key={f}
              points={toPoints(DIM_ORDER.map((_, i) => axisPoint(i, f)))}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}

          {/* Etiquetas de porcentaje en la cuadricula (eje superior) */}
          {gridLevels.map(f => {
            const p = axisPoint(0, f);
            return (
              <text key={f} x={p.x + 4} y={p.y + 3} fontSize="8" fill="#9ca3af">
                {Math.round(f * 100)}
              </text>
            );
          })}

          {/* ── Lineas de eje ── */}
          {DIM_ORDER.map((_, i) => {
            const p = axisPoint(i);
            return (
              <line
                key={i}
                x1={CX} y1={CY}
                x2={p.x} y2={p.y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            );
          })}

          {/* ── Poligono del score (area) ── */}
          <polygon
            points={toPoints(scorePts)}
            fill="#3b82f6"
            fillOpacity="0.15"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* ── Puntos de cada dimension con color por status ── */}
          {DIM_ORDER.map((name, i) => {
            const dim    = dimensions[name];
            const score  = dim?.score ?? 0;
            const status = dim?.status ?? 'unavailable';
            const color  = STATUS_COLOR[status];
            const p      = axisPoint(i, score / 100);
            return (
              <circle
                key={name}
                cx={p.x}
                cy={p.y}
                r="5"
                fill={color}
                stroke="#ffffff"
                strokeWidth="2"
              />
            );
          })}

          {/* ── Etiquetas de dimension ── */}
          {axisLabels.map(({ name, x, y, anchor }) => {
            const dim    = dimensions[name];
            const score  = dim?.score;
            const status = dim?.status ?? 'unavailable';
            const color  = STATUS_COLOR[status];
            return (
              <g key={name}>
                <text
                  x={x} y={y - 3}
                  textAnchor={anchor}
                  fontSize="11"
                  fontWeight="700"
                  fill="#374151"
                >
                  {DIM_LABELS[name]}
                </text>
                <text
                  x={x} y={y + 10}
                  textAnchor={anchor}
                  fontSize="10"
                  fontWeight="600"
                  fill={color}
                >
                  {score !== null && score !== undefined ? score : '—'}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Leyenda */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { color: '#16a34a', label: 'OK' },
          { color: '#f59e0b', label: 'Advertencia' },
          { color: '#dc2626', label: 'Critico' },
          { color: '#9ca3af', label: 'Sin datos' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: color }} />
            <span style={{ fontSize: '11px', color: '#6b7280' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
