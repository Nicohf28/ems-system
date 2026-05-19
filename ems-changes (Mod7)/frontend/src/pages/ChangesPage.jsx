import { useState } from 'react'
import ChangesForm from '../components/ChangesForm'
import ChangesTable from '../components/ChangesTable'
import UpdateModal from '../components/UpdateModal'
import { getChangesByProject } from '../services/api'

function ChangesPage() {
  const [projectId, setProjectId] = useState('')
  const [changes, setChanges] = useState([])
  const [searchError, setSearchError] = useState('')
  const [editingChange, setEditingChange] = useState(null)

  const fetchChanges = async () => {
    const pid = Number(projectId)
    if (!projectId || isNaN(pid) || pid <= 0) {
      setSearchError('Ingrese un ID de proyecto válido')
      return
    }
    setSearchError('')
    try {
      const result = await getChangesByProject(pid)
      if (result.success) {
        setChanges(result.data)
      }
    } catch {
      setSearchError('Error al obtener los cambios. Verifique que el backend esté corriendo.')
    }
  }

  const handleSaved = () => {
    if (projectId && Number(projectId) > 0) {
      fetchChanges()
    }
  }

  const handleUpdate = (change) => {
    setEditingChange(change)
  }

  const handleModalClose = () => {
    setEditingChange(null)
    handleSaved()
  }

  return (
    <div className="app">
      <nav className="navbar">
        <span className="navbar-brand">EMS</span>
        <h1 className="navbar-title">Equipo 7 — Gestión de Cambios</h1>
      </nav>

      <div className="content">
        <div className="search-bar">
          <input
            type="number"
            className="input-search"
            placeholder="ID del Proyecto"
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
            min="1"
            onKeyDown={e => e.key === 'Enter' && fetchChanges()}
          />
          <button onClick={fetchChanges} className="btn btn-primary">
            Buscar Cambios
          </button>
        </div>
        {searchError && <p className="error-msg">{searchError}</p>}

        <div className="main-layout">
          <ChangesForm onChangeSaved={handleSaved} />
          <ChangesTable
            changes={changes}
            onRefresh={fetchChanges}
            onUpdate={handleUpdate}
          />
        </div>
      </div>

      {editingChange && (
        <UpdateModal change={editingChange} onClose={handleModalClose} />
      )}
    </div>
  )
}

export default ChangesPage
