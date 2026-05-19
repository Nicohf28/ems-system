const express = require("express");

const router = express.Router();

const {
  createProject,
  getProjects,
  getProjectSummary
} = require("../controllers/projectController");

// POST /projects
router.post("/", createProject);

// GET /projects
router.get("/", getProjects);

// GET /projects/:projectId/summary
router.get("/:projectId/summary", getProjectSummary);

module.exports = router;