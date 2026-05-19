import { useState } from 'react'
import { createChange } from '../services/api'

const VALID_STATUSES = ['pending', 'approved', 'rejected']
const VALID_IMPACTS = ['low', 'medium', 'high']

function ChangesForm({ onChangeSaved }) {
  const [form, setForm] = useState({
    projectId: '',
    change: '',
    impact: 'medium',
    status: 'pending'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  const validate = () => {
    if (!form.projectId || !form.change.trim()) {
      return 'Todos los campos son obligatorios'
    }
    const pid = Number(form.projectId)
    if (isNaN(pid) || pid <= 0) {
      return 'El ID del proyecto debe ser un número positivo'
    }
    if (!VALID_STATUSES.includes(form.status)) {
      return `Estado inválido. Use: ${VALID_STATUSES.join(', ')}`
    }
    if (!VALID_IMPACTS.includes(form.impact)) {
      return `Impacto inválido. Use: ${VALID_IMPACTS.join(', ')}`
    }
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
    setError('')
    try {
      await createChange({
        projectId: Number(form.projectId),
        change: form.change.trim(),
        impact: form.impact,
        status: form.status
      })
      setSuccess('Cambio guardado exitosamente')
      setForm({ projectId: '', change: '', impact: 'medium', status: 'pending' })
      onChangeSaved()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el cambio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="card-title">Registrar Cambio</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>ID Proyecto *</label>
          <input
            type="number"
            name="projectId"
            value={form.projectId}
            onChange={handleChange}
            placeholder="Ej: 1"
            min="1"
            className="input"
          />
        </div>

        <div className="form-group">
          <label>Descripción del Cambio *</label>
          <input
            type="text"
            name="change"
            value={form.change}
            onChange={handleChange}
            placeholder="Ej: Agregar reportes"
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
        {success && <p className="success-msg">{success}</p>}

        <button type="submit" disabled={loading} className="btn btn-success">
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </div>
  )
}

export default ChangesForm
