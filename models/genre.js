const Joi = require("joi");
const mongoose = require("mongoose");

const Genre = mongoose.model(
  "Genre",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      index: {
        unique: true,
        collation: { locale: "en", strength: 2 },
      },
    },
  })
);
