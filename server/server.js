const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors()); // Allow all origins for now

require("dotenv").config();
const dbconfig = require("./config/dbconfig");
const port = process.env.PORT || 5000;

const userRoutes = require("./routes/userRoutes");

app.use("/api/users", require("./routes/userRoutes"));

app.listen(port, () =>
  console.log(`Node.JS/Express Server started on port ${port}`)
);
