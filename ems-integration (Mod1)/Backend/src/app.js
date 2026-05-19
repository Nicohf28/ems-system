const express = require("express");
const cors = require("cors");

const projectRoutes = require("./routes/projectRoutes");

const app = express();

// Middlewares obligatorios
app.use(cors());
app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: "EMS Equipo 1 funcionando"
    }
  });
});

// Rutas proyectos
app.use("/projects", projectRoutes);

// Puerto oficial equipo 1
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
