const express = require("express");
const router = express.Router();
const { Product, validate: validateProduct } = require("../../models/product");
const _ = require("lodash");
const auth = require("../../middleware/auth");
const productOwnership = require("../../middleware/productOwnership");

//get product by user
router.get("/", async (req, res) => {
  return res.send();
});

//get product by id
router.get("/:id", async (req, res) => {
  return res.send();
});

//update product
router.put("/:id", async (req, res) => {
  return res.send();
});

//delete product
router.delete("/:id", async (req, res) => {
  return res.send();
});

//post an item
router.post("/", async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const data = req.body;
  data.owner = {
    id: req.user._id,
    displayName: req.user.displayName,
  };

  const product = new Product(
    _.pick(req.body, [
      "title",
      "genre",
      "collections",
      "images",
      "description",
      "owner",
      "tags",
      "featuredImage",
    ])
  );

  await product.save();

  return res.send(product);
});

module.exports = router;
