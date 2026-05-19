const express = require('express');
const router = express.Router();
const {
  createTask,
  getSchedule,
  getProgress,
  getCCMAnalysis,
  updateTask,
  deleteTask,
} = require('../controllers/scheduleController');

router.post('/schedule', createTask);
router.get('/schedule/:projectId', getSchedule);
router.get('/schedule/:projectId/progress', getProgress);
router.get('/schedule/:projectId/ccm', getCCMAnalysis);
router.put('/schedule/:id', updateTask);
router.delete('/schedule/:id', deleteTask);

module.exports = router;
