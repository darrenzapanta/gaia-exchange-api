const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../../models/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const auth = require("../../middleware/auth");
const products = require("./products");

//base path /api/user

//get current user
router.get("/me", auth, async (req, res) => {
  const id = req.user._id;
  const user = await User.findById(id).select("-password");
  return res.send(user);
});

//register user
router.post("/register", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  req.body.email = req.body.email.toLowerCase();

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Email is already taken");

  user = await User.findOne({ displayName: req.body.displayName });
  if (user) return res.status(400).send("Display Name is already taken");

  user = new User(
    _.pick(req.body, [
      "firstName",
      "lastName",
      "displayName",
      "email",
      "password",
    ])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();

  user.id = user._id;

  return res.header("x-auth-header", token).send({ accessToken: token });
});

router.use("/:displayName/products", products);

module.exports = router;
