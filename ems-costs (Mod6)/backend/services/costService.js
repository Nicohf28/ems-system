const Cost = require('../models/Cost');

const costService = {
  create(data) {
    const newCost = Cost.create(data);
    return newCost;
  },

  getByProjectId(projectId) {
    const costs = Cost.getByProjectId(projectId);
    return costs;
  },

  getTotalByProjectId(projectId) {
    const costs = Cost.getByProjectId(projectId);
    const totalCost = costs.reduce((sum, cost) => sum + cost.amount, 0);
    return { totalCost };
  },
};

module.exports = costService;
