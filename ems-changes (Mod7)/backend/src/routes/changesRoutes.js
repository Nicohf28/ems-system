const express = require('express');
const router = express.Router();
const changesController = require('../controllers/changesController');

router.post('/changes', changesController.createChange);
router.get('/changes/:projectId', changesController.getChangesByProject);
router.put('/changes/:id', changesController.updateChange);

module.exports = router;
