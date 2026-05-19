const axios = require("axios");
const qualityReviews = require("../data/qualityData");

const VALID_STATUS = ["approved", "rejected"];

const createReview = async (data) => {
  const { projectId, requirementId, status, comment } = data;

  if (!projectId || !requirementId || !status) {
    throw new Error("Missing required fields");
  }

  if (!VALID_STATUS.includes(status)) {
    throw new Error("Invalid status");
  }

  // CONSULTAR módulo 2
  const response = await axios.get(
    `http://localhost:3001/requirements/${projectId}`
  );

  const requirements = response.data.data;

  const requirementExists = requirements.some(
    (req) => req.id === requirementId
  );

  if (!requirementExists) {
    throw new Error("Requirement not found");
  }

  const newReview = {
    id: qualityReviews.length + 1,
    projectId,
    requirementId,
    status,
    comment
  };

  qualityReviews.push(newReview);

  return newReview;
};

const getReviewsByProject = (projectId) => {
  return qualityReviews.filter(
    (review) => review.projectId === Number(projectId)
  );
};

module.exports = {
  createReview,
  getReviewsByProject
};