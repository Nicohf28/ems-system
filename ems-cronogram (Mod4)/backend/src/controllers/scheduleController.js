const TaskModel = require('../models/taskModel');
const { CCMService, computeProgress } = require('../services/ccmService');

// POST /schedule
const createTask = (req, res) => {
  const { projectId, task, days, progress, pessimistic, aggressive, dependencies, type } = req.body;

  if (!projectId && projectId !== 0) {
    return res.status(400).json({ success: false, message: 'projectId is required' });
  }
  if (!task || String(task).trim() === '') {
    return res.status(400).json({ success: false, message: 'task is required' });
  }
  if (days === undefined || days === null) {
    return res.status(400).json({ success: false, message: 'days is required' });
  }
  if (typeof days !== 'number' || days <= 0) {
    return res.status(400).json({ success: false, message: 'days must be a positive number' });
  }
  if (progress !== undefined && (typeof progress !== 'number' || progress < 0 || progress > 100)) {
    return res.status(400).json({ success: false, message: 'progress must be between 0 and 100' });
  }

  const newTask = TaskModel.create({
    projectId: Number(projectId),
    task: String(task).trim(),
    days: Number(days),
    progress: progress !== undefined ? Number(progress) : 0,
    pessimistic: pessimistic !== undefined ? Number(pessimistic) : Number(days),
    aggressive: aggressive !== undefined ? Number(aggressive) : Math.ceil(Number(days) * 0.5),
    dependencies: Array.isArray(dependencies) ? dependencies.map(Number) : [],
    type: type ?? 'normal',
  });

  return res.status(201).json({ success: true, data: { id: newTask.id } });
};

// GET /schedule/:projectId
const getSchedule = (req, res) => {
  const projectId = Number(req.params.projectId);
  if (isNaN(projectId)) {
    return res.status(400).json({ success: false, message: 'projectId must be numeric' });
  }
  const tasks = TaskModel.getByProject(projectId);
  return res.status(200).json({ success: true, data: tasks });
};

// GET /schedule/:projectId/progress
const getProgress = (req, res) => {
  const projectId = Number(req.params.projectId);
  if (isNaN(projectId)) {
    return res.status(400).json({ success: false, message: 'projectId must be numeric' });
  }
  const tasks = TaskModel.getByProject(projectId);
  const progress = computeProgress(tasks);
  return res.status(200).json({ success: true, data: { progress } });
};

// GET /schedule/:projectId/ccm  → análisis completo CCM
const getCCMAnalysis = (req, res) => {
  const projectId = Number(req.params.projectId);
  if (isNaN(projectId)) {
    return res.status(400).json({ success: false, message: 'projectId must be numeric' });
  }
  const analysis = CCMService.analyzeCCM(projectId);
  return res.status(200).json({ success: true, data: analysis });
};

// PUT /schedule/:id
const updateTask = (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: 'id must be numeric' });
  }
  const task = TaskModel.getById(id);
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  const { days, progress, pessimistic, aggressive } = req.body;
  if (days !== undefined && (typeof days !== 'number' || days <= 0)) {
    return res.status(400).json({ success: false, message: 'days must be a positive number' });
  }
  if (progress !== undefined && (typeof progress !== 'number' || progress < 0 || progress > 100)) {
    return res.status(400).json({ success: false, message: 'progress must be between 0 and 100' });
  }

  const updated = TaskModel.update(id, req.body);
  return res.status(200).json({ success: true, data: updated });
};

// DELETE /schedule/:id
const deleteTask = (req, res) => {
  const id = Number(req.params.id);
  const deleted = TaskModel.delete(id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
  return res.status(200).json({ success: true, data: { deleted: true } });
};

module.exports = { createTask, getSchedule, getProgress, getCCMAnalysis, updateTask, deleteTask };
