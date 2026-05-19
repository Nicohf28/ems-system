
import { useState } from 'react';
import { createRequirement } from '../services/requirementService';

const validStatuses = ['pending', 'approved', 'rejected'];

function RequirementForm({ onRequirementCreated }) {

  const [formData, setFormData] = useState({
    projectId: '',
    title: '',
    description: '',
    status: 'pending'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {

    if (!formData.projectId) {
      return 'El projectId es obligatorio';
    }

    if (isNaN(formData.projectId)) {
      return 'El projectId debe ser numérico';
    }

    if (!formData.title.trim()) {
      return 'El título es obligatorio';
    }

    if (!validStatuses.includes(formData.status)) {
      return 'Estado inválido';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {

      setLoading(true);
      setError('');

      await createRequirement({
        projectId: Number(formData.projectId),
        title: formData.title,
        description: formData.description,
        status: formData.status
      });

      setFormData({
        projectId: '',
        title: '',
        description: '',
        status: 'pending'
      });

      if (onRequirementCreated) {
        onRequirementCreated();
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Error creando requisito');
    } finally {
      setLoading(false);   // ← debe estar aquí, no dentro del try
    }
  };

  return (

    <section className="card">

      {/* HEADER */}
      <div className="card-header">

        <div className="card-header-eyebrow">
          <span className="card-header-step">01</span>
          <span className="card-header-divider"></span>
          <span>Nuevo Registro</span>
        </div>

        <h2 className="card-title">
          Crear Requisito
        </h2>

        <p className="card-description">
          Registra requisitos funcionales y técnicos del proyecto
          para mantener trazabilidad completa entre alcance,
          desarrollo, validaciones y pruebas de calidad dentro
          del ecosistema EMS.
        </p>

      </div>

      {/* SEPARADOR VISUAL */}
      <div className="form-section-divider">
        <span className="form-section-label">Identificación del Proyecto</span>
      </div>

      {/* FORMULARIO */}
      <form
        className="form-grid"
        onSubmit={handleSubmit}
      >

        {/* PROJECT ID */}
        <div className="form-group">

          <label>
            <span className="label-icon">🗂</span>
            ID del Proyecto
          </label>

          <input
            type="number"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            placeholder="Ejemplo: 1"
          />

          <p className="input-helper">
            Identificador numérico del proyecto creado
            desde el módulo principal de integración EMS.
          </p>

        </div>

        {/* ESTADO */}
        <div className="form-group">

          <label>
            <span className="label-icon">🔖</span>
            Estado del Requisito
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pending">pending</option>
            <option value="approved">approved</option>
            <option value="rejected">rejected</option>
          </select>

          <p className="input-helper">
            Define el estado actual de validación
            y aprobación del requisito.
          </p>

        </div>

        {/* SEPARADOR VISUAL */}
        <div className="form-section-divider full-width">
          <span className="form-section-label">Detalle del Requisito</span>
        </div>

        {/* TITULO */}
        <div className="form-group full-width">

          <label>
            <span className="label-icon">✏️</span>
            Título del Requisito
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ejemplo: Acceso Seguro al Sistema"
          />

          <p className="input-helper">
            Utiliza un nombre claro y específico para
            facilitar la trazabilidad entre módulos.
          </p>

        </div>

        {/* DESCRIPCION */}
        <div className="form-group full-width">

          <label>
            <span className="label-icon">📋</span>
            Descripción Funcional
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe el comportamiento esperado del requisito, validaciones necesarias, restricciones y criterios funcionales."
          />

          <p className="input-helper">
            Esta descripción será utilizada para
            relacionar pruebas, validaciones de calidad
            y futuras auditorías de alcance.
          </p>

        </div>

        {/* ERROR */}
        {error && (
          <p className="error-message">
            ⚠️ {error}
          </p>
        )}

        {/* BOTON */}
        <button
          type="submit"
          disabled={loading}
          className="primary-button"
        >
          {loading
            ? '⏳ Guardando requisito...'
            : '💾 Guardar Requisito'}
        </button>

      </form>

    </section>
  );
}

export default RequirementForm;
