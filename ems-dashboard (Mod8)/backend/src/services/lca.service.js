/**
 * lca.service.js — Estimación del Ciclo de Vida (LCA) del software
 *                  y Matriz Función/Costo
 *
 * ── CICLO DE VIDA (LCA) ──────────────────────────────────────────────────────
 *
 * Proyecta los costos operativos del software durante 5 años post-entrega,
 * usando tasas estándar de la industria sobre el costo de desarrollo.
 *
 * Tasas aplicadas (ajustables en las constantes al inicio del archivo):
 *   Mantenimiento correctivo/evolutivo : 20 % del costo de desarrollo / año
 *   Soporte y mesa de ayuda            :  5 % del costo de desarrollo / año
 *   Infraestructura / operación        :  3 % del costo de desarrollo / año
 *   ─────────────────────────────────────────────────────────────────
 *   Total anual operativo              : 28 % del costo de desarrollo / año
 *
 * Resultado: TCO (Total Cost of Ownership) a 5 años =
 *   costo_desarrollo + 5 × costo_anual_operativo
 *
 * ── MATRIZ FUNCIÓN / COSTO ───────────────────────────────────────────────────
 *
 * Clasifica cada requisito en cuatro cuadrantes según:
 *   - Valor institucional (0-100): derivado del estado QA y estado del requisito
 *   - Costo estimado ($):          basado en distribución del totalCost con
 *                                  ajuste por calidad (rechazo implica retrabajos)
 *
 * Cuadrantes:
 *   Alto valor + bajo costo  → MANTENER  (verde)
 *   Alto valor + alto costo  → OPTIMIZAR (ámbar)
 *   Bajo valor + bajo costo  → EVALUAR   (gris)
 *   Bajo valor + alto costo  → ELIMINAR  (rojo)
 *
 * Umbral de valor: 60 / 100
 * Umbral de costo: promedio de costo estimado entre todos los requisitos
 *
 * Fuentes de datos utilizadas:
 *   :3001 requirements → título, estado del requisito
 *   :3002 quality      → revisión QA por requirementId
 *   :3005 costs        → totalCost del proyecto
 */

// ── Tasas estándar de la industria (ajustables) ──────────────────────────────

const MAINTENANCE_RATE = 0.20; // mantenimiento correctivo y evolutivo
const SUPPORT_RATE     = 0.05; // soporte y mesa de ayuda
const INFRA_RATE       = 0.03; // infraestructura y operación
const PROJECTION_YEARS = 5;    // horizonte de proyección en años

// Umbral de valor institucional para cuadrante alto/bajo
const VALUE_THRESHOLD  = 60;

// ── LCA ──────────────────────────────────────────────────────────────────────

/**
 * Calcula la proyección de costos del ciclo de vida post-entrega.
 *
 * @param {number} totalCost - Costo de desarrollo del proyecto
 * @returns {object}         - Estructura LCA con proyecciones año a año
 */
function computeLCA(totalCost) {
  const devCost       = totalCost;
  const annualMaint   = Math.round(devCost * MAINTENANCE_RATE);
  const annualSupport = Math.round(devCost * SUPPORT_RATE);
  const annualInfra   = Math.round(devCost * INFRA_RATE);
  const annualTotal   = annualMaint + annualSupport + annualInfra;

  // Año 0 = entrega del software (solo costo de desarrollo)
  const projections = [{
    year:        0,
    label:       'Entrega',
    development: devCost,
    maintenance: 0,
    support:     0,
    infra:       0,
    annualTotal: devCost,
    cumulative:  devCost,
  }];

  let cumulative = devCost;
  for (let y = 1; y <= PROJECTION_YEARS; y++) {
    cumulative += annualTotal;
    projections.push({
      year:        y,
      label:       `Año ${y}`,
      development: 0,
      maintenance: annualMaint,
      support:     annualSupport,
      infra:       annualInfra,
      annualTotal,
      cumulative,
    });
  }

  return {
    developmentCost:      devCost,
    annualMaintenanceCost: annualMaint,
    annualSupportCost:    annualSupport,
    annualInfraCost:      annualInfra,
    annualOperationalCost: annualTotal,
    fiveYearTCO:          cumulative,
    projections,
    assumptions: {
      maintenanceRate:  MAINTENANCE_RATE,
      supportRate:      SUPPORT_RATE,
      infraRate:        INFRA_RATE,
      projectionYears:  PROJECTION_YEARS,
    },
  };
}

