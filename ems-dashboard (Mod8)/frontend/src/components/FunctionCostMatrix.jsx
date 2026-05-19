/**
 * FunctionCostMatrix.jsx — Matriz Funcion/Costo (cuadrante valor vs costo)
 *
 * Scatter plot SVG que clasifica cada requisito del proyecto en uno de
 * cuatro cuadrantes segun su valor institucional y su costo estimado:
 *
 *   Alto valor + bajo costo  → MANTENER  (verde)   esquina superior-izquierda
 *   Alto valor + alto costo  → OPTIMIZAR (ambar)    esquina superior-derecha
 *   Bajo valor + bajo costo  → EVALUAR   (gris)     esquina inferior-izquierda
 *   Bajo valor + alto costo  → ELIMINAR  (rojo)     esquina inferior-derecha
 *
 * Umbral horizontal (valor): 60/100
 * Umbral vertical (costo): promedio del costo estimado entre todos los requisitos
 *
 * Debajo del grafico se muestra una tabla con el detalle de cada requisito.
 *
 * Props:
 *   matrix {Array} — resultado de lcaService.computeFunctionCostMatrix()
 */

const VERDICT_COLOR = {
  MANTENER:  '#16a34a',
  OPTIMIZAR: '#f59e0b',
  EVALUAR:   '#6b7280',
  ELIMINAR:  '#dc2626',
};

const VERDICT_BG = {
  MANTENER:  '#f0fdf420',
  OPTIMIZAR: '#fffbeb20',
  EVALUAR:   '#f9fafb',
  ELIMINAR:  '#fef2f220',
};

const STATUS_LABEL = {
  approved:     'Aprobado',
  rejected:     'Rechazado',
  pending:      'Pendiente',
  sin_revision: 'Sin revision',
};

function fmt(n) { return `$${n.toLocaleString('es-CO')}`; }

