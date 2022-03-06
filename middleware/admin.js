module.exports = function (req, res, next) {
  if (req.user.role === "admin") {
    next();
  } else {
    return res.status(400).send("Not admin");
  }
};
