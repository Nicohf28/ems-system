/**
 * aggregator.service.js — Capa de integración con los microservicios externos
 *
 * Responsabilidad: llamar en paralelo los 6 endpoints del EMS y normalizar
 * el resultado en un objeto homogéneo { ok, data } por servicio.
 *
 * Estrategia de resiliencia:
 *   - Promise.allSettled garantiza que un fallo parcial no aborta el proceso.
 *   - Timeout de 5 s por servicio para no bloquear indefinidamente.
 *   - Si un servicio falla (red, timeout, respuesta sin success:true) se
 *     registra el error en consola y se retorna { ok: false, data: null }.
 *
 * Contratos consumidos:
 *   :3001 GET /requirements/:id  → { success, data: [ { id, status, ... } ] }
 *   :3002 GET /quality/:id       → { success, data: [ { requirementId, status } ] }
 *   :3003 GET /schedule/:id/progress → { success, data: { progress } }
 *   :3004 GET /risks/:id         → { success, data: [ { id, severity, status } ] }
 *   :3005 GET /costs/:id/total   → { success, data: { totalCost } }
 *   :3006 GET /changes/:id       → { success, data: [ { id, impact, status } ] }
 */
const axios = require('axios');

/** URLs base de cada microservicio del EMS */
const SERVICES = {
  trazabilidad: 'http://localhost:3001',
  calidad:      'http://localhost:3002',
  cronograma:   'http://localhost:3003',
  riesgos:      'http://localhost:3004',
  costos:       'http://localhost:3005',
  cambios:      'http://localhost:3006',
};

/** Tiempo máximo de espera por servicio antes de considerarlo no disponible */
const TIMEOUT_MS = 5000;

/**
 * Llama los 6 microservicios en paralelo con Promise.allSettled.
 * Nunca lanza excepción aunque fallen todos.
 *
 * @param {number} projectId
 * @returns {Promise<Record<string, { ok: boolean, data: any }>>}
 */
async function fetchAll(projectId) {
  const [reqRes, qualRes, schedRes, riskRes, costRes, changeRes] =
    await Promise.allSettled([
      axios.get(`${SERVICES.trazabilidad}/requirements/${projectId}`,      { timeout: TIMEOUT_MS }),
      axios.get(`${SERVICES.calidad}/quality/${projectId}`,                { timeout: TIMEOUT_MS }),
      axios.get(`${SERVICES.cronograma}/schedule/${projectId}/progress`,   { timeout: TIMEOUT_MS }),
      axios.get(`${SERVICES.riesgos}/risks/${projectId}`,                  { timeout: TIMEOUT_MS }),
      axios.get(`${SERVICES.costos}/costs/${projectId}/total`,             { timeout: TIMEOUT_MS }),
      axios.get(`${SERVICES.cambios}/changes/${projectId}`,                { timeout: TIMEOUT_MS }),
    ]);

  const extract = (result, serviceName) => {
    if (result.status === 'fulfilled' && result.value?.data?.success) {
      return { ok: true, data: result.value.data.data };
    }
    const reason = result.reason?.message ?? 'Respuesta inválida o sin success:true';
    console.error(`[aggregator] Servicio ${serviceName} no disponible: ${reason}`);
    return { ok: false, data: null };
  };

  return {
    trazabilidad: extract(reqRes,    'trazabilidad'),
    calidad:      extract(qualRes,   'calidad'),
    cronograma:   extract(schedRes,  'cronograma'),
    riesgos:      extract(riskRes,   'riesgos'),
    costos:       extract(costRes,   'costos'),
    cambios:      extract(changeRes, 'cambios'),
  };
}

module.exports = { fetchAll };
