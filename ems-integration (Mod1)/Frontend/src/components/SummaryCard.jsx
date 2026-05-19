function SummaryCard() {

  const modules = [
    {
      name: "Trazabilidad",
      url: "http://localhost:5174/",
    },
    {
      name: "Calidad",
      url: "http://localhost:5175/",
    },
    {
      name: "Cronograma",
      url: "http://localhost:5176/",
    },
    {
      name: "Riesgos",
      url: "http://localhost:5177/",
    },
    {
      name: "Costos",
      url: "http://localhost:5178/",
    },
    {
      name: "Cambios",
      url: "http://localhost:5179/",
    },
    {
      name: "Dashboard Ejecutivo",
      url: "http://localhost:5180/",
    },
  ];

  return (
    <div className="summary">

      <h2>Módulos del Sistema EMS</h2>

      <div className="summary-grid">

        {modules.map((module, index) => (

          <button
            key={index}
            className="module-button"
            onClick={() => window.location.href = module.url}
          >
            {module.name}
          </button>

        ))}

      </div>

    </div>
  );
}

export default SummaryCard;