const express = require('express');
const cors = require('cors');
const changesRoutes = require('./src/routes/changesRoutes');

const app = express();
const PORT = process.env.PORT || 3006;

app.use(cors());
app.use(express.json());

app.use('/', changesRoutes);

app.listen(PORT, () => {
  console.log(`Servicio Cambios corriendo en puerto ${PORT}`);
});

module.exports = app;
