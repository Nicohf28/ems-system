const express = require("express");

const router = express.Router();
const {
  createRisk,
  getRisksByProject
} = require("../controllers/riskController");

// POST /risks
router.post("/risks", createRisk);

// GET /risks/:projectId
router.get("/risks/:projectId", getRisksByProject);

module.exports = router;