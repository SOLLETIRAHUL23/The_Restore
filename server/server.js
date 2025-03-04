const express = require("express");
const app = express();
var cors = require("cors");

app.use(cors()); // Use this after the variable declaration
app.use(express.json());
const bodyParser = require("body-parser");
app.use(bodyParser.json());

require("dotenv").config();
const dbconfig = require("./config/dbconfig.js");
const port = process.env.PORT || 5000;

const userRoutes = require("./routes/userRoutes");
const productsRoute = require("./routes/productsRoute");

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", productsRoute);

app.listen(port, () =>
  console.log(`Node.JS/Express Server started on port ${port}`)
);
