const changesService = require('../services/changesService');

const createChange = (req, res) => {
  try {
    const result = changesService.createChange(req.body);
    if (result.error) {
      return res.status(result.code).json({ success: false, message: result.error });
    }
    return res.status(201).json({ success: true, data: { id: result.data.id } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const getChangesByProject = (req, res) => {
  try {
    const { projectId } = req.params;
    const result = changesService.getChangesByProject(projectId);
    if (result.error) {
      return res.status(result.code).json({ success: false, message: result.error });
    }
    return res.status(200).json({ success: true, data: result.data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const updateChange = (req, res) => {
  try {
    const { id } = req.params;
    const result = changesService.updateChange(id, req.body);
    if (result.error) {
      return res.status(result.code).json({ success: false, message: result.error });
    }
    return res.status(200).json({ success: true, data: result.data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

module.exports = { createChange, getChangesByProject, updateChange };
