const changesModel = require('../models/changesModel');

const VALID_STATUSES = ['pending', 'approved', 'rejected'];
const VALID_IMPACTS = ['low', 'medium', 'high'];

const createChange = (body) => {
  const { projectId, change, impact, status } = body;

  if (!projectId || !change || !impact || !status) {
    return { error: 'projectId, change, impact y status son obligatorios', code: 400 };
  }
  if (typeof projectId !== 'number' || projectId <= 0) {
    return { error: 'projectId debe ser un número positivo', code: 400 };
  }
  if (!change.toString().trim()) {
    return { error: 'change no puede estar vacío', code: 400 };
  }
  if (!VALID_STATUSES.includes(status)) {
    return { error: `status debe ser uno de: ${VALID_STATUSES.join(', ')}`, code: 400 };
  }
  if (!VALID_IMPACTS.includes(impact)) {
    return { error: `impact debe ser uno de: ${VALID_IMPACTS.join(', ')}`, code: 400 };
  }

  const newChange = changesModel.create({ projectId, change: change.trim(), impact, status });
  return { data: newChange };
};

const getChangesByProject = (projectId) => {
  const pid = parseInt(projectId);
  if (isNaN(pid) || pid <= 0) {
    return { error: 'projectId debe ser un número positivo', code: 400 };
  }
  const data = changesModel.getByProjectId(pid);
  return { data };
};

const updateChange = (id, body) => {
  const cid = parseInt(id);
  if (isNaN(cid) || cid <= 0) {
    return { error: 'id debe ser un número positivo', code: 400 };
  }

  const existing = changesModel.getById(cid);
  if (!existing) {
    return { error: 'Cambio no encontrado', code: 404 };
  }

  const { change, impact, status } = body;

  if (status && !VALID_STATUSES.includes(status)) {
    return { error: `status debe ser uno de: ${VALID_STATUSES.join(', ')}`, code: 400 };
  }
  if (impact && !VALID_IMPACTS.includes(impact)) {
    return { error: `impact debe ser uno de: ${VALID_IMPACTS.join(', ')}`, code: 400 };
  }
  if (change !== undefined && !change.toString().trim()) {
    return { error: 'change no puede estar vacío', code: 400 };
  }

  const updated = changesModel.update(cid, { change, impact, status });
  return { data: updated };
};

module.exports = { createChange, getChangesByProject, updateChange };
