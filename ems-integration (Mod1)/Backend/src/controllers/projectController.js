const fs = require("fs");
const path = require("path");

const { getRisks } = require("../services/riskService");

const projectsPath = path.join(__dirname, "../data/projects.json");

// Leer proyectos
const readProjects = () => {
  const data = fs.readFileSync(projectsPath, "utf-8");
  return JSON.parse(data);
};

// Guardar proyectos
const saveProjects = (projects) => {
  fs.writeFileSync(
    projectsPath,
    JSON.stringify(projects, null, 2)
  );
};

// POST /projects
const createProject = (req, res) => {

  try {

    const { name, description } = req.body;

    // Validación obligatoria
    if (!name || name.trim() === "") {

      return res.status(400).json({
        success: false,
        message: "Name is required"
      });

    }

    const projects = readProjects();

    // Crear proyecto
    const newProject = {
      id: projects.length + 1,
      name,
      description: description || ""
    };

    projects.push(newProject);

    saveProjects(projects);

    return res.status(201).json({
      success: true,
      data: {
        projectId: newProject.id,
        name: newProject.name
      }
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
};

// GET /projects
const getProjects = (req, res) => {

  try {

    const projects = readProjects();

    return res.status(200).json({
      success: true,
      data: projects
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
};

// GET /projects/:projectId/summary
const getProjectSummary = async (req, res) => {

  try {

    const projectId = req.params.projectId;

    // Consumir microservicio riesgos
    const risks = await getRisks(projectId);

    // Contar riesgos activos
    const activeRisks = risks.filter(
      risk => risk.status === "active"
    ).length;

    return res.status(200).json({
      success: true,
      data: {
        projectId: Number(projectId),
        activeRisks
      }
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Servicio de riesgos no disponible"
    });

  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectSummary
};