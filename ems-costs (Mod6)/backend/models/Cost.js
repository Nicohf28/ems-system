const costs = [];
let nextId = 1;

const Cost = {
  getAll() {
    return costs;
  },

  getByProjectId(projectId) {
    return costs.filter((cost) => cost.projectId === projectId);
  },

  create(data) {
    const newCost = {
      id: nextId++,
      projectId: data.projectId,
      concept: data.concept,
      amount: data.amount,
    };
    costs.push(newCost);
    return newCost;
  },
};

module.exports = Cost;
