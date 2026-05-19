import React, { useState, useCallback } from 'react'
import TaskForm from '../components/TaskForm'
import api from '../services/api'
import './Tasks.css'

export default function Tasks() {
  const [projectId, setProjectId] = useState('')
  const [tasks, setTasks] = useState([])
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState(null)
  const [msg, setMsg] = useState(null)
  const [fetched, setFetched] = useState(false)

  const notify = (text, type = 'ok') => {
    setMsg({ text, type })
    setTimeout(() => setMsg(null), 3000)
  }

  const refresh = useCallback(async () => {
    if (!projectId || isNaN(Number(projectId))) return
    setLoading(true)
    try {
      const [tRes, pRes] = await Promise.all([
        api.getTasks(projectId),
        api.getProgress(projectId),
      ])
      setTasks(tRes.data.data)
      setProgress(pRes.data.data.progress)
      setFetched(true)
    } catch (err) {
      notify('Error al cargar tareas', 'err')
    } finally {
      setLoading(false)
    }
  }, [projectId])

  const handleCreate = async (data) => {
    try {
      await api.createTask(data)
      notify('Tarea creada ✓')
      refresh()
    } catch (err) {
      notify(err.response?.data?.message ?? 'Error al crear', 'err')
    }
  }

  const handleUpdate = async (data) => {
    try {
      await api.updateTask(editId, data)
      notify('Tarea actualizada ✓')
      setEditId(null)
      refresh()
    } catch (err) {
      notify(err.response?.data?.message ?? 'Error al actualizar', 'err')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta tarea?')) return
    try {
      await api.deleteTask(id)
      notify('Tarea eliminada')
      refresh()
    } catch {
      notify('Error al eliminar', 'err')
    }
  }

  const editTask = tasks.find(t => t.id === editId)

  return (
    <div className="tasks-page">
      {msg && <div className={`toast ${msg.type}`}>{msg.text}</div>}

      <div className="page-header">
        <div>
          <h1>Cronograma de Tareas</h1>
          <p style={{ color: 'var(--text2)', marginTop: 4 }}>Módulo 3 · Puerto 3003</p>
        </div>
        <div className="project-selector">
          <input
            type="number"
            placeholder="Project ID"
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
            style={{ width: 140 }}
          />
          <button className="btn btn-primary" onClick={refresh} disabled={loading}>
            {loading ? '...' : '⟳ Cargar'}
          </button>
        </div>
      </div>

      <TaskForm onSubmit={handleCreate} />

      {fetched && (
        <>
          {progress !== null && (
            <div className="card" style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700 }}>Progreso Global</span>
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <div className="card" style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ fontSize: 16 }}>Tareas ({tasks.length})</h2>
              <button className="btn btn-outline" onClick={refresh}>⟳ Actualizar</button>
            </div>

            {tasks.length === 0 ? (
              <p style={{ color: 'var(--text2)', textAlign: 'center', padding: '30px 0' }}>
                No hay tareas para este proyecto.
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tarea</th>
                    <th>Tipo</th>
                    <th>Días</th>
                    <th>Pesimista</th>
                    <th>Agresivo</th>
                    <th>Progreso</th>
                    <th>Deps</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(t => (
                    <tr key={t.id}>
                      <td style={{ color: 'var(--text2)' }}>#{t.id}</td>
                      <td>{t.task}</td>
                      <td><span className={`tag tag-${t.type}`}>{t.type}</span></td>
                      <td>{t.days}d</td>
                      <td style={{ color: 'var(--warn)' }}>{t.pessimistic}d</td>
                      <td style={{ color: 'var(--success)' }}>{t.aggressive}d</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="progress-bar" style={{ width: 60 }}>
                            <div className="progress-fill" style={{ width: `${t.progress}%` }} />
                          </div>
                          <span style={{ fontSize: 12, color: 'var(--text2)' }}>{t.progress}%</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text2)', fontSize: 12 }}>
                        {t.dependencies?.length ? t.dependencies.join(', ') : '—'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: 12 }}
                            onClick={() => setEditId(t.id)}>Editar</button>
                          <button className="btn btn-danger" style={{ padding: '4px 12px', fontSize: 12 }}
                            onClick={() => handleDelete(t.id)}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {editTask && (
        <div className="modal-backdrop" onClick={() => setEditId(null)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 680 }}>
            <TaskForm
              initial={{ ...editTask, dependencies: (editTask.dependencies || []).join(', ') }}
              onSubmit={handleUpdate}
              onCancel={() => setEditId(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
