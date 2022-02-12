const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  displayName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,

    index: {
      unique: true,
      collation: { locale: "en", strength: 2 },
    },
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,

    index: {
      unique: true,
      collation: { locale: "en", strength: 2 },
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isVerfied: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "user",
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      role: this.role,
      displayName: this.displayName,
      email: this.email,
    },
    config.get("jwtPrivateKey"),
    { expiresIn: "1 day" }
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    displayName: Joi.string().alphanum().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
