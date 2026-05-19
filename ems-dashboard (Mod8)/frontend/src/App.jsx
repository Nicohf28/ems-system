/**
 * App.jsx — Componente raíz de la aplicación (Grupo 8 — Dashboard de Valor)
 *
 * La aplicación es de página única (SPA); el único componente de nivel
 * superior es Dashboard. Si en el futuro se añade routing, aquí se monta.
 */
import Dashboard from './pages/Dashboard';

export default function App() {
  return <Dashboard />;
}
