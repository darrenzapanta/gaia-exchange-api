const winston = require("winston");
const { combine, timestamp, prettyPrint } = winston.format;

module.exports = function () {
  winston.add(
    new winston.transports.File({
      format: combine(timestamp(), prettyPrint()),
      filename: "./logs/errorLogFile.log",
      level: "error",
    })
  );

  winston.add(
    new winston.transports.File({
      filename: "./logs/combinedLogFile.log",
      format: combine(timestamp(), prettyPrint()),
    })
  );

  winston.add(
    new winston.transports.File({
      filename: "./logs/info.log",
      format: combine(timestamp(), prettyPrint()),
      level: "info",
    })
  );

  winston.add(
    new winston.transports.File({
      filename: "./logs/debug.log",
      format: combine(timestamp(), prettyPrint()),
      level: "debug",
    })
  );

  winston.exceptions.handle(
    new winston.transports.Console({
      colorize: true,
      prettyPrint: true,
      timestamp: true,
    }),
    new winston.transports.File({ filename: "./logs/uncaughtExceptions.log" })
  );

  winston.add(
    new winston.transports.Console({
      format: winston.format.json(),
      colorize: true,
      prettyPrint: true,
      level: "debug",
      timestamp: true,
    })
  );

  process.on("unhandledRejection", (ex) => {
    console.log(ex);
    throw ex;
  });
};
