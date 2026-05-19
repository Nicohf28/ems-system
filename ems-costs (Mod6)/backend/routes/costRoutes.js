const express = require('express');
const router = express.Router();
const costController = require('../controllers/costController');

router.post('/', costController.create);
router.get('/:projectId', costController.getByProjectId);
router.get('/:projectId/total', costController.getTotalByProjectId);

module.exports = router;
