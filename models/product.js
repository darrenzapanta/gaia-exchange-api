const Joi = require("joi");
const mongoose = require("mongoose");

const Product = mongoose.model(
  "Products",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    collections: {
      type: [String],
    },
    featuredImage: String,
    images: {
      type: [String],
    },
    description: {
      type: String,
    },
    owner: {
      type: mongoose.SchemaTypes.Mixed,
      required: true,
    },
    tags: {
      type: [String],
    },
    questions: {
      type: [
        new mongoose.Schema({
          userId: String,
          question: String,
          answer: String,
        }),
      ],
    },
    offers: {
      type: [mongoose.SchemaTypes.Mixed],
    },
    status: {
      type: String,
      default: "AVAILABLE",
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  })
);

const validateProductSchema = {
  title: Joi.string().min(3).required(),
  category: Joi.string().required(),
  collections: Joi.array().items(Joi.string()),
  images: Joi.array().items(Joi.string()),
  description: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  featuredImage: Joi.string().required(),
  status: Joi.string().required(),
};

function validateProduct(product) {
  const schema = new Joi.object(validateProductSchema);

  return schema.validate(product);
}

exports.Product = Product;
exports.validate = validateProduct;
exports.validateProductSchema = validateProductSchema;
