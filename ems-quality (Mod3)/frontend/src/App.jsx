import { useState } from "react";

import api from "./services/api";

import QualityForm from "./components/QualityForm";
import QualityTable from "./components/QualityTable";

import "./styles.css";

function App() {
  const [reviews, setReviews] = useState([]);
  const [projectId, setProjectId] = useState("");

  const loadReviews = async () => {
    if (!projectId) {
      alert("Ingrese un projectId");
      return;
    }

    try {
      const response = await api.get(
        `/quality/${projectId}`
      );

      setReviews(response.data.data);
    } catch (error) {
      console.error(error);

      alert("Error cargando revisiones");
    }
  };

  return (
    <div className="container">
      <h1 className="title">
        EMS - Módulo Calidad
      </h1>

      <div className="card">
        <QualityForm
          onReviewCreated={loadReviews}
        />
      </div>

      <div className="card">
        <h2>Consultar revisiones</h2>

        <div className="search-section">
          <input
            type="number"
            placeholder="Project ID"
            value={projectId}
            onChange={(e) =>
              setProjectId(e.target.value)
            }
          />

          <button onClick={loadReviews}>
            Refrescar
          </button>
        </div>
      </div>

      <div className="card table-container">
        <QualityTable reviews={reviews} />
      </div>
    </div>
  );
}

export default App;