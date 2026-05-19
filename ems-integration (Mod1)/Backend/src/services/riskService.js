const axios = require("axios");

const getRisks = async (projectId) => {

  try {

    const response = await axios.get(
      `http://localhost:3004/risks/${projectId}`
    );

    return response.data.data;

  } catch (error) {

    throw new Error(
      "Servicio de riesgos no disponible"
    );

  }
};

module.exports = {
  getRisks
};