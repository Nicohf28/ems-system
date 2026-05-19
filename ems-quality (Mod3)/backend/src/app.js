const express = require("express");
const cors = require("cors");

const qualityRoutes = require("./routes/qualityRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", qualityRoutes);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Quality service running on port ${PORT}`);
});