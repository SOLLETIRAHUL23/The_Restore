const mongoose = require("mongoose");

mongoose.connect(process.env.mongo_url);

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("mongo db connection sucessful");
});
connection.on("error", (err) => {
  console.log("mongo db connection falied");
});

module.exports = connection;
