import { useState } from "react";
import api from "../services/api";

function ProjectForm() {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (event) => {

    event.preventDefault();

    try {

      await api.post("/projects", {
        name,
        description
      });

      alert("Proyecto creado");

      setName("");
      setDescription("");

      window.location.reload();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Error al crear proyecto"
      );

    }
  };

  return (
    <div className="card">

      <h2>Crear Proyecto</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Nombre del proyecto"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <button type="submit">
          Crear Proyecto
        </button>

      </form>

    </div>
  );
}

export default ProjectForm;