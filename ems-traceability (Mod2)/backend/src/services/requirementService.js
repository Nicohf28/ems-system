const requirements = require('../models/requirementModel');

const validStatuses = ['pending', 'approved', 'rejected'];

const createRequirement = (data) => {
  const { projectId, title, description, status } = data;

  if (!projectId) {
    throw new Error('projectId is required');
  }

  if (isNaN(projectId)) {
    throw new Error('projectId must be numeric');
  }

  if (!title || title.trim() === '') {
    throw new Error('title is required');
  }

  if (!status) {
    throw new Error('status is required');
  }

  if (!validStatuses.includes(status)) {
    throw new Error('invalid status');
  }

  const newRequirement = {
    id: requirements.length + 1,
    projectId: Number(projectId),
    title,
    description: description || '',
    status
  };

  requirements.push(newRequirement);

  return newRequirement;
};

const getRequirementsByProject = (projectId) => {
  return requirements.filter(
    requirement => requirement.projectId === Number(projectId)
  );
};

const updateRequirement = (id, data) => {
  const requirement = requirements.find(
    requirement => requirement.id === Number(id)
  );

  if (!requirement) {
    return null;
  }

  const { title, description, status } = data;

  if (status && !validStatuses.includes(status)) {
    throw new Error('invalid status');
  }

  if (title !== undefined) {
    requirement.title = title;
  }

  if (description !== undefined) {
    requirement.description = description;
  }

  if (status !== undefined) {
    requirement.status = status;
  }

  return requirement;
};

module.exports = {
  createRequirement,
  getRequirementsByProject,
  updateRequirement
};