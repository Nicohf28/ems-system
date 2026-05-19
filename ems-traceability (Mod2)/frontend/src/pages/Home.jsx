
import RequirementForm from '../components/RequirementForm';
import RequirementTable from '../components/RequirementTable';

function Home() {
  return (
    <div className="app-layout">

      {/* HEADER PRINCIPAL */}
      <header className="navbar">

        <div className="navbar-content">

          <div>
            <p className="system-badge">
              <span className="badge-dot"></span>
              EMS · Engineering Management System
            </p>

            <h1>
              Gestión de Alcance<br />
              <span className="navbar-title-accent">y Trazabilidad</span>
            </h1>

            <p className="navbar-description">
              Control centralizado de requisitos, trazabilidad funcional,
              vinculación de validaciones y prevención automática de
              desviaciones de alcance (Scope Creep).
            </p>
          </div>

          <div className="traceability-status">
            <div className="status-indicator"></div>
            <span>Sistema Activo</span>
          </div>

        </div>

      </header>

      {/* CARRUSEL INFORMATIVO */}
      <section className="hero-carousel">

        <div className="hero-track">

          <div className="hero-slide">
            <div className="hero-icon">📌</div>
            <div className="hero-slide-tag">RTM Engine</div>
            <h3>Motor de Vinculación RTM</h3>
            <p>
              Relaciona automáticamente cada requisito con sus pruebas y procesos asociados,
              permitiendo control claro del ciclo de vida del proyecto.
            </p>
          </div>

          <div className="hero-slide">
            <div className="hero-icon">⚠️</div>
            <div className="hero-slide-tag">Scope Control</div>
            <h3>Detector de Scope Creep</h3>
            <p>
              Detecta cambios no autorizados para evitar desviaciones del alcance del proyecto.
            </p>
          </div>

          <div className="hero-slide">
            <div className="hero-icon">🔗</div>
            <div className="hero-slide-tag">Integration</div>
            <h3>Integración EMS</h3>
            <p>
              Centraliza tiempos, costos, calidad, riesgos y avances del proyecto en un solo sistema.
            </p>
          </div>

        </div>

      </section>

      {/* DASHBOARD */}
      <div className="dashboard-grid">

        <RequirementForm />

        <RequirementTable />

      </div>

    </div>
  );
}

export default Home;
