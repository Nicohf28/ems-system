const requirementService = require('../services/requirementService');
const requirements = require('../models/requirementModel');

const createRequirement = (req, res) => {
  try {
    const requirement = requirementService.createRequirement(req.body);

    return res.status(201).json({
      success: true,
      data: {
        id: requirement.id
      }
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getRequirementsByProject = (req, res) => {
  try {
    const requirements = requirementService.getRequirementsByProject(
      req.params.projectId
    );

    return res.status(200).json({
      success: true,
      data: requirements
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateRequirement = (req, res) => {
  try {
    const requirement = requirementService.updateRequirement(
      req.params.id,
      req.body
    );

    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: 'Requirement not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: requirement
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteAllRequirements = (req, res) => {
  requirements.length = 0;

  return res.status(200).json({
    success: true,
    message: 'All requirements deleted'
  });
};

module.exports = {
  createRequirement,
  getRequirementsByProject,
  updateRequirement,
  deleteAllRequirements
};