// ── FUNCIÓN / COSTO ───────────────────────────────────────────────────────────

/**
 * Calcula el valor institucional y el costo estimado de cada requisito,
 * y los clasifica en cuadrantes de la matriz Función/Costo.
 *
 * @param {Array}  requirements - Lista de requisitos del proyecto
 * @param {Array}  quality      - Lista de revisiones QA por requirementId
 * @param {number} totalCost    - Costo total del proyecto
 * @returns {Array}             - Lista de requisitos con score valor/costo y veredicto
 */
function computeFunctionCostMatrix(requirements, quality, totalCost) {
  if (!Array.isArray(requirements) || requirements.length === 0) return [];

  // Índice QA por requirementId para búsqueda O(1)
  const qualityMap = {};
  (quality || []).forEach(q => { qualityMap[q.requirementId] = q; });

  const baseCostPerReq = totalCost / requirements.length;

  const items = requirements.map(req => {
    const qReview = qualityMap[req.id];

    // ── Valor institucional (0-100) ──────────────────────────
    // Base 50. El estado del requisito y la revisión QA ajustan el valor.
    let value = 50;
    if (req.status === 'approved')          value += 20;
    else if (req.status === 'rejected')     value -= 20;

    if (qReview?.status === 'approved')     value += 30;
    else if (qReview?.status === 'rejected') value -= 30;

    value = Math.max(5, Math.min(100, value));

    // ── Costo estimado ───────────────────────────────────────
    // El rechazo en QA implica retrabajo (multiplica el costo base).
    let costMultiplier = 1.0;
    if (qReview?.status === 'rejected')     costMultiplier = 1.6;
    else if (qReview?.status === 'approved') costMultiplier = 0.8;

    const estimatedCost = Math.round(baseCostPerReq * costMultiplier);

    return {
      id:                req.id,
      title:             req.title || `Requisito ${req.id}`,
      requirementStatus: req.status,
      qualityStatus:     qReview?.status ?? 'sin_revision',
      qualityComment:    qReview?.comment ?? null,
      institutionalValue: Math.round(value),
      estimatedCost,
    };
  });

  // Umbral de costo = promedio de costo estimado entre todos los requisitos
  const avgCost = Math.round(items.reduce((s, i) => s + i.estimatedCost, 0) / items.length);

  // Clasificar en cuadrantes
  return items.map(item => {
    const highValue = item.institutionalValue >= VALUE_THRESHOLD;
    const highCost  = item.estimatedCost > avgCost;

    let verdict, verdictColor, verdictDesc;
    if  (highValue && !highCost) {
      verdict = 'MANTENER';  verdictColor = '#16a34a';
      verdictDesc = 'Alto valor con costo controlado. Priorizar su mantenimiento.';
    } else if (highValue && highCost) {
      verdict = 'OPTIMIZAR'; verdictColor = '#f59e0b';
      verdictDesc = 'Alto valor pero costo elevado. Buscar eficiencias sin perder valor.';
    } else if (!highValue && !highCost) {
      verdict = 'EVALUAR';   verdictColor = '#6b7280';
      verdictDesc = 'Bajo impacto y costo controlado. Reevaluar su prioridad.';
    } else {
      verdict = 'ELIMINAR';  verdictColor = '#dc2626';
      verdictDesc = 'Bajo valor con alto costo. Candidato a eliminacion o rediseno.';
    }

    return { ...item, verdict, verdictColor, verdictDesc, avgCost };
  });
}

module.exports = { computeLCA, computeFunctionCostMatrix, PROJECTION_YEARS };
