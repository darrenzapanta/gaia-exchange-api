const Joi = require("joi");
const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  offeredProducts: [
    {
      type: new mongoose.Schema({
        _id: String,
        title: String,
      }),
    },
  ],
  product: {
    type: new mongoose.Schema({
      _id: String,
      title: String,
    }),
    required: true,
    index: true,
  },
  money: {
    type: new mongoose.Schema({
      amount: Number,
      currency: {
        type: String,
        default: "USD",
      },
    }),
  },
  sender: {
    type: new mongoose.Schema({
      _id: String,
      displayName: String,
    }),
    required: true,
    index: true,
  },
  recipient: {
    type: new mongoose.Schema({
      _id: String,
      displayName: String,
    }),
    required: true,
    index: true,
  },
  notify: {
    type: Boolean,
    default: true,
    required: true,
  },
  additionalDetails: {
    type: String,
  },
  status: {
    type: String,
    enum: ["ACCEPTED", "REJECTED", "PENDING"],
    default: "PENDING",
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  messages: {
    type: [String],
  },
  unreadMessage: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const offerValidateSchema = {
  offeredProducts: Joi.array().items(
    Joi.object().keys({
      _id: Joi.string(),
      title: Joi.string(),
    })
  ),
  money: Joi.object().keys({
    amount: Joi.number(),
  }),
  product: Joi.object().keys({
    _id: Joi.string(),
    title: Joi.string(),
  }),
  additionalDetails: Joi.string().allow(""),
};

const validate = (offer) => {
  return Joi.object(offerValidateSchema).validate(offer);
};

const Offer = mongoose.model("Offer", offerSchema);

exports.Offer = Offer;
exports.validate = validate;
exports.validateSchema = offerValidateSchema;
