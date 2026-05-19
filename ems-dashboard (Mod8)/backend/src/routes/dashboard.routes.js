/**
 * dashboard.routes.js — Rutas del módulo Dashboard (Grupo 8)
 *
 * Prefijo base: /dashboard  (montado en app.js)
 *
 * Rutas:
 *   GET /:projectId  → retorna el dashboard completo de rentabilidad
 *                      para el proyecto indicado.
 */
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');

router.get('/:projectId', dashboardController.getDashboard);

module.exports = router;
