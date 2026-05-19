const express = require("express");

const {
  createQuality,
  getQualityByProject
} = require("../controllers/qualityController");

const router = express.Router();

router.post("/quality", createQuality);

router.get("/quality/:projectId", getQualityByProject);

module.exports = router;