const cors = require("cors");
const winston = require("winston");

module.exports = function (app) {
  winston.info("dev startup init..");

  app.use(
    cors({
      origin: [/.*localhost.*/],
    })
  );
};
