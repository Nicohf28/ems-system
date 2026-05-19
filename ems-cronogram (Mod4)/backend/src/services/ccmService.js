/**
 * Servicio de Cadena Crítica (CCM)
 * Implementa:
 * - Cálculo de cadena crítica (ruta más larga)
 * - Project Buffer (PB) = 50% de la cadena crítica usando tiempos pesimistas
 * - Feeding Buffers (FB) = 50% de cada cadena alimentadora
 * - Crashing: reducir duración agregando recursos (costo)
 * - Fast Tracking: ejecutar tareas en paralelo (riesgo)
 */

const TaskModel = require('../models/taskModel');

// ── Utilidades de grafo ────────────────────────────────────────────────

function buildGraph(tasks) {
  const map = {};
  tasks.forEach(t => { map[t.id] = t; });
  return map;
}

function topologicalSort(tasks) {
  const inDegree = {};
  const adj = {};
  tasks.forEach(t => {
    inDegree[t.id] = 0;
    adj[t.id] = [];
  });
  tasks.forEach(t => {
    (t.dependencies || []).forEach(dep => {
      if (adj[dep]) {
        adj[dep].push(t.id);
        inDegree[t.id]++;
      }
    });
  });

  const queue = tasks.filter(t => inDegree[t.id] === 0).map(t => t.id);
  const sorted = [];
  while (queue.length) {
    const node = queue.shift();
    sorted.push(node);
    adj[node].forEach(next => {
      inDegree[next]--;
      if (inDegree[next] === 0) queue.push(next);
    });
  }
  return sorted;
}

// Earliest finish usando duración aggressive (50%) para CCM
function computeEarliestFinish(tasks) {
  const graph = buildGraph(tasks);
  const order = topologicalSort(tasks);
  const ef = {};   // earliest finish
  const es = {};   // earliest start

  order.forEach(id => {
    const task = graph[id];
    const duration = task.aggressive ?? task.days;
    const depFinishes = (task.dependencies || []).map(d => ef[d] ?? 0);
    es[id] = depFinishes.length ? Math.max(...depFinishes) : 0;
    ef[id] = es[id] + duration;
  });

  return { ef, es, graph, order };
}

// Encontrar la cadena crítica (ruta más larga por tiempos aggressive)
function findCriticalChain(tasks) {
  if (!tasks.length) return [];
  const { ef, es, graph, order } = computeEarliestFinish(tasks);

  // Nodo con mayor finish = fin del proyecto
  const projectEnd = Math.max(...Object.values(ef));

  // Rastrear hacia atrás desde el nodo con mayor EF
  const endNode = order.find(id => ef[id] === projectEnd);
  const chain = [];
  let current = endNode;

  while (current !== undefined) {
    chain.unshift(current);
    const deps = graph[current]?.dependencies || [];
    if (!deps.length) break;
    // el predecesor con mayor EF es parte de la cadena crítica
    current = deps.reduce((prev, d) => (ef[d] > (ef[prev] ?? -1) ? d : prev), deps[0]);
  }
  return chain;
}

// ── Cálculo de Buffers ─────────────────────────────────────────────────

function calcProjectBuffer(tasks, criticalChain) {
  // PB = 50% de la suma de varianzas de la cadena crítica
  // varianza por tarea = ((pesimista - aggressive) / 2)^2   (método raíz cuadrada)
  const chainTasks = tasks.filter(t => criticalChain.includes(t.id));
  const sumVariance = chainTasks.reduce((acc, t) => {
    const spread = (t.pessimistic - t.aggressive) / 2;
    return acc + spread * spread;
  }, 0);
  return Math.ceil(Math.sqrt(sumVariance));
}

function calcFeedingBuffers(tasks, criticalChain) {
  const buffers = [];
  const ccSet = new Set(criticalChain);

  // Cadenas alimentadoras: tareas que NO están en CC pero conectan a ella
  tasks.forEach(t => {
    if (ccSet.has(t.id)) return;
    const feedsCC = (t.dependencies || []).some(d => ccSet.has(d)) ||
      tasks.some(cc => ccSet.has(cc.id) && (cc.dependencies || []).includes(t.id));
    if (!feedsCC) return;

    // Trazar cadena alimentadora hacia atrás
    const feedingChain = [t.id];
    let cursor = t;
    while (cursor.dependencies && cursor.dependencies.length) {
      const prev = tasks.find(x => cursor.dependencies.includes(x.id) && !ccSet.has(x.id));
      if (!prev) break;
      feedingChain.unshift(prev.id);
      cursor = prev;
    }

    const feedingTasks = tasks.filter(x => feedingChain.includes(x.id));
    const sumVar = feedingTasks.reduce((acc, x) => {
      const spread = (x.pessimistic - x.aggressive) / 2;
      return acc + spread * spread;
    }, 0);
    const fb = Math.ceil(Math.sqrt(sumVar));

    buffers.push({
      feedingChain,
      feedingBuffer: fb,
      insertBefore: t.id,
    });
  });

  return buffers;
}

