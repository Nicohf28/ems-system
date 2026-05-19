import { useState } from 'react'
import { updateChange } from '../services/api'

const VALID_STATUSES = ['pending', 'approved', 'rejected']
const VALID_IMPACTS = ['low', 'medium', 'high']

function UpdateModal({ change, onClose }) {
  const [form, setForm] = useState({
    change: change.change,
    impact: change.impact,
    status: change.status
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const validate = () => {
    if (!form.change.trim()) return 'El campo cambio no puede estar vacío'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setLoading(true)
    try {
      await updateChange(change.id, {
        change: form.change.trim(),
        impact: form.impact,
        status: form.status
      })
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el cambio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Actualizar Cambio #{change.id}</h2>
          <button onClick={onClose} className="btn-close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Descripción del Cambio *</label>
            <input
              type="text"
              name="change"
              value={form.change}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="form-group">
            <label>Impacto *</label>
            <select name="impact" value={form.impact} onChange={handleChange} className="input">
              {VALID_IMPACTS.map(i => (
                <option key={i} value={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Estado *</label>
            <select name="status" value={form.status} onChange={handleChange} className="input">
              {VALID_STATUSES.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn btn-success modal-save">
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateModal
