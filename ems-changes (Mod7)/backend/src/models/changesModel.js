let changes = [];
let nextId = 1;

const getByProjectId = (projectId) => {
  return changes.filter(c => c.projectId === projectId);
};

const getById = (id) => {
  return changes.find(c => c.id === id) || null;
};

const create = ({ projectId, change, impact, status }) => {
  const newChange = {
    id: nextId++,
    projectId,
    change,
    impact,
    status
  };
  changes.push(newChange);
  return newChange;
};

const update = (id, { change, impact, status }) => {
  const index = changes.findIndex(c => c.id === id);
  if (index === -1) return null;
  if (change !== undefined) changes[index].change = change;
  if (impact !== undefined) changes[index].impact = impact;
  if (status !== undefined) changes[index].status = status;
  return changes[index];
};

module.exports = { getByProjectId, getById, create, update };
