const express = require("express");
const app = express();
const port = process.env.port || 5000;
app.listen(port, () =>
  console.log("Node.JS/Express Server started on port ${port}")
);
