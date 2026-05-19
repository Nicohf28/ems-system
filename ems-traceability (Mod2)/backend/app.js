const express = require('express');
const cors = require('cors');
require('dotenv').config();

const requirementRoutes = require('./src/routes/requirementRoutes');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

app.use('/requirements', requirementRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});