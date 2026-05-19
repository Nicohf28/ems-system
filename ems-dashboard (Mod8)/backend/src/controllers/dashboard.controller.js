// Autor: Favio Bernal — validacion de projectId y orquestacion del dashboard
/**
 * dashboard.controller.js — Controlador del endpoint de dashboard
 *
 * Orquesta la petición completa:
 *   1. Validar projectId (entero positivo)
 *   2. aggregatorService.fetchAll()  → llama los 6 microservicios en paralelo
 *   3. scoringService.compute()      → scores de las 6 dimensiones y veredicto
 *   4. lcaService.computeLCA()       → proyección del ciclo de vida a 5 años
 *   5. lcaService.computeFunctionCostMatrix() → matriz Función/Costo por requisito
 *   6. Responder 200 con todo el análisis integrado
 *
 * Errores:
 *   400 → projectId inválido
 *   500 → error inesperado en el cálculo
 *
 * Tolerancia a fallos:
 *   Si el servicio de costos no responde, lca y functionCostMatrix retornan null/[].
 *   Si trazabilidad o calidad no responden, functionCostMatrix retorna [].
 */
const aggregatorService = require('../services/aggregator.service');
const scoringService    = require('../services/scoring.service');
const lcaService        = require('../services/lca.service');

/**
 * GET /dashboard/:projectId
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
const getDashboard = async (req, res) => {
  const projectId = parseInt(req.params.projectId, 10);

  if (isNaN(projectId) || projectId <= 0) {
    return res.status(400).json({
      success: false,
      message: 'projectId debe ser un número entero positivo',
    });
  }

  try {
    // raw: { trazabilidad, calidad, cronograma, riesgos, costos, cambios }
    // Cada clave: { ok: boolean, data: any }
    const raw = await aggregatorService.fetchAll(projectId);

    // ── Scoring multidimensional ──────────────────────────────────────────────
    const result = scoringService.compute(projectId, raw);

    // ── LCA y Función/Costo (requieren datos de costos) ───────────────────────
    let lca                 = null;
    let functionCostMatrix  = [];

    if (raw.costos.ok && raw.costos.data?.totalCost > 0) {
      const totalCost    = raw.costos.data.totalCost;
      const requirements = raw.trazabilidad.ok ? (raw.trazabilidad.data || []) : [];
      const quality      = raw.calidad.ok      ? (raw.calidad.data      || []) : [];

      lca                = lcaService.computeLCA(totalCost);
      functionCostMatrix = lcaService.computeFunctionCostMatrix(requirements, quality, totalCost);
    }

    res.status(200).json({
      success: true,
      data: {
        ...result,
        lca,
        functionCostMatrix,
      },
    });
  } catch (err) {
    console.error('[dashboard.controller] Error interno:', err.message);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

module.exports = { getDashboard };
