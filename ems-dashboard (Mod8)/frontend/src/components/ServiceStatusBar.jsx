/**
 * ServiceStatusBar.jsx — Estado de los 6 microservicios externos
 *
 * Muestra una pildora por cada servicio indicando si respondio correctamente
 * en la ultima llamada al dashboard:
 *   ok    → pildora verde
 *   error → pildora roja
 *
 * Props:
 *   servicesStatus {object} — { trazabilidad, calidad, cronograma, riesgos, costos, cambios }
 *                             cada clave: "ok" | "error"
 */

const SERVICE_LABELS = {
  trazabilidad: 'Trazabilidad :3001',
  calidad:      'Calidad :3002',
  cronograma:   'Cronograma :3003',
  riesgos:      'Riesgos :3004',
  costos:       'Costos :3005',
  cambios:      'Cambios :3006',
};

export default function ServiceStatusBar({ servicesStatus }) {
  const total  = Object.keys(servicesStatus).length;
  const online = Object.values(servicesStatus).filter(s => s === 'ok').length;

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '12px',
      padding: '16px 20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      marginBottom: '24px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ fontSize: '12px', fontWeight: '700', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Microservicios externos
        </div>
        <div style={{ fontSize: '12px', color: online === total ? '#16a34a' : '#f59e0b', fontWeight: '600' }}>
          {online}/{total} en linea
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {Object.entries(servicesStatus).map(([name, status]) => {
          const ok = status === 'ok';
          return (
            <div key={name} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              background: ok ? '#dcfce7' : '#fee2e2',
              borderRadius: '20px',
            }}>
              <span style={{
                width: '7px', height: '7px',
                borderRadius: '50%',
                background: ok ? '#16a34a' : '#dc2626',
                display: 'inline-block',
              }} />
              <span style={{
                fontSize: '12px',
                fontWeight: '600',
                color: ok ? '#15803d' : '#b91c1c',
              }}>
                {SERVICE_LABELS[name] ?? name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
