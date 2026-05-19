import React, { useState } from 'react'

const TYPES = ['normal', 'critical', 'feeding']

export default function TaskForm({ tasks, onSubmit, onCancel, initial }) {
  const [form, setForm] = useState(initial ?? {
    projectId: '',
    task: '',
    days: '',
    progress: 0,
    pessimistic: '',
    aggressive: '',
    dependencies: '',
    type: 'normal',
  })
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (String(form.projectId).trim() === '') e.projectId = 'Requerido'
    else if (isNaN(Number(form.projectId))) e.projectId = 'Debe ser numérico'
    if (!form.task.trim()) e.task = 'Requerido'
    if (form.days === '' || isNaN(Number(form.days))) e.days = 'Requerido y numérico'
    else if (Number(form.days) <= 0) e.days = 'Debe ser mayor a 0'
    if (form.progress !== '' && (isNaN(Number(form.progress)) || Number(form.progress) < 0 || Number(form.progress) > 100))
      e.progress = 'Entre 0 y 100'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const deps = form.dependencies
      ? form.dependencies.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n) && n > 0)
      : []
    onSubmit({
      projectId: Number(form.projectId),
      task: form.task.trim(),
      days: Number(form.days),
      progress: Number(form.progress) || 0,
      pessimistic: form.pessimistic !== '' ? Number(form.pessimistic) : Number(form.days),
      aggressive: form.aggressive !== '' ? Number(form.aggressive) : Math.ceil(Number(form.days) * 0.5),
      dependencies: deps,
      type: form.type,
    })
  }

  const f = (k) => ({
    value: form[k],
    onChange: e => set(k, e.target.value),
    className: errors[k] ? 'error' : '',
  })

  return (
    <div className="task-form card">
      <h3 style={{ marginBottom: 18, fontFamily: 'var(--font-head)', color: 'var(--accent)' }}>
        {initial ? 'Editar Tarea' : 'Nueva Tarea'}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
        <div className="field">
          <label>Project ID *</label>
          <input type="number" placeholder="1" {...f('projectId')} />
          {errors.projectId && <div className="error-msg">{errors.projectId}</div>}
        </div>
        <div className="field">
          <label>Tipo</label>
          <select value={form.type} onChange={e => set('type', e.target.value)}>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="field" style={{ gridColumn: '1/-1' }}>
          <label>Nombre de la tarea *</label>
          <input type="text" placeholder="Diseñar frontend" {...f('task')} />
          {errors.task && <div className="error-msg">{errors.task}</div>}
        </div>
        <div className="field">
          <label>Días (estimado normal) *</label>
          <input type="number" min="1" placeholder="5" {...f('days')} />
          {errors.days && <div className="error-msg">{errors.days}</div>}
        </div>
        <div className="field">
          <label>Progreso % (0–100)</label>
          <input type="number" min="0" max="100" placeholder="0" {...f('progress')} />
          {errors.progress && <div className="error-msg">{errors.progress}</div>}
        </div>
        <div className="field">
          <label>Días pesimistas (CCM) *</label>
          <input type="number" min="1" placeholder="8" {...f('pessimistic')} />
        </div>
        <div className="field">
          <label>Días agresivos 50% (CCM)</label>
          <input type="number" min="1" placeholder="auto" {...f('aggressive')} />
        </div>
        <div className="field" style={{ gridColumn: '1/-1' }}>
          <label>Dependencias (IDs separados por coma)</label>
          <input type="text" placeholder="1, 2, 3" {...f('dependencies')} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <button className="btn btn-primary" onClick={handleSubmit}>
          {initial ? '💾 Guardar Cambios' : '+ Agregar Tarea'}
        </button>
        {onCancel && <button className="btn btn-outline" onClick={onCancel}>Cancelar</button>}
      </div>
    </div>
  )
}
