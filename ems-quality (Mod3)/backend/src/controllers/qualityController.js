const qualityService = require("../services/qualityService");

const createQuality = async (req, res) => {
  try {
    const review = await qualityService.createReview(req.body);

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getQualityByProject = (req, res) => {
  try {
    const reviews = qualityService.getReviewsByProject(
      req.params.projectId
    );

    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createQuality,
  getQualityByProject
};