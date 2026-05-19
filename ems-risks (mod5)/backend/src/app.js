const express = require("express");
const cors = require("cors");
require("dotenv").config();

const riskRoutes = require("./routes/riskRoutes");

const app = express();

// Middlewares obligatorios
app.use(cors());
app.use(express.json());

// Rutas
app.use("/", riskRoutes);

// Ruta base
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Risk service running"
  });
});

// Puerto obligatorio
const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(`Risk service running on port ${PORT}`);
});