export default function FunctionCostMatrix({ matrix }) {
  if (!matrix || matrix.length === 0) {
    return (
      <div style={{
        background: '#ffffff', borderRadius: '12px', padding: '20px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px',
        color: '#9ca3af', textAlign: 'center', fontSize: '13px',
      }}>
        Matriz Funcion/Costo no disponible — se requiere el servicio de trazabilidad y costos.
      </div>
    );
  }

  // ── Dimensiones del SVG ───────────────────────────────────────────────────
  const ML = 60, MR = 16, MT = 16, MB = 44;
  const W  = 460, H = 280;
  const PW = W - ML - MR;
  const PH = H - MT - MB;

  const maxValue   = 100;
  const maxCost    = Math.max(...matrix.map(i => i.estimatedCost)) * 1.15;
  const avgCost    = matrix[0]?.avgCost ?? 0;
  const valueThreshold = 60;

  function toX(v)  { return ML + (v / maxValue) * PW; }
  function toY(c)  { return MT + PH - (c / maxCost) * PH; }

  // Posicion de las lineas divisorias de cuadrante
  const xDiv = toX(valueThreshold);
  const yDiv = toY(avgCost);

  // Etiquetas eje Y (5 niveles)
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => ({
    v: Math.round(maxCost * f),
    y: toY(maxCost * f),
  }));

  // Resumen por cuadrante
  const summary = ['MANTENER', 'OPTIMIZAR', 'EVALUAR', 'ELIMINAR'].map(v => ({
    verdict: v,
    count: matrix.filter(i => i.verdict === v).length,
    color: VERDICT_COLOR[v],
  }));

  return (
    <div style={{
      background: '#ffffff', borderRadius: '12px',
      padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      marginBottom: '24px',
    }}>
      {/* Encabezado */}
      <div style={{ marginBottom: '4px', fontSize: '12px', fontWeight: '700', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Matriz Funcion / Costo
      </div>
      <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '16px' }}>
        Valor institucional (eje X) vs Costo estimado (eje Y). Umbral de valor: 60/100. Umbral de costo: promedio del proyecto.
      </div>

      {/* Resumen de cuadrantes */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {summary.map(({ verdict, count, color }) => (
          <div key={verdict} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '5px 12px', background: '#f9fafb',
            borderRadius: '20px', border: `1px solid ${color}30`,
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
            <span style={{ fontSize: '12px', fontWeight: '700', color }}>{verdict}</span>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>{count}</span>
          </div>
        ))}
      </div>

      {/* Scatter plot SVG */}
      <div style={{ overflowX: 'auto' }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', minWidth: '340px' }}>

          {/* Fondos de cuadrante */}
          <rect x={ML}   y={MT}   width={xDiv - ML}     height={yDiv - MT}    fill="#f0fdf4" opacity="0.6" />
          <rect x={xDiv} y={MT}   width={W - MR - xDiv} height={yDiv - MT}    fill="#fffbeb" opacity="0.6" />
          <rect x={ML}   y={yDiv} width={xDiv - ML}     height={H - MB - yDiv} fill="#f9fafb" opacity="0.9" />
          <rect x={xDiv} y={yDiv} width={W - MR - xDiv} height={H - MB - yDiv} fill="#fef2f2" opacity="0.6" />

          {/* Lineas de cuadrante */}
          <line x1={xDiv} y1={MT}      x2={xDiv} y2={H - MB} stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5,3" />
          <line x1={ML}   y1={yDiv}    x2={W - MR} y2={yDiv} stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5,3" />

          {/* Etiquetas de cuadrante */}
          {[
            { x: ML + 8,   y: MT + 14, label: 'MANTENER',  color: VERDICT_COLOR.MANTENER  },
            { x: xDiv + 8, y: MT + 14, label: 'OPTIMIZAR', color: VERDICT_COLOR.OPTIMIZAR },
            { x: ML + 8,   y: yDiv + 14, label: 'EVALUAR', color: VERDICT_COLOR.EVALUAR   },
            { x: xDiv + 8, y: yDiv + 14, label: 'ELIMINAR',color: VERDICT_COLOR.ELIMINAR  },
          ].map(({ x, y, label, color }) => (
            <text key={label} x={x} y={y} fontSize="9" fontWeight="700" fill={color} opacity="0.7">
              {label}
            </text>
          ))}

          {/* Lineas de referencia Y */}
          {yTicks.map(({ v, y }) => (
            <g key={v}>
              <line x1={ML} y1={y} x2={W - MR} y2={y} stroke="#f1f5f9" strokeWidth="1" />
              <text x={ML - 4} y={y + 4} textAnchor="end" fontSize="8" fill="#94a3b8">
                {v === 0 ? '0' : `$${(v / 1000).toFixed(1)}k`}
              </text>
            </g>
          ))}

          {/* Etiquetas eje X */}
          {[0, 20, 40, 60, 80, 100].map(v => (
            <g key={v}>
              <line x1={toX(v)} y1={MT} x2={toX(v)} y2={H - MB} stroke="#f1f5f9" strokeWidth="1" />
              <text x={toX(v)} y={H - MB + 12} textAnchor="middle" fontSize="9" fill="#94a3b8">{v}</text>
            </g>
          ))}

          {/* Puntos de cada requisito */}
          {matrix.map(item => {
            const cx = toX(item.institutionalValue);
            const cy = toY(item.estimatedCost);
            const color = VERDICT_COLOR[item.verdict];
            return (
              <g key={item.id}>
                <circle cx={cx} cy={cy} r="7" fill={color} opacity="0.85" stroke="#fff" strokeWidth="1.5" />
                <text x={cx} y={cy + 4} textAnchor="middle" fontSize="8" fontWeight="700" fill="#ffffff">
                  {item.id}
                </text>
              </g>
            );
          })}

          {/* Etiqueta eje X */}
          <text x={ML + PW / 2} y={H - 4} textAnchor="middle" fontSize="9" fill="#6b7280" fontWeight="600">
            Valor Institucional (0-100)
          </text>
          {/* Etiqueta eje Y */}
          <text
            x={10} y={MT + PH / 2}
            textAnchor="middle" fontSize="9" fill="#6b7280" fontWeight="600"
            transform={`rotate(-90, 10, ${MT + PH / 2})`}
          >
            Costo Estimado ($)
          </text>
        </svg>
      </div>

      {/* Tabla de detalle */}
      <div style={{ marginTop: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              {['#', 'Funcionalidad', 'Estado req.', 'Revision QA', 'Valor inst.', 'Costo est.', 'Veredicto'].map(h => (
                <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: '#6b7280', fontWeight: '700', fontSize: '11px', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((item, idx) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                <td style={{ padding: '7px 10px', color: '#9ca3af', fontWeight: '600' }}>{item.id}</td>
                <td style={{ padding: '7px 10px', color: '#111827', fontWeight: '500' }}>{item.title}</td>
                <td style={{ padding: '7px 10px' }}>
                  <span style={{
                    fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '12px',
                    background: item.requirementStatus === 'approved' ? '#dcfce7' : item.requirementStatus === 'rejected' ? '#fee2e2' : '#f3f4f6',
                    color:      item.requirementStatus === 'approved' ? '#15803d' : item.requirementStatus === 'rejected' ? '#b91c1c' : '#6b7280',
                  }}>
                    {STATUS_LABEL[item.requirementStatus] ?? item.requirementStatus}
                  </span>
                </td>
                <td style={{ padding: '7px 10px' }}>
                  <span style={{
                    fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '12px',
                    background: item.qualityStatus === 'approved' ? '#dcfce7' : item.qualityStatus === 'rejected' ? '#fee2e2' : '#f3f4f6',
                    color:      item.qualityStatus === 'approved' ? '#15803d' : item.qualityStatus === 'rejected' ? '#b91c1c' : '#6b7280',
                  }}>
                    {STATUS_LABEL[item.qualityStatus] ?? item.qualityStatus}
                  </span>
                </td>
                <td style={{ padding: '7px 10px', fontWeight: '700', color: '#374151' }}>{item.institutionalValue}</td>
                <td style={{ padding: '7px 10px', color: '#374151' }}>{fmt(item.estimatedCost)}</td>
                <td style={{ padding: '7px 10px' }}>
                  <span style={{
                    fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px',
                    background: VERDICT_COLOR[item.verdict] + '20',
                    color: VERDICT_COLOR[item.verdict],
                  }}>
                    {item.verdict}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
