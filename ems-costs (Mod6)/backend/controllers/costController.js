const costService = require('../services/costService');

const costController = {
  create(req, res) {
    try {
      let { projectId, concept, amount } = req.body;

      if (projectId === undefined || projectId === null) {
        return res.status(400).json({ success: false, message: 'projectId es obligatorio' });
      }

      projectId = Number(projectId);
      if (isNaN(projectId) || projectId <= 0 || !Number.isInteger(projectId)) {
        return res.status(400).json({ success: false, message: 'projectId debe ser un número entero positivo' });
      }

      if (concept === undefined || concept === null || String(concept).trim() === '') {
        return res.status(400).json({ success: false, message: 'concept es obligatorio y no puede estar vacío' });
      }
      concept = String(concept).trim();

      if (amount === undefined || amount === null) {
        return res.status(400).json({ success: false, message: 'amount es obligatorio' });
      }

      amount = Number(amount);
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ success: false, message: 'amount debe ser un número mayor a 0' });
      }

      const newCost = costService.create({ projectId, concept, amount });
      return res.status(201).json({ success: true, data: newCost });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  },

  getByProjectId(req, res) {
    try {
      const projectId = Number(req.params.projectId);

      if (isNaN(projectId) || projectId <= 0 || !Number.isInteger(projectId)) {
        return res.status(400).json({ success: false, message: 'projectId debe ser un número entero positivo' });
      }

      const costs = costService.getByProjectId(projectId);
      return res.status(200).json({ success: true, data: costs });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  },

  getTotalByProjectId(req, res) {
    try {
      const projectId = Number(req.params.projectId);

      if (isNaN(projectId) || projectId <= 0 || !Number.isInteger(projectId)) {
        return res.status(400).json({ success: false, message: 'projectId debe ser un número entero positivo' });
      }

      const total = costService.getTotalByProjectId(projectId);
      return res.status(200).json({ success: true, data: total });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  },
};

module.exports = costController;
