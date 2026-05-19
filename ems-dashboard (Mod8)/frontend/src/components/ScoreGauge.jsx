/**
 * ScoreGauge.jsx — Indicador semicircular del score global de rentabilidad
 *
 * Layout del SVG (viewBox 0 0 200 140):
 *   y=16  → titulo "SCORE GLOBAL"
 *   y=30  → tope del arco (CY=108, R=78)
 *   y=96  → numero del score (34px, centrado dentro del arco)
 *   y=115 → "/100" y etiquetas "0" / "100" de los extremos
 *   y=131 → etiqueta de estado (Rentable / En riesgo / No rentable)
 *   debajo del SVG → descripcion como HTML
 *
 * El arco va de angulo π (izquierda) a 2π (derecha) pasando por 3π/2 (tope).
 * largeArc siempre 0 — el arco de valor nunca supera los 180 grados.
 *
 * Props:
 *   score {number} — valor 0-100
 */

function scoreColor(s) {
  if (s >= 70) return '#16a34a';
  if (s >= 40) return '#f59e0b';
  return '#dc2626';
}

function scoreLabel(s) {
  if (s >= 70) return 'Rentable';
  if (s >= 40) return 'En riesgo';
  return 'No rentable';
}

export default function ScoreGauge({ score }) {
  const color = scoreColor(score);
  const label = scoreLabel(score);

  const CX = 100, CY = 108, R = 78;

  // endAngle = π + (score/100)·π → pasa por el tope (3π/2) con sweep=1
  const endAngle = Math.PI + (score / 100) * Math.PI;
  const x2 = +(CX + R * Math.cos(endAngle)).toFixed(2);
  const y2 = +(CY + R * Math.sin(endAngle)).toFixed(2);

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '12px',
      padding: '16px 12px 14px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <svg
        width="100%"
        viewBox="0 0 200 140"
        style={{ display: 'block', maxWidth: '230px' }}
      >
        {/* Titulo — por encima del arco (tope en y=30) */}
        <text
          x="100" y="16"
          textAnchor="middle"
          fontSize="10" fontWeight="700" fill="#6b7280"
          letterSpacing="0.08em"
        >
          SCORE GLOBAL
        </text>

        {/* Arco de fondo — semicirculo completo en gris */}
        <path
          d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
          fill="none" stroke="#e5e7eb" strokeWidth="14" strokeLinecap="round"
        />

        {/* Arco de valor — porcion coloreada (largeArc=0 siempre) */}
        {score > 0 && (
          <path
            d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${x2} ${y2}`}
            fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
          />
        )}

        {/* Score — centrado dentro del espacio del arco */}
        <text
          x="100" y="96"
          textAnchor="middle"
          fontSize="38" fontWeight="900" fill={color}
        >
          {score}
        </text>

        {/* Denominador y etiquetas de extremo — en la misma linea y=115 */}
        <text x="100" y="115" textAnchor="middle" fontSize="12" fill="#9ca3af">
          / 100
        </text>
        <text x="18"  y="115" textAnchor="middle" fontSize="9"  fill="#9ca3af">0</text>
        <text x="182" y="115" textAnchor="middle" fontSize="9"  fill="#9ca3af">100</text>

        {/* Estado — debajo del diametro */}
        <text
          x="100" y="131"
          textAnchor="middle"
          fontSize="13" fontWeight="700" fill={color}
        >
          {label}
        </text>
      </svg>

      {/* Descripcion como HTML para evitar desbordamiento del SVG */}
      <div style={{
        fontSize: '11px', color: '#9ca3af',
        textAlign: 'center', lineHeight: 1.4,
        marginTop: '6px', maxWidth: '160px',
      }}>
        Promedio ponderado de las 6 dimensiones
      </div>
    </div>
  );
}
