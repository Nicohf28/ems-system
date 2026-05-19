const styles = {
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    fontSize: '14px',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#a0a0b8',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
  },
  td: {
    padding: '14px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    color: '#d0d0e0',
    fontWeight: '500',
  },
  idCell: {
    color: '#7c3aed',
    fontWeight: '700',
    fontSize: '13px',
  },
  amountCell: {
    color: '#a78bfa',
    fontWeight: '700',
    fontFamily: "'Inter', monospace",
  },
  emptyRow: {
    textAlign: 'center',
    padding: '40px 16px',
    color: '#606080',
    fontSize: '13px',
    fontStyle: 'italic',
  },
};

function CostTable({ costs }) {
  return (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Concepto</th>
            <th style={{ ...styles.th, textAlign: 'right' }}>Monto</th>
          </tr>
        </thead>
        <tbody>
          {costs.length === 0 ? (
            <tr>
              <td colSpan="3" style={styles.emptyRow}>
                No hay costos registrados para este proyecto
              </td>
            </tr>
          ) : (
            costs.map((cost) => (
              <tr
                key={cost.id}
                style={{ transition: 'background 0.15s ease' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(124,58,237,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <td style={{ ...styles.td, ...styles.idCell }}>#{cost.id}</td>
                <td style={styles.td}>{cost.concept}</td>
                <td style={{ ...styles.td, ...styles.amountCell, textAlign: 'right' }}>
                  ${cost.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CostTable;
