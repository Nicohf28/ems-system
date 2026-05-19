import { useState, useCallback } from 'react';
import CostForm from '../components/CostForm.jsx';
import CostTable from '../components/CostTable.jsx';
import { getCostsByProjectId, getTotalByProjectId } from '../services/api.js';

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    fontFamily: "'Inter', sans-serif",
    color: '#e0e0e0',
    padding: '0',
    margin: '0',
  },
  header: {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    padding: '20px 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  logoIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '800',
    color: '#fff',
    boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#fff',
    letterSpacing: '-0.5px',
  },
  badge: {
    background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '600',
    padding: '6px 14px',
    borderRadius: '20px',
    letterSpacing: '0.5px',
  },
  container: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '40px 24px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '8px',
    letterSpacing: '-1px',
  },
  subtitle: {
    fontSize: '15px',
    color: '#a0a0b8',
    marginBottom: '36px',
    fontWeight: '400',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.6fr',
    gap: '28px',
    alignItems: 'start',
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '28px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  totalCard: {
    background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(167,139,250,0.1))',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(124,58,237,0.3)',
    borderRadius: '16px',
    padding: '24px 28px',
    marginTop: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#c4b5fd',
  },
  totalAmount: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#a78bfa',
    letterSpacing: '-1px',
  },
  message: {
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  successMsg: {
    background: 'rgba(34,197,94,0.12)',
    border: '1px solid rgba(34,197,94,0.25)',
    color: '#4ade80',
  },
  errorMsg: {
    background: 'rgba(239,68,68,0.12)',
    border: '1px solid rgba(239,68,68,0.25)',
    color: '#f87171',
  },
  refreshRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '16px',
  },
  refreshBtn: {
    flex: 1,
    padding: '10px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: '#c4b5fd',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

function Dashboard() {
  const [costs, setCosts] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [currentProjectId, setCurrentProjectId] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchCosts = useCallback(async (projectId) => {
    if (!projectId) return;
    try {
      const costsResponse = await getCostsByProjectId(projectId);
      if (costsResponse.success) {
        setCosts(costsResponse.data);
      }
      const totalResponse = await getTotalByProjectId(projectId);
      if (totalResponse.success) {
        setTotalCost(totalResponse.data.totalCost);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        showMessage(error.response.data.message, 'error');
      } else {
        showMessage('Error de red: no se pudo conectar con el servidor', 'error');
      }
    }
  }, []);

  const handleCostCreated = (projectId) => {
    setCurrentProjectId(projectId);
    fetchCosts(projectId);
    showMessage('Costo registrado exitosamente', 'success');
  };

  const handleRefresh = () => {
    if (currentProjectId) {
      fetchCosts(currentProjectId);
      showMessage('Datos actualizados', 'success');
    } else {
      showMessage('Ingrese un projectId en el formulario primero', 'error');
    }
  };

  const handleUpdate = () => {
    if (currentProjectId) {
      fetchCosts(currentProjectId);
      showMessage('Datos actualizados', 'success');
    } else {
      showMessage('Ingrese un projectId en el formulario primero', 'error');
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>E</div>
          <span style={styles.logoText}>EMS - Costos</span>
        </div>
        <span style={styles.badge}>Equipo 6</span>
      </header>

      <main style={styles.container}>
        <h1 style={styles.title}>EMS - Costos (Equipo 6)</h1>
        <p style={styles.subtitle}>
          Registra y consulta los costos asociados a cada proyecto del sistema EMS.
        </p>

        {message && (
          <div
            style={{
              ...styles.message,
              ...(messageType === 'success' ? styles.successMsg : styles.errorMsg),
            }}
          >
            {messageType === 'success' ? '✓' : '✕'} {message}
          </div>
        )}

        <div style={styles.grid}>
          <div>
            <div style={styles.card}>
              <div style={styles.cardTitle}>📋 Registrar Costo</div>
              <CostForm
                onCostCreated={handleCostCreated}
                onError={(msg) => showMessage(msg, 'error')}
                setCurrentProjectId={setCurrentProjectId}
              />
            </div>

            <div style={styles.totalCard}>
              <span style={styles.totalLabel}>Total del Proyecto {currentProjectId || '—'}</span>
              <span style={styles.totalAmount}>
                ${typeof totalCost === 'number' ? totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
              </span>
            </div>
          </div>

          <div>
            <div style={styles.card}>
              <div style={styles.cardTitle}>📊 Costos del Proyecto</div>
              <div style={styles.refreshRow}>
                <button
                  id="btn-refrescar"
                  style={styles.refreshBtn}
                  onClick={handleRefresh}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(124,58,237,0.2)';
                    e.target.style.borderColor = 'rgba(124,58,237,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.06)';
                    e.target.style.borderColor = 'rgba(255,255,255,0.12)';
                  }}
                >
                  Refrescar
                </button>
                <button
                  id="btn-actualizar"
                  style={styles.refreshBtn}
                  onClick={handleUpdate}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(124,58,237,0.2)';
                    e.target.style.borderColor = 'rgba(124,58,237,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.06)';
                    e.target.style.borderColor = 'rgba(255,255,255,0.12)';
                  }}
                >
                  Actualizar
                </button>
              </div>
              <CostTable costs={costs} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
