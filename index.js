//const winston = require('winston');
const express = require("express");
const app = express();
require("express-async-errors");
const winston = require("winston");
const config = require("config");

require("./startup/logging")();

if (process.env.NODE_ENV == "production") {
  require("./startup/prod")(app);
}

if (process.env.NODE_ENV != "production") {
  require("./startup/dev")(app);
}

require("./startup/config")();

require("./startup/routes")(app);
require("./startup/db")();

require("./startup/validation")();

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
