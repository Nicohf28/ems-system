const express = require('express');
const cors = require('cors');
const costRoutes = require('./routes/costRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/costs', costRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

module.exports = app;
