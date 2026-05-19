/**
 * app.js — Punto de entrada del backend Grupo 8 (Dashboard de Valor)
 *
 * Responsabilidad: configurar Express, registrar middlewares globales
 * y montar las rutas del módulo.
 *
 * Puerto: 3007 (configurable via .env → PORT)
 *
 * Rutas registradas:
 *   GET /health           → liveness check
 *   GET /dashboard/:id    → agrega 6 microservicios y calcula rentabilidad
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();
const PORT = process.env.PORT || 3007;

// Middlewares globales obligatorios (especificación EMS)
app.use(express.json());
app.use(cors());

// Rutas
app.use('/dashboard', dashboardRoutes);

/** Liveness check — permite verificar que el servicio está en pie */
app.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', service: 'grupo8-dashboard', port: PORT } });
});

// 404 catch-all — respuesta estructurada uniforme
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`[grupo8-dashboard] Backend corriendo en http://localhost:${PORT}`);
});

module.exports = app;
