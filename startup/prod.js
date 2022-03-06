const helmet = require("helmet");
const compression = require("compression");
const winston = require("winston");
const cors = require("cors");

module.exports = function (app) {
  winston.info("prod startup init..");
  app.use(helmet());
  app.use(compression());

  app.use(
    cors({
      origin: [/.*./, "https://gaia-exchange-website.herokuapp.com"],
    })
  );
};
