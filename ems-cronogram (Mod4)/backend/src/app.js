const express = require('express');
const cors = require('cors');
const scheduleRoutes = require('./routes/scheduleRoutes');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

app.use('/', scheduleRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint no encontrado' });
});

app.listen(PORT, () => {
  console.log(`Equipo 3 - Cronograma CCM corriendo en http://localhost:${PORT}`);
});
