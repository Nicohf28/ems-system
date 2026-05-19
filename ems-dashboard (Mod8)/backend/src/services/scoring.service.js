// Autor: Favio Bernal — algoritmo de scoring multidimensional v1.0
/**
 * scoring.service.js — Algoritmo de rentabilidad del Dashboard (Grupo 8)
 *
 * Responsabilidad: a partir de los datos crudos de los 6 microservicios,
 * calcular el score de cada dimensión (0-100), el score global ponderado
 * y emitir un veredicto RENTABLE / EN RIESGO / NO RENTABLE.
 *
 * ── Scores por dimensión ──────────────────────────────────────────────────────
 *
 *  Alcance   → (aprobados / total) × 100
 *              ok ≥ 70 | warning ≥ 40 | critical < 40
 *
 *  Progreso  → valor directo del servicio (0-100)
 *              ok ≥ 60 | warning ≥ 30 | critical < 30
 *
 *  Costos    → max(0, (1 − costo / BUDGET_BASE) × 100)   [inverso]
 *              ok ≥ 50 | warning ≥ 20 | critical < 20
 *
 *  Riesgos   → max(0, 100 − activos×10 − altos×15)
 *              ok ≥ 70 | warning ≥ 40 | critical < 40
 *
 *  Cambios   → max(0, 100 − pendientes×5 − altosImpacto×20)
 *              ok ≥ 70 | warning ≥ 40 | critical < 40
 *
 *  Calidad   → (aprobados / total) × 100  (si total=0 → 100)
 *              ok ≥ 75 | warning ≥ 50 | critical < 50
 *
 * ── Score global ──────────────────────────────────────────────────────────────
 *
 *  Pesos: alcance=0.20, progreso=0.20, costos=0.20,
 *         riesgos=0.20, cambios=0.10, calidad=0.10
 *
 *  Solo se incluyen dimensiones disponibles (score ≠ null).
 *  La suma de pesos se recalcula para normalizar si hay servicios caídos.
 *
 * ── Veredicto ─────────────────────────────────────────────────────────────────
 *
 *  score ≥ 70 → RENTABLE
 *  score ≥ 40 → EN RIESGO
 *  score <  40 → NO RENTABLE
 *
 * ── Tolerancia a fallos ───────────────────────────────────────────────────────
 *
 *  Si un servicio retorna { ok: false }, su dimensión queda con
 *  score: null y status: "unavailable", y se excluye del cálculo global.
 *  El sistema no se cae aunque fallen todos los servicios externos.
 *
 * ── Tests unitarios ───────────────────────────────────────────────────────────
 *
 *  Ejecutar: node src/services/scoring.service.js
 *  O desde raíz del backend: npm test
 */

// Presupuesto base — ajustable según el proyecto
const BUDGET_BASE = 10000;

/** Pesos de cada dimensión en el score global (deben sumar 1.0) */
const WEIGHTS = {
  alcance:  0.20,
  progreso: 0.20,
  costos:   0.20,
  riesgos:  0.20,
  cambios:  0.10,
  calidad:  0.10,
};

// ─── Scores por dimensión ────────────────────────────────────────────────────

function scoreAlcance(requirements) {
  if (!Array.isArray(requirements) || requirements.length === 0) return null;
  const total    = requirements.length;
  const approved = requirements.filter(r => r.status === 'approved').length;
  return { score: Math.round((approved / total) * 100), approved, total };
}

function scoreProgreso(scheduleData) {
  if (!scheduleData || scheduleData.progress == null) return null;
  return { score: scheduleData.progress };
}

function scoreCostos(costsData) {
  if (!costsData || costsData.totalCost == null) return null;
  const ratio = costsData.totalCost / BUDGET_BASE;
  return { score: Math.max(0, Math.round((1 - ratio) * 100)), totalCost: costsData.totalCost };
}

function scoreRiesgos(risks) {
  if (!Array.isArray(risks)) return null;
  const activeRisks = risks.filter(r => r.status === 'active').length;
  const highRisks   = risks.filter(r => r.status === 'active' && r.severity === 'high').length;
  const penalization = (activeRisks * 10) + (highRisks * 15);
  return { score: Math.max(0, 100 - penalization), activeRisks, highRisks };
}

