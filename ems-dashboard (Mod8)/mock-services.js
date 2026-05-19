/**
 * mock-services.js — Servidor mock que simula los 6 microservicios del EMS
 *
 * Uso: node mock-services.js
 *
 * Levanta un solo servidor Express en el puerto 4000 que responde
 * todos los endpoints que consume el Dashboard (Grupo 8).
 * Internamente redirige según el puerto que viene en la URL,
 * pero como solución más simple: levanta 6 mini-servidores en los
 * puertos 3001–3006 con datos de ejemplo.
 *
 * Ejecutar ANTES de iniciar el backend del dashboard.
 */

const http = require('http');

// ── Datos de ejemplo ──────────────────────────────────────────────────────────

const MOCK_DATA = {
  // :3001 GET /requirements/:id
  requirements: [
    { id: 1, projectId: 1, title: 'Login',            status: 'approved' },
    { id: 2, projectId: 1, title: 'Registro',         status: 'approved' },
    { id: 3, projectId: 1, title: 'Dashboard',        status: 'approved' },
    { id: 4, projectId: 1, title: 'Reportes',         status: 'approved' },
    { id: 5, projectId: 1, title: 'Exportar PDF',     status: 'approved' },
    { id: 6, projectId: 1, title: 'Notificaciones',   status: 'approved' },
    { id: 7, projectId: 1, title: 'Roles y permisos', status: 'approved' },
    { id: 8, projectId: 1, title: 'API pública',      status: 'approved' },
    { id: 9, projectId: 1, title: 'Integración SSO',  status: 'pending'  },
    { id:10, projectId: 1, title: 'App móvil',        status: 'pending'  },
  ],

  // :3002 GET /quality/:id
  quality: [
    { requirementId: 1, status: 'approved', comment: 'Correcto' },
    { requirementId: 2, status: 'approved', comment: 'Correcto' },
    { requirementId: 3, status: 'approved', comment: 'Correcto' },
    { requirementId: 4, status: 'approved', comment: 'Correcto' },
    { requirementId: 5, status: 'approved', comment: 'Correcto' },
    { requirementId: 6, status: 'approved', comment: 'Correcto' },
    { requirementId: 7, status: 'approved', comment: 'Correcto' },
    { requirementId: 8, status: 'rejected', comment: 'Falta documentación' },
  ],

  // :3003 GET /schedule/:id/progress
  schedule: { progress: 70 },

  // :3004 GET /risks/:id
  risks: [
    { id: 1, projectId: 1, risk: 'Retraso backend',   severity: 'high',   status: 'active'    },
    { id: 2, projectId: 1, risk: 'Falta de recursos', severity: 'medium', status: 'active'    },
    { id: 3, projectId: 1, risk: 'Dependencia API',   severity: 'low',    status: 'mitigated' },
  ],

  // :3005 GET /costs/:id/total
  costs: { totalCost: 3000 },

  // :3006 GET /changes/:id
  changes: [
    { id: 1, projectId: 1, change: 'Agregar reportes', impact: 'medium', status: 'pending'  },
    { id: 2, projectId: 1, change: 'Nuevo módulo',     impact: 'high',   status: 'approved' },
  ],
};

// ── Función para crear un mini-servidor ───────────────────────────────────────

function createServer(port, handler) {
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    handler(req, res);
  });
  server.listen(port, () =>
    console.log(`  [mock] :${port} listo`)
  );
}

// ── :3001 Trazabilidad ────────────────────────────────────────────────────────
createServer(3001, (_req, res) => {
  res.end(JSON.stringify({ success: true, data: MOCK_DATA.requirements }));
});

// ── :3002 Calidad ─────────────────────────────────────────────────────────────
createServer(3002, (_req, res) => {
  res.end(JSON.stringify({ success: true, data: MOCK_DATA.quality }));
});

// ── :3003 Cronograma ──────────────────────────────────────────────────────────
createServer(3003, (_req, res) => {
  res.end(JSON.stringify({ success: true, data: MOCK_DATA.schedule }));
});

// ── :3004 Riesgos ─────────────────────────────────────────────────────────────
createServer(3004, (_req, res) => {
  res.end(JSON.stringify({ success: true, data: MOCK_DATA.risks }));
});

// ── :3005 Costos ──────────────────────────────────────────────────────────────
createServer(3005, (_req, res) => {
  res.end(JSON.stringify({ success: true, data: MOCK_DATA.costs }));
});

// ── :3006 Cambios ─────────────────────────────────────────────────────────────
createServer(3006, (_req, res) => {
  res.end(JSON.stringify({ success: true, data: MOCK_DATA.changes }));
});

console.log('\nMock EMS iniciado. Servidores escuchando:');
