const risks = require("../models/risks");

const validSeverities = ["low", "medium", "high"];
const validStatuses = ["active", "mitigated", "closed"];

// Crear riesgo
const createRisk = (req, res) => {
  try {
    const { projectId, risk, severity, status } = req.body;

    // Validar campos obligatorios
    if (
      projectId === undefined ||
      !risk ||
      !severity ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Validar projectId numérico
    if (typeof projectId !== "number") {
      return res.status(400).json({
        success: false,
        message: "projectId must be numeric"
      });
    }

    // Validar severity
    if (!validSeverities.includes(severity)) {
      return res.status(400).json({
        success: false,
        message: "Invalid severity"
      });
    }

    // Validar status
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const newRisk = {
      id: risks.length + 1,
      projectId,
      risk,
      severity,
      status
    };

    risks.push(newRisk);

    return res.status(201).json({
      success: true,
      data: newRisk
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Obtener riesgos por proyecto
const getRisksByProject = (req, res) => {
  try {
    const projectId = Number(req.params.projectId);

    if (isNaN(projectId)) {
      return res.status(400).json({
        success: false,
        message: "projectId must be numeric"
      });
    }

    const filteredRisks = risks.filter(
      (risk) => risk.projectId === projectId
    );

    return res.status(200).json({
      success: true,
      data: filteredRisks
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  createRisk,
  getRisksByProject
};