const { string } = require("joi");
const Joi = require("joi");
const mongoose = require("mongoose");

const Category = mongoose.model(
  "Category",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      index: {
        unique: true,
        collation: { locale: "en", strength: 2 },
      },
    },
    handle: {
      type: String,
      index: true,
      unique: true,
      required: true,
    },
  })
);

const validateSchema = {
  title: Joi.string().required(),
};

exports.Category = Category;
exports.validateSchema = validateSchema;