function scoreCambios(changes) {
  if (!Array.isArray(changes)) return null;
  const pendingChanges          = changes.filter(c => c.status === 'pending').length;
  const highImpactPendingChanges = changes.filter(c => c.status === 'pending' && c.impact === 'high').length;
  const penalization = (pendingChanges * 5) + (highImpactPendingChanges * 20);
  return { score: Math.max(0, 100 - penalization), pendingChanges, highImpactPendingChanges };
}

function scoreCalidad(qualityData) {
  if (!Array.isArray(qualityData)) return null;
  const qualityApproved = qualityData.filter(q => q.status === 'approved').length;
  const qualityRejected = qualityData.filter(q => q.status === 'rejected').length;
  const total = qualityApproved + qualityRejected;
  return {
    score: total > 0 ? Math.round((qualityApproved / total) * 100) : 100,
    qualityApproved,
    qualityRejected,
  };
}

// ─── Status por dimensión ────────────────────────────────────────────────────

const STATUS_THRESHOLDS = {
  alcance:  [70, 40],
  progreso: [60, 30],
  costos:   [50, 20],
  riesgos:  [70, 40],
  cambios:  [70, 40],
  calidad:  [75, 50],
};

function getStatus(score, dimension) {
  const [ok, warning] = STATUS_THRESHOLDS[dimension];
  if (score >= ok)      return 'ok';
  if (score >= warning) return 'warning';
  return 'critical';
}

// ─── Construir objeto dimensión ──────────────────────────────────────────────

function buildDimension(name, scoreData, detailFn) {
  if (scoreData === null) {
    return { score: null, status: 'unavailable', detail: 'Servicio no disponible' };
  }
  return {
    score:  scoreData.score,
    status: getStatus(scoreData.score, name),
    detail: detailFn(scoreData),
  };
}

// ─── Razón del veredicto ─────────────────────────────────────────────────────

function getVerdictReason(dimensions) {
  const entries = Object.values(dimensions).filter(d => d.score !== null);
  const critical = entries.filter(d => d.status === 'critical').sort((a, b) => a.score - b.score);
  if (critical.length > 0) return critical[0].detail;
  const warning = entries.filter(d => d.status === 'warning').sort((a, b) => a.score - b.score);
  if (warning.length > 0) return warning[0].detail;
  const sorted = entries.slice().sort((a, b) => a.score - b.score);
  return sorted.length > 0 ? sorted[0].detail : 'Todas las métricas son favorables';
}

// ─── Función principal ───────────────────────────────────────────────────────