// ── Crashing ───────────────────────────────────────────────────────────

/**
 * Crashing: reducir duración de tareas en la cadena crítica
 * añadiendo recursos. Asume costo adicional proporcional.
 * crashCostPerDay: costo por día reducido (default 100)
 */
function analyzeCrashing(tasks, criticalChain, crashCostPerDay = 100) {
  const chainTasks = tasks.filter(t => criticalChain.includes(t.id));
  const options = chainTasks.map(t => {
    const maxReduction = Math.max(0, t.aggressive - 1); // no menos de 1 día
    return {
      taskId: t.id,
      taskName: t.task,
      currentDays: t.aggressive,
      minDays: 1,
      maxReductionDays: maxReduction,
      crashCost: maxReduction * crashCostPerDay,
      recommendation: maxReduction > 0
        ? `Reducir ${maxReduction} día(s) por $${maxReduction * crashCostPerDay}`
        : 'No se puede reducir más',
    };
  });

  const totalPotentialReduction = options.reduce((a, o) => a + o.maxReductionDays, 0);
  const totalCrashCost = options.reduce((a, o) => a + o.crashCost, 0);

  return { options, totalPotentialReduction, totalCrashCost };
}

// ── Fast Tracking ──────────────────────────────────────────────────────

/**
 * Fast Tracking: solapar tareas secuenciales para ganar tiempo
 * Propone ejecutar tareas en paralelo con % de solapamiento
 * overlap: fracción de solapamiento (0.5 = 50%)
 */
function analyzeFastTracking(tasks, criticalChain, overlap = 0.5) {
  const chainTasks = tasks.filter(t => criticalChain.includes(t.id));
  const pairs = [];

  for (let i = 0; i < chainTasks.length - 1; i++) {
    const current = chainTasks[i];
    const next = chainTasks[i + 1];
    const savedDays = Math.floor(current.aggressive * overlap);

    pairs.push({
      task1Id: current.id,
      task1Name: current.task,
      task2Id: next.id,
      task2Name: next.task,
      overlapPercent: overlap * 100,
      savedDays,
      riskLevel: savedDays > 3 ? 'high' : savedDays > 1 ? 'medium' : 'low',
      recommendation: `Iniciar "${next.task}" cuando "${current.task}" lleve ${Math.ceil((1 - overlap) * 100)}% completado. Ahorra ${savedDays} día(s).`,
    });
  }

  const totalSavedDays = pairs.reduce((a, p) => a + p.savedDays, 0);
  return { pairs, totalSavedDays };
}

// ── Análisis de progreso ───────────────────────────────────────────────

function computeProgress(tasks) {
  if (!tasks.length) return 0;
  const avg = tasks.reduce((a, t) => a + (t.progress ?? 0), 0) / tasks.length;
  return Math.round(avg);
}

// ── Servicio principal ─────────────────────────────────────────────────

const CCMService = {
  analyzeCCM(projectId) {
    const tasks = TaskModel.getByProject(Number(projectId));
    if (!tasks.length) {
      return {
        criticalChain: [],
        projectBuffer: 0,
        feedingBuffers: [],
        crashing: { options: [], totalPotentialReduction: 0, totalCrashCost: 0 },
        fastTracking: { pairs: [], totalSavedDays: 0 },
        totalDuration: 0,
        progress: 0,
      };
    }

    const criticalChain = findCriticalChain(tasks);
    const projectBuffer = calcProjectBuffer(tasks, criticalChain);
    const feedingBuffers = calcFeedingBuffers(tasks, criticalChain);
    const crashing = analyzeCrashing(tasks, criticalChain);
    const fastTracking = analyzeFastTracking(tasks, criticalChain);

    const { ef } = computeEarliestFinish(tasks);
    const totalDuration = ef[criticalChain[criticalChain.length - 1]] ?? 0;
    const progress = computeProgress(tasks);

    return {
      criticalChain,
      projectBuffer,
      feedingBuffers,
      crashing,
      fastTracking,
      totalDuration,
      totalDurationWithBuffer: totalDuration + projectBuffer,
      progress,
    };
  },
};

module.exports = { CCMService, computeProgress };
