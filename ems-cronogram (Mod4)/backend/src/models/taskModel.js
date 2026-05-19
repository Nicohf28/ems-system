// In-memory store
let tasks = [];
let nextId = 1;

/**
 * Modelo de tarea CCM:
 * id, projectId, task, days, progress,
 * pessimistic (días pesimistas para CCM),
 * aggressive (días agresivos CCM 50%),
 * dependencies (array de taskIds),
 * type: 'critical' | 'feeding' | 'normal'
 */

const TaskModel = {
  getAll() {
    return tasks;
  },

  getByProject(projectId) {
    return tasks.filter(t => t.projectId === projectId);
  },

  getById(id) {
    return tasks.find(t => t.id === id) || null;
  },

  create({ projectId, task, days, progress, pessimistic, aggressive, dependencies, type }) {
    const newTask = {
      id: nextId++,
      projectId,
      task,
      days: days ?? 1,
      progress: progress ?? 0,
      pessimistic: pessimistic ?? days ?? 1,
      aggressive: aggressive ?? Math.ceil((days ?? 1) * 0.5),
      dependencies: dependencies ?? [],
      type: type ?? 'normal',
    };
    tasks.push(newTask);
    return newTask;
  },

  update(id, fields) {
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    tasks[idx] = { ...tasks[idx], ...fields };
    return tasks[idx];
  },

  delete(id) {
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return false;
    tasks.splice(idx, 1);
    return true;
  },
};

module.exports = TaskModel;