function compute(projectId, raw) {
  // Calcular scores intermedios
  const alcanceRaw  = raw.trazabilidad.ok ? scoreAlcance(raw.trazabilidad.data)     : null;
  const progresoRaw = raw.cronograma.ok   ? scoreProgreso(raw.cronograma.data)       : null;
  const costosRaw   = raw.costos.ok       ? scoreCostos(raw.costos.data)             : null;
  const riesgosRaw  = raw.riesgos.ok      ? scoreRiesgos(raw.riesgos.data)           : null;
  const cambiosRaw  = raw.cambios.ok      ? scoreCambios(raw.cambios.data)           : null;
  const calidadRaw  = raw.calidad.ok      ? scoreCalidad(raw.calidad.data)           : null;

  // Construir objeto dimensiones con detalle textual
  const dimensions = {
    alcance:  buildDimension('alcance',  alcanceRaw,  d => `${d.approved}/${d.total} requisitos aprobados`),
    progreso: buildDimension('progreso', progresoRaw, d => `Progreso al ${d.score}%`),
    costos:   buildDimension('costos',   costosRaw,   d => `Costo acumulado: $${d.totalCost.toLocaleString('es-CO')}`),
    riesgos:  buildDimension('riesgos',  riesgosRaw,  d => `${d.activeRisks} riesgo${d.activeRisks !== 1 ? 's' : ''} activo${d.activeRisks !== 1 ? 's' : ''}, ${d.highRisks} de severidad alta`),
    cambios:  buildDimension('cambios',  cambiosRaw,  d => `${d.pendingChanges} cambio${d.pendingChanges !== 1 ? 's' : ''} pendiente${d.pendingChanges !== 1 ? 's' : ''}, ${d.highImpactPendingChanges} de alto impacto`),
    calidad:  buildDimension('calidad',  calidadRaw,  d => `${d.qualityApproved}/${d.qualityApproved + d.qualityRejected} revisiones aprobadas`),
  };

  // Score global ponderado (solo dimensiones disponibles)
  const dimNames = Object.keys(WEIGHTS);
  let weightedSum = 0;
  let totalWeight = 0;
  for (const name of dimNames) {
    if (dimensions[name].score !== null) {
      weightedSum += dimensions[name].score * WEIGHTS[name];
      totalWeight += WEIGHTS[name];
    }
  }
  const rentabilityScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

  // Veredicto
  let verdict;
  if      (rentabilityScore >= 70) verdict = 'RENTABLE';
  else if (rentabilityScore >= 40) verdict = 'EN RIESGO';
  else                             verdict = 'NO RENTABLE';

  // Estado de servicios
  const servicesStatus = {
    trazabilidad: raw.trazabilidad.ok ? 'ok' : 'error',
    calidad:      raw.calidad.ok      ? 'ok' : 'error',
    cronograma:   raw.cronograma.ok   ? 'ok' : 'error',
    riesgos:      raw.riesgos.ok      ? 'ok' : 'error',
    costos:       raw.costos.ok       ? 'ok' : 'error',
    cambios:      raw.cambios.ok      ? 'ok' : 'error',
  };

  // Métricas planas para consumo fácil en el frontend
  const requirements             = alcanceRaw  ? alcanceRaw.total                       : 0;
  const approvedRequirements     = alcanceRaw  ? alcanceRaw.approved                    : 0;
  const progress                 = progresoRaw ? progresoRaw.score                      : 0;
  const totalCost                = costosRaw   ? costosRaw.totalCost                    : 0;
  const activeRisks              = riesgosRaw  ? riesgosRaw.activeRisks                 : 0;
  const highRisks                = riesgosRaw  ? riesgosRaw.highRisks                   : 0;
  const pendingChanges           = cambiosRaw  ? cambiosRaw.pendingChanges              : 0;
  const highImpactPendingChanges = cambiosRaw  ? cambiosRaw.highImpactPendingChanges    : 0;
  const qualityApproved          = calidadRaw  ? calidadRaw.qualityApproved             : 0;
  const qualityRejected          = calidadRaw  ? calidadRaw.qualityRejected             : 0;

  return {
    projectId,
    requirements,
    approvedRequirements,
    tasks: 0,
    progress,
    activeRisks,
    highRisks,
    totalCost,
    pendingChanges,
    highImpactPendingChanges,
    qualityApproved,
    qualityRejected,
    rentabilityScore,
    verdict,
    verdictReason: getVerdictReason(dimensions),
    dimensions,
    servicesStatus,
  };
}

// ─── Tests unitarios básicos ─────────────────────────────────────────────────

