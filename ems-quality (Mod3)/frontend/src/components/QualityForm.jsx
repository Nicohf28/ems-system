import { useState } from "react";

import api from "../services/api";

function QualityForm({ onReviewCreated }) {
  const [formData, setFormData] = useState({
    projectId: "",
    requirementId: "",
    status: "approved",
    comment: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (
      !formData.projectId ||
      !formData.requirementId ||
      !formData.status
    ) {
      setMessage(
        "Todos los campos obligatorios deben llenarse"
      );
      return;
    }

    try {
      const payload = {
        projectId: Number(formData.projectId),
        requirementId: Number(formData.requirementId),
        status: formData.status,
        comment: formData.comment
      };

      await api.post("/quality", payload);

      setMessage(
        "Revisión guardada correctamente"
      );

      onReviewCreated(payload.projectId);

      setFormData({
        projectId: "",
        requirementId: "",
        status: "approved",
        comment: ""
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Error al guardar"
      );
    }
  };

  return (
    <div>
      <h2>
        Registrar revisión de calidad
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Project ID</label>

          <input
            type="number"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Requirement ID</label>

          <input
            type="number"
            name="requirementId"
            value={formData.requirementId}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Status</label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="approved">
              approved
            </option>

            <option value="rejected">
              rejected
            </option>
          </select>
        </div>

        <div className="form-group">
          <label>Comentario</label>

          <textarea
            name="comment"
            rows="4"
            value={formData.comment}
            onChange={handleChange}
          />
        </div>

        <button type="submit">
          Guardar
        </button>

        {message && (
          <p className="message">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default QualityForm;