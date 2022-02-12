const helmet = require("helmet");
const compression = require("compression");
const winston = require("winston");

module.exports = function (app) {
  winston.info("prod startup init..");
  app.use(helmet());
  app.use(compression());
};