function runTests() {
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ✗ ${message}`);
      failed++;
    }
  }

  console.log('\n=== scoring.service.js — Tests unitarios ===\n');

  // Test 1: Proyecto saludable → RENTABLE
  console.log('Test 1: Proyecto con buenas métricas → RENTABLE');
  const raw1 = {
    trazabilidad: { ok: true, data: [
      { id: 1, status: 'approved' }, { id: 2, status: 'approved' },
      { id: 3, status: 'approved' }, { id: 4, status: 'approved' },
    ]},
    calidad:   { ok: true, data: [{ requirementId: 1, status: 'approved' }, { requirementId: 2, status: 'approved' }] },
    cronograma:{ ok: true, data: { progress: 85 } },
    riesgos:   { ok: true, data: [] },
    costos:    { ok: true, data: { totalCost: 1000 } },
    cambios:   { ok: true, data: [] },
  };
  const r1 = compute(1, raw1);
  assert(r1.verdict === 'RENTABLE', `verdict=RENTABLE (score=${r1.rentabilityScore})`);
  assert(r1.servicesStatus.trazabilidad === 'ok', 'servicesStatus.trazabilidad=ok');

  // Test 2: Riesgos altos + bajo progreso → NO RENTABLE o EN RIESGO
  console.log('\nTest 2: Muchos riesgos y costos elevados → no RENTABLE');
  const raw2 = {
    trazabilidad: { ok: true, data: [{ id: 1, status: 'rejected' }, { id: 2, status: 'rejected' }] },
    calidad:      { ok: true, data: [{ requirementId: 1, status: 'rejected' }] },
    cronograma:   { ok: true, data: { progress: 10 } },
    riesgos:      { ok: true, data: [
      { id: 1, severity: 'high', status: 'active' },
      { id: 2, severity: 'high', status: 'active' },
      { id: 3, severity: 'medium', status: 'active' },
    ]},
    costos:  { ok: true, data: { totalCost: 9500 } },
    cambios: { ok: true, data: [
      { id: 1, impact: 'high', status: 'pending' },
      { id: 2, impact: 'high', status: 'pending' },
    ]},
  };
  const r2 = compute(2, raw2);
  assert(r2.verdict !== 'RENTABLE', `verdict≠RENTABLE (score=${r2.rentabilityScore}, verdict=${r2.verdict})`);

  // Test 3: Todos los servicios caídos → score=0, no crash
  console.log('\nTest 3: Todos los servicios caídos → score=0, sin crash');
  const raw3 = {
    trazabilidad: { ok: false, data: null },
    calidad:      { ok: false, data: null },
    cronograma:   { ok: false, data: null },
    riesgos:      { ok: false, data: null },
    costos:       { ok: false, data: null },
    cambios:      { ok: false, data: null },
  };
  const r3 = compute(3, raw3);
  assert(r3.rentabilityScore === 0, `rentabilityScore=0`);
  assert(Object.values(r3.servicesStatus).every(s => s === 'error'), 'todos los servicios en error');
  assert(Object.values(r3.dimensions).every(d => d.status === 'unavailable'), 'todas las dimensiones unavailable');

  // Test 4: Verificación numérica del algoritmo (valores conocidos)
  console.log('\nTest 4: Verificación numérica (8/10 req, 70% progreso, $3000, 2 riesgos activos 1 alto, 1 pendiente, 7/8 calidad)');
  const raw4 = {
    trazabilidad: { ok: true, data: Array.from({ length: 10 }, (_, i) => ({ id: i+1, status: i < 8 ? 'approved' : 'pending' })) },
    calidad:      { ok: true, data: [
      ...Array.from({ length: 7 }, (_, i) => ({ requirementId: i+1, status: 'approved' })),
      { requirementId: 8, status: 'rejected' },
    ]},
    cronograma: { ok: true, data: { progress: 70 } },
    riesgos:    { ok: true, data: [
      { id: 1, severity: 'high',   status: 'active' },
      { id: 2, severity: 'medium', status: 'active' },
    ]},
    costos:  { ok: true, data: { totalCost: 3000 } },
    cambios: { ok: true, data: [{ id: 1, impact: 'medium', status: 'pending' }] },
  };
  const r4 = compute(1, raw4);
  // alcance=80, progreso=70, costos=70, riesgos=100-(20+15)=65, cambios=100-5=95, calidad=88
  // weighted = (80+70+70+65)*0.2 + 95*0.1 + 88*0.1 = 57 + 9.5 + 8.8 = 75.3 → 75
  assert(r4.dimensions.alcance.score  === 80, `alcance.score=80 (got ${r4.dimensions.alcance.score})`);
  assert(r4.dimensions.progreso.score === 70, `progreso.score=70`);
  assert(r4.dimensions.costos.score   === 70, `costos.score=70`);
  assert(r4.dimensions.riesgos.score  === 65, `riesgos.score=65`);
  assert(r4.dimensions.cambios.score  === 95, `cambios.score=95`);
  assert(r4.dimensions.calidad.score  === 88, `calidad.score=88`);
  assert(r4.rentabilityScore          === 75, `rentabilityScore=75 (got ${r4.rentabilityScore})`);
  assert(r4.verdict                   === 'RENTABLE', `verdict=RENTABLE`);

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
}

module.exports = { compute, runTests, BUDGET_BASE };

if (require.main === module) {
  runTests();
}
