const express = require('express');

const router = express.Router();

const {
  createRequirement,
  getRequirementsByProject,
  updateRequirement,
  deleteAllRequirements,
} = require('../controllers/requirementController');

router.post('/', createRequirement);
router.get('/:projectId', getRequirementsByProject);
router.put('/:id', updateRequirement);
router.delete('/', deleteAllRequirements);

module.exports = router;