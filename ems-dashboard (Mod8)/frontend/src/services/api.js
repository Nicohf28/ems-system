/**
 * api.js — Cliente HTTP hacia el backend del Dashboard (Grupo 8)
 *
 * Centraliza todas las llamadas al backend en puerto 3007.
 * Ante error de red o respuesta no-2xx, axios lanza una excepción
 * que los componentes deben capturar con try/catch.
 */
import axios from 'axios';

/** URL base del backend Grupo 8 */
const BASE_URL = 'http://localhost:3007';

/**
 * Obtiene el dashboard completo de rentabilidad para un proyecto.
 *
 * @param {string|number} projectId  - ID entero positivo del proyecto
 * @returns {Promise<{ success: boolean, data: DashboardData }>}
 * @throws {AxiosError} si el backend no responde o retorna error HTTP
 */
export async function getDashboard(projectId) {
  const response = await axios.get(`${BASE_URL}/dashboard/${projectId}`);
  return response.data;
}
