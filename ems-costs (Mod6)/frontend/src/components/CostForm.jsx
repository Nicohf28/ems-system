import { useState } from 'react';
import { createCost } from '../services/api.js';

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#a0a0b8',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.06)',
    color: '#fff',
    fontSize: '14px',
    fontFamily: "'Inter', sans-serif",
    fontWeight: '500',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  },
  inputFocus: {
    borderColor: 'rgba(124,58,237,0.5)',
    background: 'rgba(124,58,237,0.08)',
    boxShadow: '0 0 0 3px rgba(124,58,237,0.15)',
  },
  button: {
    width: '100%',
    padding: '13px 20px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '700',
    fontFamily: "'Inter', sans-serif",
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
    marginTop: '4px',
    letterSpacing: '0.3px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
};

function CostForm({ onCostCreated, onError, setCurrentProjectId }) {
  const [projectId, setProjectId] = useState('');
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedConcept = concept.trim();

    if (!projectId || !trimmedConcept || !amount) {
      onError('Todos los campos son obligatorios');
      return;
    }

    const parsedProjectId = Number(projectId);
    if (isNaN(parsedProjectId) || parsedProjectId <= 0 || !Number.isInteger(parsedProjectId)) {
      onError('projectId debe ser un número entero positivo');
      return;
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      onError('amount debe ser un número mayor a 0');
      return;
    }

    setLoading(true);
    try {
      const response = await createCost({
        projectId: parsedProjectId,
        concept: trimmedConcept,
        amount: parsedAmount,
      });

      if (response.success) {
        setCurrentProjectId(parsedProjectId);
        onCostCreated(parsedProjectId);
        setConcept('');
        setAmount('');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        onError(error.response.data.message);
      } else {
        onError('Error de red: no se pudo conectar con el servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (field) => ({
    ...styles.input,
    ...(focusedField === field ? styles.inputFocus : {}),
  });

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <div style={styles.fieldGroup}>
        <label htmlFor="input-projectId" style={styles.label}>
          Project ID
        </label>
        <input
          id="input-projectId"
          type="number"
          placeholder="Ej: 1"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          onFocus={() => setFocusedField('projectId')}
          onBlur={() => setFocusedField('')}
          style={getInputStyle('projectId')}
          min="1"
          step="1"
        />
      </div>

      <div style={styles.fieldGroup}>
        <label htmlFor="input-concept" style={styles.label}>
          Concepto
        </label>
        <input
          id="input-concept"
          type="text"
          placeholder="Ej: Frontend"
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          onFocus={() => setFocusedField('concept')}
          onBlur={() => setFocusedField('')}
          style={getInputStyle('concept')}
        />
      </div>

      <div style={styles.fieldGroup}>
        <label htmlFor="input-amount" style={styles.label}>
          Monto
        </label>
        <input
          id="input-amount"
          type="number"
          placeholder="Ej: 500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onFocus={() => setFocusedField('amount')}
          onBlur={() => setFocusedField('')}
          style={getInputStyle('amount')}
          min="0.01"
          step="0.01"
        />
      </div>

      <button
        id="btn-guardar"
        type="submit"
        style={{
          ...styles.button,
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
        disabled={loading}
        onMouseEnter={(e) => {
          if (!loading) {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 6px 28px rgba(124,58,237,0.5)';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 20px rgba(124,58,237,0.35)';
        }}
      >
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}

export default CostForm;
