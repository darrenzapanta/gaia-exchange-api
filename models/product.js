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
    categories: {
      type: [String],
      required: true,
    },
    collections: {
      type: [String],
    },
    featuredImage: {
      type: new mongoose.Schema({
        url: String,
        thumbnail: String,
        retina: String,
      }),
      required: true,
    },
    images: {
      type: [
        new mongoose.Schema({
          url: String,
          thumbnail: String,
          retina: String,
        }),
      ],
    },
    description: {
      type: String,
    },
    owner: {
      type: new mongoose.Schema({
        _id: String,
        displayName: String,
      }),
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
  categories: Joi.array().items(Joi.string()).required(),
  collections: Joi.array().items(Joi.string()),
  images: Joi.array().items(
    Joi.object().keys({
      url: Joi.any(),
      thumbnail: Joi.any(),
      retina: Joi.any(),
      _id: Joi.any(),
    })
  ),
  description: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  featuredImage: Joi.object().keys({
    url: Joi.any(),
    thumbnail: Joi.any(),
    retina: Joi.any(),
    _id: Joi.any(),
  }),
  status: Joi.string().required(),
};

function validateProduct(product) {
  const schema = new Joi.object(validateProductSchema);

  return schema.validate(product);
}

exports.Product = Product;
exports.validate = validateProduct;
exports.validateProductSchema = validateProductSchema;
