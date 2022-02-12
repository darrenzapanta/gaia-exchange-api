const express = require("express");
const user = require("../routes/user/index");
const auth = require("../routes/auth");
const error = require("../middleware/error");
const admin = require("../routes/admin/index");
const public = require("../routes/public/index");
const bodyParser = require("body-parser");

module.exports = function (app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use("/api/admin", admin),
    app.use("/api/public", public),
    app.use("/api/user", user);
  app.use("/api/auth", auth);
  app.use(error);
};
